<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Patient;
use App\Models\Branch;
use App\Models\AuditTrail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;

class PatientService
{
    /**
     * Store a new patient in the database.
     *
     * @param array<string, mixed> $data
     * @param UploadedFile|null $photo
     * @param User $user
     * @return Patient
     */
    public function store(array $data, ?UploadedFile $photo, User $user): Patient
    {
        if ($user->isSuperadmin()) {
            $branchIds = (array) $data['branch_id'];
        } else {
            $branchIds = [$user->branch_id];
        }

        return DB::transaction(function () use ($data, $photo, $branchIds) {
            $patientData = $data;
            unset($patientData['card_number'], $patientData['branch_id'], $patientData['photo']);

            $patientData['current_complaint'] = $patientData['initial_complaint'];

            if ($photo) {
                $path = $photo->store('photos/patients', 'public');
                $patientData['photo'] = $path;
            }

            $patient = Patient::create($patientData);

            $patient->branches()->attach($branchIds);

            return $patient;
        });
    }

    /**
     * Extend a patient to a branch.
     *
     * @param int $patientId
     * @param int|null $branchIdInput
     * @param User $user
     * @param string $fullUrl
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return void
     * @throws \Exception
     */
    public function extend(int $patientId, ?int $branchIdInput, User $user, string $fullUrl, ?string $ipAddress, ?string $userAgent): void
    {
        $branchId = $user->branch_id;
        if ($user->isSuperadmin()) {
            $branchId = $branchIdInput;
        }

        $patient = Patient::findOrFail($patientId);
        $branch = Branch::findOrFail($branchId);

        DB::transaction(function () use ($patient, $branch, $branchId, $user, $fullUrl, $ipAddress, $userAgent) {
            $existingPivot = \Illuminate\Support\Facades\DB::table('patient_branches')
                ->where('patient_id', $patient->id)
                ->where('branch_id', $branchId)
                ->first();

            if ($existingPivot) {
                if ($existingPivot->deleted_at === null) {
                    throw new \Exception('Patient is already assigned to this branch.');
                }
                \Illuminate\Support\Facades\DB::table('patient_branches')
                    ->where('id', $existingPivot->id)
                    ->update(['deleted_at' => null, 'updated_at' => now()]);
            } else {
                $patient->branches()->attach($branchId);
            }

            $patient->touch();

            AuditTrail::create([
                'user_id' => $user->id,
                'event' => 'extended',
                'description' => "Extended Patient: {$patient->name} to Branch: {$branch->name}",
                'auditable_type' => get_class($patient),
                'auditable_id' => $patient->id,
                'old_values' => null,
                'new_values' => json_encode(['branch_id' => $branchId]),
                'url' => $fullUrl,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);
        });
    }

    /**
     * Update an existing patient.
     *
     * @param Patient $patient
     * @param array<string, mixed> $data
     * @param UploadedFile|null $photo
     * @param User $user
     * @return void
     */
    public function update(Patient $patient, array $data, ?UploadedFile $photo, User $user): void
    {
        if (!$user->isSuperadmin()) {
            if (!$patient->branches()->where('branches.id', $user->branch_id)->exists()) {
                abort(403, 'Unauthorized action.');
            }
        }

        $patientData = $data;
        
        $branchIds = null;
        if (isset($patientData['branch_id'])) {
            $branchIds = $patientData['branch_id'];
        }

        unset($patientData['card_number'], $patientData['branch_id'], $patientData['photo']);

        if ($photo) {
            $path = $photo->store('photos/patients', 'public');
            $patientData['photo'] = $path;
        }

        $patient->update($patientData);

        if ($user->isSuperadmin() && $branchIds !== null) {
            $currentBranchIds = \Illuminate\Support\Facades\DB::table('patient_branches')
                ->where('patient_id', $patient->id)
                ->whereNull('deleted_at')
                ->pluck('branch_id')
                ->toArray();
            
            $toAttach = array_diff($branchIds, $currentBranchIds);
            $toDetach = array_diff($currentBranchIds, $branchIds);

            if (!empty($toDetach)) {
                \Illuminate\Support\Facades\DB::table('patient_branches')
                    ->where('patient_id', $patient->id)
                    ->whereIn('branch_id', $toDetach)
                    ->update(['deleted_at' => now(), 'updated_at' => now()]);
            }

            foreach ($toAttach as $bId) {
                $existing = \Illuminate\Support\Facades\DB::table('patient_branches')
                    ->where('patient_id', $patient->id)
                    ->where('branch_id', $bId)
                    ->first();
                if ($existing) {
                    \Illuminate\Support\Facades\DB::table('patient_branches')
                        ->where('id', $existing->id)
                        ->update(['deleted_at' => null, 'updated_at' => now()]);
                } else {
                    $patient->branches()->attach($bId);
                }
            }
        }
    }

    /**
     * Delete or remove a patient.
     *
     * @param Patient $patient
     * @param string $type
     * @param int|null $branchIdInput
     * @param User $user
     * @param string $fullUrl
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return void
     */
    public function destroy(Patient $patient, string $type, ?int $branchIdInput, User $user, string $fullUrl, ?string $ipAddress, ?string $userAgent): void
    {
        if ($user->isSuperadmin()) {
            if ($type === 'branch') {
                if (!$branchIdInput) {
                    abort(400, 'Branch ID is required for branch deletion.');
                }

                $patient->branches()->updateExistingPivot($branchIdInput, ['deleted_at' => now()]);

                AuditTrail::create([
                    'user_id' => $user->id,
                    'event' => 'deleted',
                    'description' => "Removed Patient: {$patient->name} from Branch ID: {$branchIdInput}",
                    'auditable_type' => get_class($patient),
                    'auditable_id' => $patient->id,
                    'old_values' => null,
                    'new_values' => json_encode(['deleted_from_branch' => $branchIdInput]),
                    'url' => $fullUrl,
                    'ip_address' => $ipAddress,
                    'user_agent' => $userAgent,
                ]);
            } else {
                $patient->delete();

                AuditTrail::create([
                    'user_id' => $user->id,
                    'event' => 'deleted',
                    'description' => "Deleted Patient Globally: {$patient->name}",
                    'auditable_type' => get_class($patient),
                    'auditable_id' => $patient->id,
                    'old_values' => null,
                    'new_values' => json_encode(['deleted_at' => now()]),
                    'url' => $fullUrl,
                    'ip_address' => $ipAddress,
                    'user_agent' => $userAgent,
                ]);
            }
        } else {
            if (!$patient->branches()->where('branches.id', $user->branch_id)->exists()) {
                abort(403, 'Unauthorized action.');
            }

            $patient->branches()->updateExistingPivot($user->branch_id, ['deleted_at' => now()]);

            AuditTrail::create([
                'user_id' => $user->id,
                'event' => 'deleted',
                'description' => "Removed Patient: {$patient->name} from Branch: {$user->branch->name}",
                'auditable_type' => get_class($patient),
                'auditable_id' => $patient->id,
                'old_values' => null,
                'new_values' => json_encode(['deleted_from_branch' => $user->branch_id]),
                'url' => $fullUrl,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);
        }
    }
}
