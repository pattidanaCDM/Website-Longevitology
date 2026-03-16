<?php

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
        'is_verified',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'is_verified' => 'boolean',
    ];

    public function attendances()
    {
        return $this->hasMany(PatientAttendance::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'patient_branches')
            ->withPivot('card_number', 'deleted_at')
            ->withTimestamps()
            ->wherePivot('deleted_at', null); // Filter out soft-deleted pivots
    }
}
