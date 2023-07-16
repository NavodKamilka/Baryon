<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    public function addItem(Request $request)
    {
        // Retrieve the authenticated user ID from the token
        $user_id = auth()->user()->id;

        // Validate the request data
        $request->validate([
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'required|string',
        ]);

        // Create a new item
        $item = new Item();
        $item->description = $request->input('description');
        $item->price = $request->input('price');
        $item->image = $request->input('image');
        $item->user_id = $user_id;
        $item->save();

        return response()->json(['message' => 'Item added successfully'], 201);
    }

    public function getAllItem()
    {
        $userId = auth()->user()->id;

        // Retrieve all items for the specified user ID
        $items = Item::where('user_id', $userId)->get();

        return response()->json($items, 200);
    }

    public function getItemById($itemCode)
    {
        $userId = auth()->user()->id;

        // Retrieve the item for the specified user ID and item code
        $item = Item::where('user_id', $userId)->where('item_code', $itemCode)->first();

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        return response()->json($item, 200);
    }

    public function removeItem($itemCode)
    {

        $userId = auth()->user()->id;

        // Delete the item for the specified user ID and item code
        $deleted = DB::table('items')
                    ->where('user_id', $userId)
                    ->where('item_code', $itemCode)
                    ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Item deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Item not found'], 404);
        }
    }

    public function updateItem(Request $request, $itemCode)
    {
        $userId = auth()->user()->id;

        // Find the item for the specified user ID and item ID
        $item = Item::where('user_id', $userId)->where('item_code', $itemCode)->first();

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        // Validate the request data
        $request->validate([
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'required|string',
        ]);

        // Update the item
        $item->description = $request->input('description');
        $item->price = $request->input('price');
        $item->image = $request->input('image');
        $item->save();

        return response()->json([
            'message' => 'Item updated successfully',
            'item' => $item
        ], 200);
    }
}