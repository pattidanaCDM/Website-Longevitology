<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\TherapistAttendance;
use App\Models\Therapist;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class TherapistAttendanceService
{
    /**
     * Get therapist attendances.
     *
     * @param User $user
     * @param string $date
     * @return Collection
     */
    public function getAttendances(User $user, string $date): Collection
    {
        $query = TherapistAttendance::with(['therapist', 'branch'])
            ->whereDate('check_in', $date);

        if (!$user->isSuperadmin()) {
            $query->where('branch_id', $user->branch_id);
        }

        return $query->latest('check_in')->get();
    }

    /**
     * Store therapist attendance.
     *
     * @param array<string, mixed> $data
     * @param User $user
     * @return void
     * @throws \Exception
     */
    public function store(array $data, User $user): void
    {
        $therapist = Therapist::find($data['therapist_id']);

        if (!$therapist) {
            throw new \Exception('Therapist not found.');
        }

        if (!$user->isSuperadmin()) {
            $inBranch = $therapist->branches()->where('branches.id', $user->branch_id)->exists();
            if (!$inBranch) {
                throw new \Exception('Therapist is not in this branch.');
            }
        }

        $branchId = $user->isSuperadmin() ? ((int) ($data['branch_id'] ?? $user->branch_id)) : $user->branch_id;

        $existing = TherapistAttendance::where('therapist_id', $therapist->id)
            ->where('branch_id', $branchId)
            ->whereDate('check_in', Carbon::today())
            ->exists();

        if ($existing) {
            throw new \Exception('Therapist is already checked in.');
        }

        TherapistAttendance::create([
            'therapist_id' => $therapist->id,
            'branch_id' => $branchId,
            'check_in' => now(),
        ]);
    }

    /**
     * Update attendance.
     *
     * @param TherapistAttendance $attendance
     * @param array<string, mixed> $data
     * @return void
     */
    public function update(TherapistAttendance $attendance, array $data): void
    {
        if (!empty($data['check_out_now'])) {
            $attendance->update(['check_out' => now()]);
            return;
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
     * @param TherapistAttendance $attendance
     * @return void
     */
    public function destroy(TherapistAttendance $attendance): void
    {
        $attendance->delete();
    }
}
