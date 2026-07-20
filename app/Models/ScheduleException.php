<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleException extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'original_date',
        'type',
        'rescheduled_date',
        'description',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
