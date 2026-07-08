<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    use HasFactory, \App\Traits\Auditable;

    protected $fillable = [
        'branch_id',
        'day',
        'time_start',
        'time_end',
    ];

    /**
     * Get the branch that owns the schedule.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
