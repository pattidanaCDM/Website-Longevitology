<?php

declare(strict_types=1);

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
        'embed_map_url',
    ];

    /**
     * Get the contacts for the branch.
     */
    public function contacts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(BranchContact::class);
    }

    /**
     * Get the photos for the branch.
     */
    public function photos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(BranchPhoto::class);
    }

    /**
     * Get the schedules for the branch.
     */
    public function schedules(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get the schedule exceptions for the branch.
     */
    public function scheduleExceptions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ScheduleException::class);
    }

    /**
     * Get the announcements for the branch.
     */
    public function announcements(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    /**
     * Get the active announcements for the branch.
     */
    public function activeAnnouncements(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Announcement::class)
            ->where('is_active', true)
            ->where(function ($query) {
                $query->where('type', 'permanent')
                      ->orWhere(function ($q2) {
                          $now = now()->toDateString();
                          $q2->where('type', 'date_range')
                             ->where('start_date', '<=', $now)
                             ->where('end_date', '>=', $now);
                      });
            });
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
