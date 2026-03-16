<?php

namespace App\Http\Controllers;

use App\Models\TherapistAttendance;
use App\Models\Therapist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TherapistAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $date = $request->input('date', Carbon::today()->toDateString());

        $query = TherapistAttendance::with(['therapist', 'branch'])
            ->whereDate('check_in', $date);

        if (!$user->isSuperadmin()) {
            $query->where('branch_id', $user->branch_id);
        }

        $attendances = $query->latest('check_in')->get();

        return Inertia::render('Attendance/Therapists/Index', [
            'attendances' => $attendances,
            'date' => $date,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'therapist_identifier' => 'required|string',
        ]);

        $search = $request->therapist_identifier;
        $therapist = Therapist::where('phone', $search)
            ->orWhereHas('branches', function ($q) use ($search) {
                $q->where('therapist_branches.card_number', $search);
            })->first();

        if (!$therapist) {
            return back()->with('error', 'Therapist not found.');
        }

        if (!$user->isSuperadmin()) {
            $inBranch = $therapist->branches()->where('branches.id', $user->branch_id)->exists();
            if (!$inBranch) {
                return back()->with('error', 'Therapist is not in this branch.');
            }
        }

        $branchId = $user->isSuperadmin() ? ($request->branch_id ?? $user->branch_id) : $user->branch_id;

        // Check double check-in
        $existing = TherapistAttendance::where('therapist_id', $therapist->id)
            ->where('branch_id', $branchId)
            ->whereDate('check_in', Carbon::today())
            ->whereNull('check_out')
            ->exists();

        if ($existing) {
            return back()->with('error', 'Therapist is already checked in.');
        }

        TherapistAttendance::create([
            'therapist_id' => $therapist->id,
            'branch_id' => $branchId,
            'check_in' => now(),
        ]);

        return back()->with('success', 'Therapist checked in.');
    }

    public function update(Request $request, $id)
    {
        $attendance = TherapistAttendance::findOrFail($id);

        if ($request->has('check_out_now')) {
            $attendance->update(['check_out' => now()]);
            return back()->with('success', 'Therapist checked out.');
        }

        $attendance->update($request->only(['check_in', 'check_out']));
        return back()->with('success', 'Attendance updated.');
    }

    public function destroy($id)
    {
        $attendance = TherapistAttendance::findOrFail($id);
        $attendance->delete();
        return back()->with('success', 'Attendance record deleted.');
    }
}
