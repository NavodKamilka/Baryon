<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FirstUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'user_role' => 'admin',
            'f_name' => 'Navod',
            'l_name' => 'Kamilka',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
    }
}

