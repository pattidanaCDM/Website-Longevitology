<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $isSuperadmin = $user->role->name === 'superadmin';

        $query = Announcement::with('branch');

        if (!$isSuperadmin) {
            $query->whereHas('branch', function ($q) use ($user) {
                $q->whereHas('users', function ($q2) use ($user) {
                    $q2->where('users.id', $user->id);
                });
            });
        }

        if ($request->has('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->has('search') && $request->search !== '') {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('content', 'like', $searchTerm);
            });
        }

        $announcements = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $branches = [];
        if ($isSuperadmin) {
            $branches = Branch::all();
        } else {
            $branches = $user->branches;
        }

        return Inertia::render('ManageAnnouncements/Index', [
            'announcements' => $announcements,
            'branches' => $branches,
            'filters' => $request->only(['search', 'branch_id']),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $isSuperadmin = $user->role->name === 'superadmin';

        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:permanent,date_range',
            'start_date' => 'required_if:type,date_range|nullable|date|after_or_equal:today',
            'end_date' => 'required_if:type,date_range|nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ], [
            'start_date.after_or_equal' => 'Tanggal mulai tidak boleh lebih kecil dari hari ini.',
            'end_date.after_or_equal' => 'Tanggal selesai tidak boleh lebih kecil dari tanggal mulai.',
        ]);

        if (!$isSuperadmin) {
            $userBranchIds = $user->branches->pluck('id')->toArray();
            if (!in_array($validated['branch_id'], $userBranchIds)) {
                return back()->with('error', 'Anda tidak memiliki akses ke cabang ini.');
            }
        }

        Announcement::create($validated);

        return back()->with('success', 'Pengumuman berhasil ditambahkan.');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $user = auth()->user();
        $isSuperadmin = $user->role->name === 'superadmin';

        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:permanent,date_range',
            'start_date' => 'required_if:type,date_range|nullable|date',
            'end_date' => 'required_if:type,date_range|nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ], [
            'end_date.after_or_equal' => 'Tanggal selesai tidak boleh lebih kecil dari tanggal mulai.',
        ]);

        if (!$isSuperadmin) {
            $userBranchIds = $user->branches->pluck('id')->toArray();
            // Check both old and new branch
            if (!in_array($announcement->branch_id, $userBranchIds) || !in_array($validated['branch_id'], $userBranchIds)) {
                return back()->with('error', 'Anda tidak memiliki akses ke cabang ini.');
            }
        }

        $announcement->update($validated);

        return back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement)
    {
        $user = auth()->user();
        $isSuperadmin = $user->role->name === 'superadmin';

        if (!$isSuperadmin) {
            $userBranchIds = $user->branches->pluck('id')->toArray();
            if (!in_array($announcement->branch_id, $userBranchIds)) {
                return back()->with('error', 'Anda tidak memiliki akses ke cabang ini.');
            }
        }

        $announcement->delete();

        return back()->with('success', 'Pengumuman berhasil dihapus.');
    }
}
