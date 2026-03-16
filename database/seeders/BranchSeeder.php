<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Longevitology Center - Main Branch',
                'code' => 'CDM',
                'address' => '123 Wellness Blvd, Health City, HC 10001',
                'map_url' => 'https://maps.google.com/?q=Main+Branch',
            ],
            [
                'name' => 'Longevitology Clinic - North',
                'code' => 'NWC',
                'address' => '456 Recovery Road, North Town, NT 20002',
                'map_url' => 'https://maps.google.com/?q=North+Branch',
            ],
            [
                'name' => 'Longevitology Center - South',
                'code' => 'SWC',
                'address' => '789 Holistic Ave, South Ville, SV 30003',
                'map_url' => 'https://maps.google.com/?q=South+Branch',
            ],
        ];

        foreach ($branches as $branch) {
            \App\Models\Branch::updateOrCreate(
                ['name' => $branch['name']],
                $branch
            );
        }
    }
}
