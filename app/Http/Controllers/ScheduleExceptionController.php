<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Branch;
use App\Models\ScheduleException;
use App\Models\Role;
use Inertia\Inertia;

class ScheduleExceptionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = ScheduleException::with('branch');

        if (!$user->hasRole(Role::SUPERADMIN)) {
            $query->where('branch_id', $user->branch_id);
        }

        $scheduleExceptions = $query->latest('original_date')->get();

        $branches = [];
        if ($user->hasRole(Role::SUPERADMIN)) {
            $branches = Branch::all(['id', 'name']);
        } else {
            $branches = Branch::where('id', $user->branch_id)->get(['id', 'name']);
        }

        return Inertia::render('ScheduleExceptions/Index', [
            'scheduleExceptions' => $scheduleExceptions,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $isSuperadmin = $user->hasRole(Role::SUPERADMIN);

        $branchId = $isSuperadmin ? $request->branch_id : $user->branch_id;

        $validated = $request->validate([
            'branch_id' => $isSuperadmin ? 'required|exists:branches,id' : 'nullable|exists:branches,id',
            'original_date' => [
                'required',
                'date',
                'after_or_equal:today',
                function ($attribute, $value, $fail) use ($branchId) {
                    if ($branchId) {
                        $dayNameId = \Carbon\Carbon::parse($value)->locale('id')->isoFormat('dddd');
                        $exists = \App\Models\Schedule::where('branch_id', $branchId)
                            ->where('day', $dayNameId)
                            ->exists();
                        if (!$exists) {
                            $fail("Tidak ada jadwal reguler pada hari {$dayNameId} untuk cabang yang dipilih.");
                        }
                    }
                }
            ],
            'type' => 'required|string|in:libur,dipindahkan',
            'rescheduled_date' => 'nullable|date|after_or_equal:today|required_if:type,dipindahkan',
            'description' => 'required|string',
        ]);

        if (!$isSuperadmin) {
            $validated['branch_id'] = $user->branch_id;
        }

        ScheduleException::create($validated);

        return back()->with('success', 'Pengecualian jadwal berhasil ditambahkan.');
    }

    public function update(Request $request, ScheduleException $scheduleException)
    {
        $user = $request->user();
        $isSuperadmin = $user->hasRole(Role::SUPERADMIN);

        if (!$isSuperadmin && $scheduleException->branch_id !== $user->branch_id) {
            abort(403);
        }

        $branchId = $isSuperadmin ? $request->branch_id : $user->branch_id;

        $validated = $request->validate([
            'branch_id' => $isSuperadmin ? 'required|exists:branches,id' : 'nullable|exists:branches,id',
            'original_date' => [
                'required',
                'date',
                'after_or_equal:today',
                function ($attribute, $value, $fail) use ($branchId) {
                    if ($branchId) {
                        $dayNameId = \Carbon\Carbon::parse($value)->locale('id')->isoFormat('dddd');
                        $exists = \App\Models\Schedule::where('branch_id', $branchId)
                            ->where('day', $dayNameId)
                            ->exists();
                        if (!$exists) {
                            $fail("Tidak ada jadwal reguler pada hari {$dayNameId} untuk cabang yang dipilih.");
                        }
                    }
                }
            ],
            'type' => 'required|string|in:libur,dipindahkan',
            'rescheduled_date' => 'nullable|date|after_or_equal:today|required_if:type,dipindahkan',
            'description' => 'required|string',
        ]);

        if (!$isSuperadmin) {
            $validated['branch_id'] = $user->branch_id;
        }

        $scheduleException->update($validated);

        return back()->with('success', 'Pengecualian jadwal berhasil diperbarui.');
    }

    public function destroy(Request $request, ScheduleException $scheduleException)
    {
        $user = $request->user();
        
        if (!$user->hasRole(Role::SUPERADMIN) && $scheduleException->branch_id !== $user->branch_id) {
            abort(403);
        }

        $scheduleException->delete();

        return back()->with('success', 'Pengecualian jadwal berhasil dihapus.');
    }
}
