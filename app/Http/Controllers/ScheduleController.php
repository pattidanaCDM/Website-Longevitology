<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Display the schedule management page.
     */
    public function index()
    {
        $user = auth()->user();
        $branches = [];

        if ($user->isSuperadmin()) {
            $branches = Branch::with('schedules')->get();
        } else {
            // Admin only sees their own branch
            if ($user->branch_id) {
                $branches = Branch::where('id', $user->branch_id)->with('schedules')->get();
            }
        }

        return Inertia::render('ManageSchedules', [
            'branches' => $branches,
        ]);
    }

    /**
     * Store or update schedules for a branch.
     */
    public function sync(Request $request, Branch $branch)
    {
        $user = auth()->user();

        // Security check
        if (!$user->isSuperadmin() && $user->branch_id !== $branch->id) {
            abort(403, 'Unauthorized access to this branch.');
        }

        $request->validate([
            'schedules' => 'required|array',
            'schedules.*.day' => 'required|string',
            'schedules.*.time_start' => 'required',
            'schedules.*.time_end' => 'required',
        ]);

        // Delete existing schedules and recreate
        $branch->schedules()->delete();

        foreach ($request->schedules as $sched) {
            $branch->schedules()->create([
                'day' => $sched['day'],
                'time_start' => $sched['time_start'],
                'time_end' => $sched['time_end'],
            ]);
        }

        return redirect()->back()->with('success', 'Schedules updated successfully.');
    }
}
