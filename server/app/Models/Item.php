<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    // use SoftDeletes;

    protected $primaryKey = 'item_code';
    protected $fillable = ['description', 'price', 'image', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

