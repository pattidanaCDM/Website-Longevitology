<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Branch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes, \App\Traits\Auditable;

    protected $fillable = [
        'name',
        'gender',
        'birth_date',
        'phone',
        'address',
        'photo',
        'initial_complaint',
        'current_complaint',
        'cakra',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function attendances(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PatientAttendance::class);
    }

    public function branches(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Branch::class, 'patient_branches')
            ->withPivot('deleted_at')
            ->withTimestamps()
            ->wherePivot('deleted_at', null); // Filter out soft-deleted pivots
    }
}
