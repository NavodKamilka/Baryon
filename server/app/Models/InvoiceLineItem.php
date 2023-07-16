<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceLineItem extends Model
{
    // protected $primaryKey = 'invoice_no';
    protected $fillable = ['invoice_no', 'item_code', 'qty', 'price'];

    // public function invoice()
    // {
    //     return $this->belongsTo(Invoice::class, 'invoice_no');
    // }
}
