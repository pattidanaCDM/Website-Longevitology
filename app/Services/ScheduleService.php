<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Branch;
use Illuminate\Support\Facades\DB;

class ScheduleService
{
    /**
     * Sync schedules for a given branch.
     *
     * @param Branch $branch
     * @param array<int, array<string, mixed>> $schedules
     * @return void
     */
    public function sync(Branch $branch, array $schedules): void
    {
        DB::transaction(function () use ($branch, $schedules) {
            $branch->schedules()->delete();

            foreach ($schedules as $sched) {
                $branch->schedules()->create([
                    'day' => $sched['day'],
                    'time_start' => $sched['time_start'],
                    'time_end' => $sched['time_end'],
                ]);
            }
        });
    }
}
