<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('login',[UserController::class,'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


//Admin
Route::middleware('auth:sanctum')->post('/admin/add', [AdminController::class, 'addSystemUser']);
Route::middleware('auth:sanctum')->get('/admin/getAll', [AdminController::class, 'getAll']);
Route::middleware('auth:sanctum')->get('/admin/getSystemUserById/{id}', [AdminController::class, 'getSystemUserById']);
Route::middleware('auth:sanctum')->delete('/admin/delete/{id}', [AdminController::class, 'removeSystemUser']);
Route::middleware('auth:sanctum')->put('/admin/updateSystemUser/{id}', [AdminController::class, 'updateSystemUser']);

//SystemUser
//Item
Route::middleware('auth:sanctum')->post('/system-user/addItem', [ItemController::class, 'addItem']);
Route::middleware('auth:sanctum')->get('/system-user/getAllItem', [ItemController::class, 'getAllItem']);
Route::middleware('auth:sanctum')->get('/system-user/getItemById/{id}', [ItemController::class, 'getItemById']);
Route::middleware('auth:sanctum')->delete('/system-user/item/delete/{id}', [ItemController::class, 'removeItem']);
Route::middleware('auth:sanctum')->put('/system-user/updateItem/{id}', [ItemController::class, 'updateItem']);

//Invoice
Route::middleware('auth:sanctum')->post('/system-user/addInvoice', [InvoiceController::class, 'addInvoice']);
Route::middleware('auth:sanctum')->get('/system-user/getAllInvoice', [InvoiceController::class, 'getAllInvoice']);
Route::middleware('auth:sanctum')->get('/system-user/getInvoiceById/{id}', [InvoiceController::class, 'getInvoiceById']);
Route::middleware('auth:sanctum')->delete('/system-user/invoice/delete/{id}', [InvoiceController::class, 'removeInvoice']);
Route::middleware('auth:sanctum')->put('/system-user/updateInvoice/{id}', [InvoiceController::class, 'updateInvoice']);





Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
