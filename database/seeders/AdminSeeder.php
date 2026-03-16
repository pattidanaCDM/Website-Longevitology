<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Admin Role
        $adminRole = Role::where('name', Role::ADMIN)->first();

        if (!$adminRole) {
            $this->command->error("Admin role not found. Please run RoleSeeder first.");
            return;
        }

        // Get Main Branch
        $mainBranch = Branch::first();
        if (!$mainBranch) {
            $this->command->error("No branches found. Please run BranchSeeder first.");
            return;
        }

        // Create Admin User for Main Branch
        $user = User::firstOrCreate(
            ['email' => 'admin@longevitology.com'],
            [
                'name' => 'Main Branch Admin',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'branch_id' => $mainBranch->id,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("Admin user created for " . $mainBranch->name);

        // Get Second Branch if available
        $secondBranch = Branch::skip(1)->first();
        if ($secondBranch) {
            User::firstOrCreate(
                ['email' => 'north.admin@longevitology.com'],
                [
                    'name' => 'North Branch Admin',
                    'password' => Hash::make('password123'),
                    'role_id' => $adminRole->id,
                    'branch_id' => $secondBranch->id,
                    'email_verified_at' => now(),
                ]
            );
            $this->command->info("Admin user created for " . $secondBranch->name);
        }
    }
}
