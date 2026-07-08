<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TherapistAttendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'therapist_id',
        'branch_id',
        'check_in',
        'check_out',
        'is_manual',
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
    ];

    public function therapist()
    {
        return $this->belongsTo(Therapist::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
