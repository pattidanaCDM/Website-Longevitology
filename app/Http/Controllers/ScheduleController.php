<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Services\ScheduleService;
use App\Http\Requests\SyncScheduleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function __construct(private ScheduleService $scheduleService)
    {
    }

    /**
     * Display the schedule management page.
     */
    public function index(): Response
    {
        /** @var \App\Models\User $user */
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
    public function sync(SyncScheduleRequest $request, Branch $branch): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // Security check
        if (!$user->isSuperadmin() && $user->branch_id !== $branch->id) {
            abort(403, 'Unauthorized access to this branch.');
        }

        $this->scheduleService->sync($branch, $request->validated('schedules'));

        return redirect()->back()->with('success', 'Schedules updated successfully.');
    }
}
