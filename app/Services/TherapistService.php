<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Therapist;
use App\Models\Branch;
use App\Models\AuditTrail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class TherapistService
{
    /**
     * Store a new therapist in the database.
     *
     * @param array<string, mixed> $data
     * @param UploadedFile|null $photo
     * @param User $user
     * @return Therapist
     */
    public function store(array $data, ?UploadedFile $photo, User $user): Therapist
    {
        if ($user->isSuperadmin()) {
            $branchIds = (array) $data['branch_id'];
        } else {
            $branchIds = [$user->branch_id];
        }

        return DB::transaction(function () use ($data, $photo, $branchIds) {
            $therapistData = $data;
            unset($therapistData['card_number'], $therapistData['branch_id'], $therapistData['photo']);

            if ($photo) {
                $path = $photo->store('photos/therapists', 'public');
                $therapistData['photo'] = $path;
            }

            $therapist = Therapist::create($therapistData);

            $therapist->branches()->attach($branchIds);

            return $therapist;
        });
    }

    /**
     * Extend a therapist to a branch.
     *
     * @param int $therapistId
     * @param int|null $branchIdInput
     * @param User $user
     * @param string $fullUrl
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return void
     * @throws \Exception
     */
    public function extend(int $therapistId, ?int $branchIdInput, User $user, string $fullUrl, ?string $ipAddress, ?string $userAgent): void
    {
        $branchId = $user->branch_id;
        if ($user->isSuperadmin()) {
            $branchId = $branchIdInput;
        }

        $therapist = Therapist::findOrFail($therapistId);
        $branch = Branch::findOrFail($branchId);

        DB::transaction(function () use ($therapist, $branch, $branchId, $user, $fullUrl, $ipAddress, $userAgent) {
            $existingPivot = \Illuminate\Support\Facades\DB::table('therapist_branches')
                ->where('therapist_id', $therapist->id)
                ->where('branch_id', $branchId)
                ->first();

            if ($existingPivot) {
                if ($existingPivot->deleted_at === null) {
                    throw new \Exception('Therapist is already assigned to this branch.');
                }
                \Illuminate\Support\Facades\DB::table('therapist_branches')
                    ->where('id', $existingPivot->id)
                    ->update(['deleted_at' => null, 'updated_at' => now()]);
            } else {
                $therapist->branches()->attach($branchId);
            }

            $therapist->touch();

            AuditTrail::create([
                'user_id' => $user->id,
                'event' => 'extended',
                'description' => "Extended Therapist: {$therapist->name} to Branch: {$branch->name}",
                'auditable_type' => get_class($therapist),
                'auditable_id' => $therapist->id,
                'old_values' => null,
                'new_values' => json_encode(['branch_id' => $branchId]),
                'url' => $fullUrl,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);
        });
    }

    /**
     * Update an existing therapist.
     *
     * @param Therapist $therapist
     * @param array<string, mixed> $data
     * @param UploadedFile|null $photo
     * @param User $user
     * @return void
     */
    public function update(Therapist $therapist, array $data, ?UploadedFile $photo, User $user): void
    {
        if (!$user->isSuperadmin()) {
            if (!$therapist->branches()->where('branches.id', $user->branch_id)->exists()) {
                abort(403, 'Unauthorized action.');
            }
        }

        $therapistData = $data;
        
        $branchIds = null;
        if (isset($therapistData['branch_id'])) {
            $branchIds = $therapistData['branch_id'];
        }

        unset($therapistData['card_number'], $therapistData['branch_id'], $therapistData['photo']);

        if ($photo) {
            $path = $photo->store('photos/therapists', 'public');
            $therapistData['photo'] = $path;
        }

        $therapist->update($therapistData);

        if ($user->isSuperadmin() && $branchIds !== null) {
            $currentBranchIds = \Illuminate\Support\Facades\DB::table('therapist_branches')
                ->where('therapist_id', $therapist->id)
                ->whereNull('deleted_at')
                ->pluck('branch_id')
                ->toArray();
            
            $toAttach = array_diff($branchIds, $currentBranchIds);
            $toDetach = array_diff($currentBranchIds, $branchIds);

            if (!empty($toDetach)) {
                \Illuminate\Support\Facades\DB::table('therapist_branches')
                    ->where('therapist_id', $therapist->id)
                    ->whereIn('branch_id', $toDetach)
                    ->update(['deleted_at' => now(), 'updated_at' => now()]);
            }

            foreach ($toAttach as $bId) {
                $existing = \Illuminate\Support\Facades\DB::table('therapist_branches')
                    ->where('therapist_id', $therapist->id)
                    ->where('branch_id', $bId)
                    ->first();
                if ($existing) {
                    \Illuminate\Support\Facades\DB::table('therapist_branches')
                        ->where('id', $existing->id)
                        ->update(['deleted_at' => null, 'updated_at' => now()]);
                } else {
                    $therapist->branches()->attach($bId);
                }
            }
        }
    }

    /**
     * Delete or remove a therapist.
     *
     * @param Therapist $therapist
     * @param string $type
     * @param int|null $branchIdInput
     * @param User $user
     * @param string $fullUrl
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return void
     */
    public function destroy(Therapist $therapist, string $type, ?int $branchIdInput, User $user, string $fullUrl, ?string $ipAddress, ?string $userAgent): void
    {
        if ($user->isSuperadmin()) {
            if ($type === 'branch') {
                if (!$branchIdInput) {
                    abort(400, 'Branch ID is required for branch deletion.');
                }

                $therapist->branches()->updateExistingPivot($branchIdInput, ['deleted_at' => now()]);

                AuditTrail::create([
                    'user_id' => $user->id,
                    'event' => 'deleted',
                    'description' => "Removed Therapist: {$therapist->name} from Branch ID: {$branchIdInput}",
                    'auditable_type' => get_class($therapist),
                    'auditable_id' => $therapist->id,
                    'old_values' => null,
                    'new_values' => json_encode(['deleted_from_branch' => $branchIdInput]),
                    'url' => $fullUrl,
                    'ip_address' => $ipAddress,
                    'user_agent' => $userAgent,
                ]);
            } else {
                $therapist->delete();

                AuditTrail::create([
                    'user_id' => $user->id,
                    'event' => 'deleted',
                    'description' => "Deleted Therapist Globally: {$therapist->name}",
                    'auditable_type' => get_class($therapist),
                    'auditable_id' => $therapist->id,
                    'old_values' => null,
                    'new_values' => json_encode(['deleted_at' => now()]),
                    'url' => $fullUrl,
                    'ip_address' => $ipAddress,
                    'user_agent' => $userAgent,
                ]);
            }
        } else {
            if (!$therapist->branches()->where('branches.id', $user->branch_id)->exists()) {
                abort(403, 'Unauthorized action.');
            }

            $therapist->branches()->updateExistingPivot($user->branch_id, ['deleted_at' => now()]);

            AuditTrail::create([
                'user_id' => $user->id,
                'event' => 'deleted',
                'description' => "Removed Therapist: {$therapist->name} from Branch: {$user->branch->name}",
                'auditable_type' => get_class($therapist),
                'auditable_id' => $therapist->id,
                'old_values' => null,
                'new_values' => json_encode(['deleted_from_branch' => $user->branch_id]),
                'url' => $fullUrl,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);
        }
    }
}
