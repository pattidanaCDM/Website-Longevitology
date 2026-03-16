<?php

namespace App\Policies;

use App\Models\Therapist;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Access\Response;

class TherapistPolicy
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
    public function view(User $user, Therapist $therapist): bool
    {
        return $user->branch_id && $therapist->branches()->where('branches.id', $user->branch_id)->exists();
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
    public function update(User $user, Therapist $therapist): bool
    {
        return $user->branch_id && $therapist->branches()->where('branches.id', $user->branch_id)->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Therapist $therapist): bool
    {
        return $user->branch_id && $therapist->branches()->where('branches.id', $user->branch_id)->exists();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Therapist $therapist): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Therapist $therapist): bool
    {
        return false;
    }
}
