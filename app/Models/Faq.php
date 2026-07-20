<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = ['question', 'answer'];

    public function categories()
    {
        return $this->belongsToMany(FaqCategory::class, 'faq_faq_category', 'faq_id', 'faq_category_id');
    }
}
