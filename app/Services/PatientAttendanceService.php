<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\PatientAttendance;
use App\Models\Patient;
use App\Models\Therapist;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class PatientAttendanceService
{
    /**
     * Get patient attendances.
     *
     * @param User $user
     * @param string $date
     * @return Collection
     */
    public function getAttendances(User $user, string $date): Collection
    {
        $query = PatientAttendance::with(['patient.branches', 'therapists', 'branch'])
            ->whereDate('check_in', $date);

        if (!$user->isSuperadmin()) {
            $query->where('branch_id', $user->branch_id);
        }

        return $query->latest('check_in')->get();
    }

    /**
     * Get available therapists.
     *
     * @param User $user
     * @param string $date
     * @return Collection
     */
    public function getAvailableTherapists(User $user, string $date): Collection
    {
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

        return $availableTherapistsQuery->get();
    }

    /**
     * Store patient attendance.
     *
     * @param array<string, mixed> $data
     * @param User $user
     * @return Patient
     * @throws \Exception
     */
    public function store(array $data, User $user): Patient
    {
        $patient = Patient::find($data['patient_id']);

        if (!$patient) {
            throw new \Exception('Patient not found.');
        }

        if (!$user->isSuperadmin()) {
            $inBranch = $patient->branches()->where('branches.id', $user->branch_id)->exists();
            if (!$inBranch) {
                throw new \Exception('Patient is not registered in this branch. Please verify/add them first in Manage Patients.');
            }
        }

        $branchId = $user->isSuperadmin() ? ((int) ($data['branch_id'] ?? $user->branch_id)) : $user->branch_id;

        $existing = PatientAttendance::where('patient_id', $patient->id)
            ->where('branch_id', $branchId)
            ->whereDate('check_in', Carbon::today())
            ->exists();

        if ($existing) {
            throw new \Exception('Patient is already checked in.');
        }

        DB::transaction(function () use ($data, $patient, $branchId) {
            if (isset($data['complaint']) && trim($data['complaint']) !== '') {
                $patient->update(['current_complaint' => $data['complaint']]);
            }

            $complaintToSnapshot = $data['complaint'] ?? $patient->current_complaint;

            $attendance = PatientAttendance::create([
                'patient_id' => $patient->id,
                'branch_id' => $branchId,
                'check_in' => now(),
                'complaint' => $complaintToSnapshot,
            ]);

            if (isset($data['therapist_ids']) && is_array($data['therapist_ids'])) {
                $attendance->therapists()->attach($data['therapist_ids']);
            }
        });

        return $patient;
    }

    /**
     * Update attendance.
     *
     * @param PatientAttendance $attendance
     * @param array<string, mixed> $data
     * @return void
     */
    public function update(PatientAttendance $attendance, array $data): void
    {
        if (!empty($data['check_out_now'])) {
            $attendance->update(['check_out' => now()]);
            return;
        }

        if (isset($data['therapist_ids']) && is_array($data['therapist_ids'])) {
            $attendance->therapists()->sync($data['therapist_ids']);
        }

        $updateData = [];
        if (isset($data['check_in'])) {
            $updateData['check_in'] = $data['check_in'];
        }
        if (isset($data['check_out'])) {
            $updateData['check_out'] = $data['check_out'];
        }

        if (!empty($updateData)) {
            $attendance->update($updateData);
        }
    }

    /**
     * Delete attendance.
     *
     * @param PatientAttendance $attendance
     * @return void
     */
    public function destroy(PatientAttendance $attendance): void
    {
        $attendance->delete();
    }
}
