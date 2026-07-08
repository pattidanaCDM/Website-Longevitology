<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceTestingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        // Ensure we have a branch
        $branch = \App\Models\Branch::first();
        if (!$branch) {
            $branch = \App\Models\Branch::create([
                'name' => 'Klinik Pusat',
                'address' => 'Jl. Pusat Kesehatan No. 1',
                'phone' => '021-12345678',
            ]);
        }

        // We want 15 diverse records for testing pagination
        for ($i = 1; $i <= 15; $i++) {
            // Diverse date, 1 to 15 days ago
            $date = \Carbon\Carbon::now()->subDays($i);

            // Create a Therapist
            $therapist = \App\Models\Therapist::create([
                'name' => $faker->name,
                'gender' => $faker->randomElement(['Male', 'Female']),
                'birth_date' => $faker->dateTimeBetween('-50 years', '-20 years')->format('Y-m-d'),
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
            ]);
            $therapist->branches()->attach($branch->id);

            // Create a Patient
            $patient = \App\Models\Patient::create([
                'name' => $faker->name,
                'gender' => $faker->randomElement(['Male', 'Female']),
                'birth_date' => $faker->dateTimeBetween('-60 years', '-10 years')->format('Y-m-d'),
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
                'initial_complaint' => $faker->sentence,
            ]);
            $patient->branches()->attach($branch->id);

            // Create Therapist Attendance
            \App\Models\TherapistAttendance::create([
                'therapist_id' => $therapist->id,
                'branch_id' => $branch->id,
                'check_in' => $date->copy()->setTime(8, 0, 0),
                'check_out' => $date->copy()->setTime(17, 0, 0),
                'is_manual' => true, // marking as manual since it's seeded
            ]);

            // Create Patient Attendance
            $patientAttendance = \App\Models\PatientAttendance::create([
                'patient_id' => $patient->id,
                'branch_id' => $branch->id,
                'check_in' => $date->copy()->setTime(9, 30, 0),
                'check_out' => $date->copy()->setTime(10, 30, 0),
                'complaint' => $faker->sentence,
                'is_manual' => true,
            ]);

            // Attach Therapist to Patient Attendance
            $patientAttendance->therapists()->attach($therapist->id);
        }
    }
}
