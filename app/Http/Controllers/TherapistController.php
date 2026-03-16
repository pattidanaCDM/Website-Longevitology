<?php

namespace App\Http\Controllers;

use App\Models\Therapist;
use App\Models\Branch;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TherapistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $query = Therapist::with(['branches']);

        if (!$user->isSuperadmin()) {
            // Branch Admin: only view therapists in their branch
            $query->whereHas('branches', function ($q) use ($user) {
                $q->where('branches.id', $user->branch_id);
            });
        }

        $therapists = $query->latest()->paginate(10);

        return Inertia::render('Therapists/Index', [
            'therapists' => $therapists,
            'branches' => $user->isSuperadmin() ? Branch::all() : [$user->branch],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Therapist $therapist)
    {
        $therapist->load(['branches', 'attendances.branch']);
        return response()->json($therapist);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'birth_date' => 'required|date',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($user->isSuperadmin()) {
            $request->validate(['branch_id' => 'required|exists:branches,id']);
            $branchId = $request->branch_id;
        } else {
            $branchId = $user->branch_id;
        }

        DB::transaction(function () use ($request, $branchId) {
            $data = $request->except(['card_number', 'branch_id', 'photo']);

            // Handle Photo Upload
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('photos/therapists', 'public');
                $data['photo'] = $path;
            }

            $therapist = Therapist::create($data);

            // Generate Card Number
            $branch = Branch::find($branchId);
            $branchCode = $branch->code ?? 'TR';

            $count = DB::table('therapist_branches')
                ->where('branch_id', $branchId)
                ->count();

            $sequence = str_pad($count + 1, 5, '0', STR_PAD_LEFT);
            $cardNumber = $branchCode . $sequence; // e.g., CDM00001

            // Ensure Uniqueness
            while (DB::table('therapist_branches')->where('card_number', $cardNumber)->exists()) {
                $count++;
                $sequence = str_pad($count + 1, 5, '0', STR_PAD_LEFT);
                $cardNumber = $branchCode . $sequence;
            }

            // Link to branch
            $therapist->branches()->attach($branchId, ['card_number' => $cardNumber]);
        });

        return redirect()->back()->with('success', 'Therapist created successfully.');
    }

    /**
     * Verify and search for a therapist globaly.
     */
    public function verify(Request $request)
    {
        $search = $request->search;

        if (empty($search)) {
            return response()->json(['therapist' => null]);
        }

        $therapist = Therapist::where('phone', $search)
            ->orWhereHas('branches', function ($q) use ($search) {
                $q->where('therapist_branches.card_number', $search);
            })
            ->with(['branches' => function ($q) {
                $q->select('branches.id', 'branches.name');
            }])
            ->first();

        return response()->json(['therapist' => $therapist]);
    }

    /**
     * Extend a therapist to the current user's branch.
     */
    public function extend(Request $request)
    {
        $request->validate([
            'therapist_id' => 'required|exists:therapists,id',
        ]);

        $user = auth()->user();
        // If superadmin, they might need to specify branch, but for now assuming current user's branch context
        // Or if superadmin extending, request should have branch_id.
        // The prompt implies the admin (manager) does this for "their own data".

        $branchId = $user->branch_id;
        if ($user->isSuperadmin()) {
            $request->validate(['branch_id' => 'required|exists:branches,id']);
            $branchId = $request->branch_id;
        }

        $therapist = Therapist::findOrFail($request->therapist_id);

        // Check if already in branch
        if ($therapist->branches()->where('branch_id', $branchId)->exists()) {
            return redirect()->back()->with('error', 'Therapist is already assigned to this branch.');
        }

        DB::transaction(function () use ($therapist, $branchId) {
            $branch = Branch::findOrFail($branchId);
            $branchCode = $branch->code ?? 'TR'; // Fallback code if not set

            // Start count with 1
            $count = DB::table('therapist_branches')->where('branch_id', $branchId)->count() + 1;

            do {
                $sequence = str_pad($count, 5, '0', STR_PAD_LEFT);
                $cardNumber = $branchCode . $sequence;
                $exists = DB::table('therapist_branches')->where('card_number', $cardNumber)->exists();
                if ($exists) $count++;
            } while ($exists);

            $therapist->branches()->attach($branchId, ['card_number' => $cardNumber]);

            // Log Audit Trail
            AuditTrail::create([
                'user_id' => auth()->id(),
                'event' => 'extended',
                'description' => "Extended Therapist: {$therapist->name} to Branch: {$branch->name}",
                'auditable_type' => get_class($therapist),
                'auditable_id' => $therapist->id,
                'old_values' => null,
                'new_values' => json_encode(['branch_id' => $branchId, 'card_number' => $cardNumber]),
                'url' => request()->fullUrl(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        });

        return redirect()->back()->with('success', 'Therapist extended to branch successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Therapist $therapist)
    {
        $user = auth()->user();

        if (!$user->isSuperadmin()) {
            if (!$therapist->branches()->where('branches.id', $user->branch_id)->exists()) {
                abort(403, 'Unauthorized action.');
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'birth_date' => 'required|date',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->except(['card_number', 'branch_id', 'photo']);

        // Handle Photo Upload
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos/therapists', 'public');
            $data['photo'] = $path;
        }

        $therapist->update($data);

        return redirect()->back()->with('success', 'Therapist updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Therapist $therapist)
    {
        $user = auth()->user();

        // Super Admin Logic
        if ($user->isSuperadmin()) {
            $type = $request->query('type', 'global');

            if ($type === 'branch') {
                $branchId = $request->query('branch_id');
                if (!$branchId) {
                    return redirect()->back()->with('error', 'Branch ID is required for branch deletion.');
                }

                // Soft delete from specific branch pivot
                $therapist->branches()->updateExistingPivot($branchId, ['deleted_at' => now()]);

                AuditTrail::create([
                    'user_id' => auth()->id(),
                    'event' => 'deleted',
                    'description' => "Removed Therapist: {$therapist->name} from Branch ID: {$branchId}",
                    'auditable_type' => get_class($therapist),
                    'auditable_id' => $therapist->id,
                    'old_values' => null,
                    'new_values' => json_encode(['deleted_from_branch' => $branchId]),
                    'url' => request()->fullUrl(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);

                return redirect()->back()->with('success', 'Therapist removed from branch successfully.');
            } else {
                // Global Delete (Soft Delete Therapist itself)
                $therapist->delete();

                AuditTrail::create([
                    'user_id' => auth()->id(),
                    'event' => 'deleted',
                    'description' => "Deleted Therapist Globally: {$therapist->name}",
                    'auditable_type' => get_class($therapist),
                    'auditable_id' => $therapist->id,
                    'old_values' => null,
                    'new_values' => json_encode(['deleted_at' => now()]),
                    'url' => request()->fullUrl(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);

                return redirect()->back()->with('success', 'Therapist deleted globally successfully.');
            }
        }

        // Branch Admin Logic
        if (!$therapist->branches()->where('branches.id', $user->branch_id)->exists()) {
            abort(403, 'Unauthorized action.');
        }

        // Soft delete from THIS branch only (pivot)
        $therapist->branches()->updateExistingPivot($user->branch_id, ['deleted_at' => now()]);

        AuditTrail::create([
            'user_id' => auth()->id(),
            'event' => 'deleted',
            'description' => "Removed Therapist: {$therapist->name} from Branch: {$user->branch->name}",
            'auditable_type' => get_class($therapist),
            'auditable_id' => $therapist->id,
            'old_values' => null,
            'new_values' => json_encode(['deleted_from_branch' => $user->branch_id]),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Therapist removed from branch successfully.');
    }
}
