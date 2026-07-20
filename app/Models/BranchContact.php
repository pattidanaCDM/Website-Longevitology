<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BranchContact extends Model
{
    protected $fillable = ['branch_id', 'name', 'phone'];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
