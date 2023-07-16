<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableUserOther extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create users table
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_role');
            $table->string('f_name');
            $table->string('l_name');
            $table->string('email');
            $table->string('password');
            $table->string('status');
            $table->timestamps();
        });

        // Create items table
        Schema::create('items', function (Blueprint $table) {
            $table->increments('item_code');
            $table->string('description');
            $table->float('price');
            $table->string('image');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });

        // Create invoice_headers table
        Schema::create('invoice_headers', function (Blueprint $table) {
            $table->increments('invoice_no');
            $table->date('invoice_date')->default(DB::raw('CURRENT_DATE'));
            $table->string('customer_name');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });

        // Create invoice_line_items table
        Schema::create('invoice_line_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('item_no');
            $table->unsignedInteger('item_code');
            $table->unsignedInteger('qty');
            $table->float('price');
            $table->foreign('item_no')->references('invoice_no')->on('invoice_headers');
            $table->foreign('item_code')->references('item_code')->on('items');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop the tables in reverse order
        Schema::dropIfExists('invoice_line_items');
        Schema::dropIfExists('invoice_headers');
        Schema::dropIfExists('items');
        Schema::dropIfExists('users');
    }
}
