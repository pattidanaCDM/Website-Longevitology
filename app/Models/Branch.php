<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Branch extends Model
{
    use HasFactory, \App\Traits\Auditable;

    protected $fillable = [
        'name',
        'code',
        'address',
        'map_url',
    ];

    /**
     * Get the schedules for the branch.
     */
    public function schedules(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get the admins associated with the branch.
     */
    public function admins(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Scope a query to only include branches accessible by the user.
     */
    public function scopeAccessibleBy($query, User $user)
    {
        if ($user->hasRole(Role::SUPERADMIN)) {
            return $query;
        }

        if ($user->hasRole(Role::ADMIN)) {
            return $query->where('id', $user->branch_id);
        }

        return $query->whereRaw('1 = 0'); // No access for others
    }
}
