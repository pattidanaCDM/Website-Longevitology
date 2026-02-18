<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create([
            'name' => Role::SUPERADMIN,
            'description' => 'Super Administrator with full access to all features',
        ]);

        Role::create([
            'name' => Role::ADMIN,
            'description' => 'Administrator with limited access',
        ]);
    }
}
