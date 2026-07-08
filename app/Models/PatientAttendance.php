<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PatientAttendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id',
        'branch_id',
        'check_in',
        'check_out',
        'complaint',
        'is_manual',
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function therapists()
    {
        return $this->belongsToMany(Therapist::class, 'patient_attendance_therapist');
    }
}
