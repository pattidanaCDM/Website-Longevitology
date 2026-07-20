<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\PatientAttendance;
use App\Models\TherapistAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PatientAttendanceExport;
use App\Exports\TherapistAttendanceExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\Response as HttpResponse;

class AttendanceArchiveController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $branchId = $user->isSuperadmin() ? $request->input('branch_id') : $user->branch_id;
        $date = $request->input('date');

        $availableDates = [];

        if ($branchId) {
            // Get unique dates from patient attendances
            $patientDates = PatientAttendance::where('branch_id', $branchId)
                ->select(DB::raw('DATE(check_in) as date'));
            
            // Get unique dates from therapist attendances
            $therapistDates = TherapistAttendance::where('branch_id', $branchId)
                ->select(DB::raw('DATE(check_in) as date'));
                
            $availableDates = $patientDates->union($therapistDates)
                ->orderBy('date', 'desc')
                ->pluck('date')
                ->unique()
                ->values()
                ->toArray();
        }

        // We no longer default to the most recent date;
        // the user must explicitly select a date.

        $patientAttendances = [];
        $therapistAttendances = [];
        $availablePatients = [];
        $availableTherapists = [];
        $allTherapists = [];

        $search = $request->input('search');

        if ($search || ($branchId && $date)) {
            $patientQuery = PatientAttendance::with(['patient', 'therapists', 'branch']);
            $therapistQuery = TherapistAttendance::with(['therapist', 'branch']);

            if ($branchId) {
                $patientQuery->where('branch_id', $branchId);
                $therapistQuery->where('branch_id', $branchId);
            }

            if ($date) {
                $patientQuery->whereDate('check_in', $date);
                $therapistQuery->whereDate('check_in', $date);
            }

            if ($search) {
                $patientQuery->whereHas('patient', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });

                $therapistQuery->whereHas('therapist', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            $patientAttendances = $patientQuery->orderBy('check_in', 'desc')->get();
            $therapistAttendances = $therapistQuery->orderBy('check_in', 'desc')->get();
        }

        if ($branchId && $date) {
            $availablePatients = \App\Models\Patient::whereHas('branches', function ($q) use ($branchId) {
                $q->where('branches.id', $branchId);
            })->whereDoesntHave('attendances', function ($q) use ($branchId, $date) {
                $q->where('branch_id', $branchId)->whereDate('check_in', $date);
            })->orderBy('name')->get();

            $availableTherapists = \App\Models\Therapist::whereHas('branches', function ($q) use ($branchId) {
                $q->where('branches.id', $branchId);
            })->whereDoesntHave('attendances', function ($q) use ($branchId, $date) {
                $q->where('branch_id', $branchId)->whereDate('check_in', $date);
            })->orderBy('name')->get();

            $allTherapists = \App\Models\Therapist::whereHas('branches', function ($q) use ($branchId) {
                $q->where('branches.id', $branchId);
            })->orderBy('name')->get();
        }

        $branches = $user->isSuperadmin() ? Branch::orderBy('name')->get() : [];

        return Inertia::render('Attendance/Archives/Index', [
            'patientAttendances' => $patientAttendances,
            'therapistAttendances' => $therapistAttendances,
            'availableDates' => $availableDates,
            'selectedDate' => $date,
            'branches' => $branches,
            'currentBranchId' => (int) $branchId,
            'availablePatients' => $availablePatients,
            'availableTherapists' => $availableTherapists,
            'allTherapists' => $allTherapists,
            'search' => $search,
        ]);
    }

    public function storePatient(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'patient_id' => 'required|exists:patients,id',
            'branch_id' => 'required|exists:branches,id',
            'therapist_ids' => 'required|array|min:1',
            'therapist_ids.*' => 'exists:therapists,id',
            'check_in_time' => 'required|date_format:H:i',
            'check_out_time' => 'required|date_format:H:i|after:check_in_time',
            'complaint' => 'required|string',
        ]);

        $checkIn = \Carbon\Carbon::parse($validated['date'] . ' ' . $validated['check_in_time']);
        $checkOut = $validated['check_out_time'] ? \Carbon\Carbon::parse($validated['date'] . ' ' . $validated['check_out_time']) : null;

        $attendance = PatientAttendance::create([
            'patient_id' => $validated['patient_id'],
            'branch_id' => $validated['branch_id'],
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'complaint' => $validated['complaint'],
            'is_manual' => true,
        ]);

        $attendance->therapists()->attach($validated['therapist_ids']);

        return redirect()->back()->with('success', 'Late patient check-in added successfully.');
    }

    public function storeTherapist(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'therapist_id' => 'required|exists:therapists,id',
            'branch_id' => 'required|exists:branches,id',
            'check_in_time' => 'required|date_format:H:i',
            'check_out_time' => 'required|date_format:H:i|after:check_in_time',
        ]);

        $checkIn = \Carbon\Carbon::parse($validated['date'] . ' ' . $validated['check_in_time']);
        $checkOut = $validated['check_out_time'] ? \Carbon\Carbon::parse($validated['date'] . ' ' . $validated['check_out_time']) : null;

        TherapistAttendance::create([
            'therapist_id' => $validated['therapist_id'],
            'branch_id' => $validated['branch_id'],
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'is_manual' => true,
        ]);

        return redirect()->back()->with('success', 'Late therapist check-in added successfully.');
    }

    public function exportPatientExcel(Request $request): BinaryFileResponse
    {
        $attendances = $this->getPatientAttendances($request);
        $date = $request->input('date') ?: 'Semua';
        return Excel::download(new PatientAttendanceExport($attendances), 'arsip_absensi_pasien_' . $date . '.xlsx');
    }

    public function exportPatientPdf(Request $request): HttpResponse
    {
        $attendances = $this->getPatientAttendances($request);
        $date = $request->input('date') ?: 'Semua';
        $pdf = Pdf::loadView('exports.attendance_pdf', compact('attendances', 'date'));
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('arsip_absensi_pasien_' . $date . '.pdf');
    }

    public function exportTherapistExcel(Request $request): BinaryFileResponse
    {
        $attendances = $this->getTherapistAttendances($request);
        $date = $request->input('date') ?: 'Semua';
        return Excel::download(new TherapistAttendanceExport($attendances), 'arsip_absensi_terapis_' . $date . '.xlsx');
    }

    public function exportTherapistPdf(Request $request): HttpResponse
    {
        $attendances = $this->getTherapistAttendances($request);
        $date = $request->input('date') ?: 'Semua';
        $pdf = Pdf::loadView('exports.therapist_attendance_pdf', compact('attendances', 'date'));
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('arsip_absensi_terapis_' . $date . '.pdf');
    }

    private function getPatientAttendances(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $branchId = $user->isSuperadmin() ? $request->input('branch_id') : $user->branch_id;
        $date = $request->input('date');
        $search = $request->input('search');

        if (!$search && (!$branchId || !$date)) {
            return collect();
        }

        $query = PatientAttendance::with(['patient', 'therapists', 'branch']);

        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        if ($date) {
            $query->whereDate('check_in', $date);
        }

        if ($search) {
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('check_in', 'desc')->get();
    }

    private function getTherapistAttendances(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $branchId = $user->isSuperadmin() ? $request->input('branch_id') : $user->branch_id;
        $date = $request->input('date');
        $search = $request->input('search');

        if (!$search && (!$branchId || !$date)) {
            return collect();
        }

        $query = TherapistAttendance::with(['therapist', 'branch']);

        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        if ($date) {
            $query->whereDate('check_in', $date);
        }

        if ($search) {
            $query->whereHas('therapist', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('check_in', 'desc')->get();
    }
}
