<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Access\Response;

class PatientPolicy
{

    public function before(User $user, $ability)
    {
        if ($user->hasRole(Role::SUPERADMIN)) {
            return true;
        }
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(Role::ADMIN);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Patient $patient): bool
    {
        // Admin can only view patients linked to their branch
        return $user->branch_id && $patient->branches()->where('branches.id', $user->branch_id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(Role::ADMIN);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Patient $patient): bool
    {
        // Admin can only update patients linked to their branch
        return $user->branch_id && $patient->branches()->where('branches.id', $user->branch_id)->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Patient $patient): bool
    {
        // Admin can only delete patients linked to their branch
        return $user->branch_id && $patient->branches()->where('branches.id', $user->branch_id)->exists();
    }
    
    // ...

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Patient $patient): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Patient $patient): bool
    {
        return false;
    }
}
