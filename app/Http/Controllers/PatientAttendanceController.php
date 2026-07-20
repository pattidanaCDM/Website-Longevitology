<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\PatientAttendance;
use App\Models\Branch;
use App\Services\PatientAttendanceService;
use App\Http\Requests\StorePatientAttendanceRequest;
use App\Http\Requests\UpdatePatientAttendanceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PatientAttendanceExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\Response as HttpResponse;

class PatientAttendanceController extends Controller
{
    public function __construct(private PatientAttendanceService $attendanceService)
    {
    }

    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $date = Carbon::today()->toDateString();

        $attendances = $this->attendanceService->getAttendances($user, $date);
        $therapists = $this->attendanceService->getAvailableTherapists($user, $date);

        $branchId = $user->isSuperadmin() ? $request->input('branch_id') : $user->branch_id;
        $availablePatients = [];

        if ($branchId) {
            $availablePatients = \App\Models\Patient::whereHas('branches', function ($q) use ($branchId) {
                $q->where('branches.id', $branchId);
            })->whereDoesntHave('attendances', function ($q) use ($branchId) {
                $q->whereDate('check_in', Carbon::today())
                  ->where('branch_id', $branchId);
            })->get(['id', 'name', 'phone', 'initial_complaint', 'current_complaint']);
        }

        $branches = $user->isSuperadmin() ? Branch::orderBy('name')->get() : [];

        return Inertia::render('Attendance/Patients/Index', [
            'attendances' => $attendances,
            'date' => $date,
            'therapists' => $therapists,
            'branches' => $branches,
            'availablePatients' => $availablePatients,
            'currentBranchId' => (int) $branchId,
        ]);
    }

    public function exportExcel(Request $request): BinaryFileResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $date = is_string($request->input('date')) ? $request->input('date') : Carbon::today()->toDateString();

        $attendances = $this->attendanceService->getAttendances($user, $date);

        return Excel::download(new PatientAttendanceExport($attendances), 'absensi_pasien_' . $date . '.xlsx');
    }

    public function exportPdf(Request $request): HttpResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $date = is_string($request->input('date')) ? $request->input('date') : Carbon::today()->toDateString();

        $attendances = $this->attendanceService->getAttendances($user, $date);

        $pdf = Pdf::loadView('exports.attendance_pdf', compact('attendances', 'date'));
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('absensi_pasien_' . $date . '.pdf');
    }

    public function store(StorePatientAttendanceRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        try {
            $patient = $this->attendanceService->store($request->validated(), $user);
            return back()->with('success', "Patient checked in successfully. Current Complaint: {$patient->current_complaint}");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdatePatientAttendanceRequest $request, string $id): RedirectResponse
    {
        $attendance = PatientAttendance::findOrFail((int)$id);
        $this->attendanceService->update($attendance, $request->validated());
        return back()->with('success', 'Attendance updated.');
    }

    public function checkoutAll(Request $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $date = Carbon::today()->toDateString();
        
        $this->attendanceService->checkoutAll($user, $date);
        
        return back()->with('success', 'Semua pasien berhasil di-checkout.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $attendance = PatientAttendance::findOrFail((int)$id);
        $this->attendanceService->destroy($attendance);
        return back()->with('success', 'Attendance record deleted.');
    }
}
