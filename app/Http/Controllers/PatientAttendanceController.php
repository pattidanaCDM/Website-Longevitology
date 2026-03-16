<?php

namespace App\Http\Controllers;

use App\Models\PatientAttendance;
use App\Models\Branch;
use App\Models\Patient;
use App\Models\Therapist;
use App\Models\TherapistAttendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PatientAttendanceExport;
use Barryvdh\DomPDF\Facade\Pdf;

class PatientAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $date = $request->input('date', Carbon::today()->toDateString());

        // Get Patient Attendance for the selected date
        $query = PatientAttendance::with(['patient.branches', 'therapists', 'branch'])
            ->whereDate('check_in', $date);

        if (!$user->isSuperadmin()) {
            $query->where('branch_id', $user->branch_id);
        }

        $attendances = $query->latest('check_in')->get()->map(function ($attendance) {
            // Attach card_number to the patient object for easier frontend access
            if ($attendance->patient && $attendance->branch_id) {
                $branchPivot = $attendance->patient->branches
                    ->where('id', $attendance->branch_id)
                    ->first();

                $attendance->patient->card_number = $branchPivot ? $branchPivot->pivot->card_number : null;
            }
            return $attendance;
        });

        // Get Therapists who have checked in TODAY at this branch
        // We only want therapists who have an attendance record for the selected date

        $availableTherapistsQuery = Therapist::whereHas('attendances', function ($q) use ($date, $user) {
            $q->whereDate('check_in', $date);

            if (!$user->isSuperadmin()) {
                $q->where('branch_id', $user->branch_id);
            }
        });

        if (!$user->isSuperadmin()) {
            $availableTherapistsQuery->whereHas('branches', function ($q) use ($user) {
                $q->where('branches.id', $user->branch_id);
            });
        }

        return Inertia::render('Attendance/Patients/Index', [
            'attendances' => $attendances,
            'date' => $date,
            'therapists' => $availableTherapistsQuery->get(),
        ]);
    }

    public function exportExcel(Request $request)
    {
        $user = Auth::user();
        $date = $request->input('date', Carbon::today()->toDateString());

        $query = PatientAttendance::with(['patient.branches', 'therapists', 'branch'])
            ->whereDate('check_in', $date);

        if (!$user->isSuperadmin()) {
            $query->where('branch_id', $user->branch_id);
        }

        $attendances = $query->latest('check_in')->get();

        return Excel::download(new PatientAttendanceExport($attendances), 'absensi_pasien_' . $date . '.xlsx');
    }

    public function exportPdf(Request $request)
    {
        $user = Auth::user();
        $date = $request->input('date', Carbon::today()->toDateString());

        $query = PatientAttendance::with(['patient.branches', 'therapists', 'branch'])
            ->whereDate('check_in', $date);

        if (!$user->isSuperadmin()) {
            $query->where('branch_id', $user->branch_id);
        }

        $attendances = $query->latest('check_in')->get();

        $pdf = Pdf::loadView('exports.attendance_pdf', compact('attendances', 'date'));
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('absensi_pasien_' . $date . '.pdf');
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'patient_identifier' => 'required|string', // Card Number or Phone
            'therapist_ids' => 'nullable|array',
            'therapist_ids.*' => 'exists:therapists,id',
            'complaint' => 'nullable|string',
        ]);

        // Find Patient by Card Number or Phone (Global Search)
        // But for check-in, they should probably be registered/verified in the branch first?
        // Or if global search finds them, we can verify implicitly? 
        // Let's stick to simple: Find by card/phone.
        $search = $request->patient_identifier;
        $patient = Patient::where('phone', $search)
            ->orWhereHas('branches', function ($query) use ($search) {
                $query->where('patient_branches.card_number', $search);
            })->first();

        if (!$patient) {
            return back()->with('error', 'Patient not found.');
        }

        // Check if patient is assigned to this branch? 
        // If not, maybe auto-extend? For now, let's just check if they are in the branch or if superadmin.
        if (!$user->isSuperadmin()) {
            // Simplified: If they are here, they can check in. But strictly, should be in branch.
            // Let's allow check-in and maybe warn, or just allow. 
            // The prompt "extend to their branch" implies strict branch membership.
            // So if not in branch, we should probably error or auto-verifiy. 
            // For Attendance, let's assume they MUST be verifying first via the Patients page if they are new.
            // But to be user friendly, let's check membership.
            $inBranch = $patient->branches()->where('branches.id', $user->branch_id)->exists();
            if (!$inBranch) {
                return back()->with('error', 'Patient is not registered in this branch. Please verify/add them first in Manage Patients.');
            }
        }

        $branchId = $user->isSuperadmin() ? ($request->branch_id ?? $user->branch_id) : $user->branch_id;

        // Check for double check-in
        $existing = PatientAttendance::where('patient_id', $patient->id)
            ->where('branch_id', $branchId)
            ->whereDate('check_in', Carbon::today())
            ->whereNull('check_out')
            ->exists();

        if ($existing) {
            return back()->with('error', 'Patient is already checked in.');
        }

        DB::transaction(function () use ($request, $patient, $branchId) {
            // Update patient's current complaint if provided
            if ($request->has('complaint') && $request->filled('complaint')) {
                $patient->update(['current_complaint' => $request->complaint]);
            }

            // Snapshot the complaint for history
            $complaintToSnapshot = $request->complaint ?? $patient->current_complaint;

            $attendance = PatientAttendance::create([
                'patient_id' => $patient->id,
                'branch_id' => $branchId,
                'check_in' => now(),
                'complaint' => $complaintToSnapshot,
            ]);

            if ($request->has('therapist_ids')) {
                $attendance->therapists()->attach($request->therapist_ids);
            }
        });

        return back()->with('success', "Patient checked in successfully. Current Complaint: {$patient->current_complaint}");
    }

    public function update(Request $request, $id)
    {
        $attendance = PatientAttendance::findOrFail($id);

        // Handle Check-out or Edit
        if ($request->has('check_out_now')) {
            $attendance->update(['check_out' => now()]);
            return back()->with('success', 'Patient checked out.');
        }

        // Handle adding/updating therapists explicitly
        if ($request->has('therapist_ids')) {
            $attendance->therapists()->sync($request->therapist_ids);
            // If they are just updating therapists, we probably shouldn't require check_in/check_out keys
            // But let's check if the request contains them
        }

        if ($request->has('check_in') || $request->has('check_out')) {
            $attendance->update($request->only(['check_in', 'check_out']));
        }

        return back()->with('success', 'Attendance updated.');
    }

    public function destroy($id)
    {
        $attendance = PatientAttendance::findOrFail($id);
        $attendance->delete();
        return back()->with('success', 'Attendance record deleted.');
    }
}
