<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\TherapistAttendance;
use App\Models\Branch;
use App\Services\TherapistAttendanceService;
use App\Http\Requests\StoreTherapistAttendanceRequest;
use App\Http\Requests\UpdateTherapistAttendanceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TherapistAttendanceController extends Controller
{
    public function __construct(private TherapistAttendanceService $attendanceService)
    {
    }

    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $date = Carbon::today()->toDateString();

        $attendances = $this->attendanceService->getAttendances($user, $date);

        $branchId = $user->isSuperadmin() ? $request->input('branch_id') : $user->branch_id;
        $availableTherapists = [];

        if ($branchId) {
            $availableTherapists = \App\Models\Therapist::whereHas('branches', function ($q) use ($branchId) {
                $q->where('branches.id', $branchId);
            })->whereDoesntHave('attendances', function ($q) use ($branchId) {
                $q->whereDate('check_in', Carbon::today())
                  ->where('branch_id', $branchId);
            })->get(['id', 'name', 'phone']);
        }

        $branches = $user->isSuperadmin() ? Branch::orderBy('name')->get() : [];

        return Inertia::render('Attendance/Therapists/Index', [
            'attendances' => $attendances,
            'date' => $date,
            'branches' => $branches,
            'availableTherapists' => $availableTherapists,
            'currentBranchId' => (int) $branchId,
        ]);
    }

    public function store(StoreTherapistAttendanceRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        try {
            $this->attendanceService->store($request->validated(), $user);
            return back()->with('success', 'Therapist checked in.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateTherapistAttendanceRequest $request, string $id): RedirectResponse
    {
        $attendance = TherapistAttendance::findOrFail((int)$id);
        $this->attendanceService->update($attendance, $request->validated());
        return back()->with('success', 'Attendance updated.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $attendance = TherapistAttendance::findOrFail((int)$id);
        $this->attendanceService->destroy($attendance);
        return back()->with('success', 'Attendance record deleted.');
    }
}
