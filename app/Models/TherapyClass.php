<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TherapyClass extends Model
{
    protected $fillable = [
        'title',
        'content',
        'registration_url',
        'is_active',
        'order_column',
    ];
}
