<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AutoCheckoutAttendance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:auto-checkout';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically checkout all active attendances at the end of the day';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting auto-checkout for attendances...');

        $patients = \App\Models\PatientAttendance::whereNull('check_out')->get();
        foreach ($patients as $patient) {
            $date = $patient->check_in ? \Carbon\Carbon::parse($patient->check_in) : \Carbon\Carbon::parse($patient->created_at);
            $patient->update(['check_out' => $date->endOfDay()]);
        }
        
        $therapists = \App\Models\TherapistAttendance::whereNull('check_out')->get();
        foreach ($therapists as $therapist) {
            $date = $therapist->check_in ? \Carbon\Carbon::parse($therapist->check_in) : \Carbon\Carbon::parse($therapist->created_at);
            $therapist->update(['check_out' => $date->endOfDay()]);
        }

        $this->info('Successfully checked out ' . $patients->count() . ' patients and ' . $therapists->count() . ' therapists.');
    }
}
