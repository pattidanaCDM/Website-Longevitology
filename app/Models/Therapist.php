<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Branch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Therapist extends Model
{
    use HasFactory, SoftDeletes, \App\Traits\Auditable;

    protected $fillable = [
        'name',
        'gender',
        'birth_date',
        'phone',
        'address',
        'photo',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function attendances()
    {
        return $this->hasMany(TherapistAttendance::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'therapist_branches')
            ->withPivot('deleted_at')
            ->withTimestamps()
            ->wherePivot('deleted_at', null); // Filter out soft-deleted pivots
    }
}
