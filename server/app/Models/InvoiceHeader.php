<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceHeader extends Model
{
    protected $primaryKey = 'invoice_no';
    protected $fillable = ['invoice_no', 'customer_name', 'user_id'];

    public function lineItems()
    {
        return $this->hasMany(InvoiceLineItem::class, 'invoice_no');
    }

}
