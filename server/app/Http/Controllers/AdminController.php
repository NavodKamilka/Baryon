<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function addSystemUser(Request $request)
    {
        $request->validate([
            'f_name' => 'required|string',
            'l_name' => 'required|string',
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $systemUser = User::create([
            'f_name' => $request->input('f_name'),
            'l_name' => $request->input('l_name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        return response()->json(['message' => 'System User created successfully', 'system-user' => $systemUser]);
    }

    public function getAll(){

        $adminModel = new User;
        $systemUser = $adminModel->getAllSystemUsers(); 

        return response()->json($systemUser, 200);

    }

    public function getSystemUserById($id){

        $systemUser = User::find($id);

        if (!$systemUser) {
            return response()->json(['error' => 'System User not found'], 404);
        }

        return response()->json($systemUser, 200);
    }

    public function removeSystemUser($id){
        $systemUser = User::find($id);

        if (!$systemUser) {
            return response()->json(['message' => 'System User not found'], Response::HTTP_NOT_FOUND);
        }

        $systemUser->delete();

        return response()->json(['message' => 'System User removed successfully']);
       
    }

    public function updateSystemUser(Request $request, $id)
    {
        $systemUser = User::find($id);

        if (!$systemUser) {
            return response()->json(['message' => 'System User not found'], Response::HTTP_NOT_FOUND);
        }

        $request->validate([
            'f_name' => 'required|string',
            'l_name' => 'required|string',
            'email' => 'required|string',
            'status' => 'required|string',
        ]);

        $systemUser->f_name = $request->input('f_name');
        $systemUser->l_name = $request->input('l_name');
        $systemUser->email = $request->input('email');
        $systemUser->status = $request->input('status');
        $systemUser->save();

        return response()->json(['message' => 'System User updated successfully', 'system-user' => $systemUser]);
    }
}
