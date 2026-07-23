<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'location',
        'excerpt',
        'content',
        'link',
        'photo_path',
        'is_active',
    ];
}
