<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InvoiceHeader;
use App\Models\InvoiceLineItem;
use App\Models\Item;

class InvoiceController extends Controller
{
    public function addInvoice(Request $request)
    {

        $userId = auth()->user()->id;

        $request->validate([
            'customer_name' => 'required|string',
            'item_codes' => 'required|array',
            'item_codes.*' => 'required|integer',
            'qtys' => 'required|array',
            'qtys.*' => 'required|integer',
        ]);

        $invoice = InvoiceHeader::create([
            'customer_name' => $request->input('customer_name'),
            'user_id' => $userId,
        ]);

        echo "Invoice :",$invoice->invoice_no;

        $itemCodes = $request->input('item_codes');
        $qtys = $request->input('qtys');

        foreach ($itemCodes as $index => $itemCode) {
            $qty = $qtys[$index];

            $price = $this->calculateItemPrice($itemCode, $qty);

            InvoiceLineItem::create([
                'invoice_no' => $invoice->invoice_no,
                'item_code' => $itemCode,
                'qty' => $qty,
                'price' => $price,
            ]);
        }

        return response()->json(['message' => 'Invoice added successfully'], 201);
    }

    private function calculateItemPrice($itemCode, $qty)
    {
        $price = 0.0;

        // Retrieve the item price based on the item code
        $item = Item::where('item_code', $itemCode)->first();

        if ($item) {
            $price = $item->price * $qty;
        }

        return $price;
    }

        public function getAllInvoice()
    {
        $userId = auth()->user()->id;

        $invoices = InvoiceHeader::where('user_id', $userId)->get();

        $results = [];
        foreach ($invoices as $invoice) {
            $totalPrice = $invoice->lineItems()->sum('price');

            $results[] = [
                'invoice_no' => $invoice->invoice_no,
                'invoice_date' => $invoice->invoice_date,
                'customer_name' => $invoice->customer_name,
                'total_price' => $totalPrice,
            ];
        }

        return response()->json($results);
    }

        public function getInvoiceById($id)
    {
        $userId = auth()->user()->id;
        $invoice = InvoiceHeader::where('invoice_no', $id)->where('user_id', $userId)->first();;

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        $customerName = $invoice->customer_name;
        $lineItems = $invoice->lineItems()->select('item_code', 'qty')->get();

        $result = [
            'customer_name' => $customerName,
            'line_items' => $lineItems,
        ];

        return response()->json($result);
    }

        public function removeInvoice($id)
    {
        $userId = auth()->user()->id;

        $invoice = InvoiceHeader::where('invoice_no', $id)->where('user_id', $userId)->first();

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        // Delete the invoice and associated line items
        $invoice->lineItems()->delete();
        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }

    public function updateInvoice(Request $request, $id)
    {
        $userId = auth()->user()->id;
    
        $invoice = InvoiceHeader::where('invoice_no', $id)->where('user_id', $userId)->first();
    
        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }
    
        $request->validate([
            'customer_name' => 'required|string',
            'item_codes' => 'required|array',
            'item_codes.*' => 'required|integer',
            'qtys' => 'required|array',
            'qtys.*' => 'required|integer',
        ]);
    
        // Update the invoice header's customer name
        $invoice->update([
            'customer_name' => $request->input('customer_name'),
        ]);
    
        // Update the invoice line items
        $itemCodes = $request->input('item_codes');
        $qtys = $request->input('qtys');
    
        foreach ($itemCodes as $index => $itemCode) {
            $qty = $qtys[$index];
    
            // Check if the item exists
            $item = Item::where('item_code', $itemCode)->first();
            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }
    
            $price = $this->calculateItemPrice($itemCode, $qty);
    
            InvoiceLineItem::updateOrCreate(
                ['invoice_no' => $invoice->invoice_no, 'item_code' => $itemCode],
                ['qty' => $qty, 'price' => $price]
            );
        }
    
        return response()->json(['message' => 'Invoice updated successfully']);
    }    


}
