<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperadminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadminRole = Role::where('name', Role::SUPERADMIN)->first();

        User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@yopmail.com',
            'password' => Hash::make('HelloWorld1!'),
            'role_id' => $superadminRole->id,
            'email_verified_at' => now(),
        ]);
    }
}
