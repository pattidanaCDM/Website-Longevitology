<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Branch;
use App\Models\Role;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $query = Patient::with(['branches']);

        if (!$user->isSuperadmin()) {
            // Branch Admin: only view patients in their branch
            $query->whereHas('branches', function ($q) use ($user) {
                $q->where('branches.id', $user->branch_id);
            });
        }

        $patients = $query->latest()->paginate(10);

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'branches' => $user->isSuperadmin() ? Branch::all() : [$user->branch], // For select options if needed
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        $patient->load(['branches', 'attendances.branch', 'attendances.therapists']);
        return response()->json($patient);
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
            'initial_complaint' => 'required|string',
        ]);

        // Authorization & Branch Selection
        if ($user->isSuperadmin()) {
            $request->validate(['branch_id' => 'required|exists:branches,id']);
            $branchId = $request->branch_id;
        } else {
            $branchId = $user->branch_id;
        }

        DB::transaction(function () use ($request, $branchId) {
            $data = $request->except(['card_number', 'branch_id', 'photo']);

            // Sync current_complaint with initial_complaint if not provided (or always overwrite?)
            // User request: "save it to current complaint too" implies sync.
            // Let's assume if it's a new patient, current is same as initial.
            $data['current_complaint'] = $data['initial_complaint'];

            // Handle Photo Upload
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('photos/patients', 'public');
                $data['photo'] = $path;
            }

            $patient = Patient::create($data);

            // Generate Card Number
            $branch = Branch::find($branchId);
            $branchCode = $branch->code ?? 'BR';

            // Count existing patients in this branch to generate sequence
            // Note: This simple count might reuse numbers if deleted. 
            // For rigorous sequence, use a separate sequence table or max() on the pivot table.
            $count = DB::table('patient_branches')
                ->where('branch_id', $branchId)
                ->count();

            $sequence = str_pad($count + 1, 5, '0', STR_PAD_LEFT);
            $cardNumber = $branchCode . $sequence;

            // Ensure Uniqueness (simple check, in high concurrency might need retry)
            while (DB::table('patient_branches')->where('card_number', $cardNumber)->exists()) {
                $count++;
                $sequence = str_pad($count + 1, 5, '0', STR_PAD_LEFT);
                $cardNumber = $branchCode . $sequence;
            }

            // Link to branch
            $patient->branches()->attach($branchId, ['card_number' => $cardNumber]);
        });

        return redirect()->back()->with('success', 'Patient created successfully.');
    }

    /**
     * Verify and search for a patient globaly.
     */
    public function verify(Request $request)
    {
        $search = $request->search;

        if (empty($search)) {
            return response()->json(['patient' => null]);
        }

        $patient = Patient::where('phone', $search)
            ->orWhereHas('branches', function ($q) use ($search) {
                // Determine table name from relation or hardcode since we know it
                $q->where('patient_branches.card_number', $search);
            })
            ->with(['branches' => function ($q) {
                $q->select('branches.id', 'branches.name');
                // pivot info is automatically included if withPivot is on model
            }])
            ->first();

        return response()->json(['patient' => $patient]);
    }

    /**
     * Extend a patient to the current user's branch.
     */
    public function extend(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
        ]);

        $user = auth()->user();

        $branchId = $user->branch_id;
        if ($user->isSuperadmin()) {
            $request->validate(['branch_id' => 'required|exists:branches,id']);
            $branchId = $request->branch_id;
        }

        $patient = Patient::findOrFail($request->patient_id);

        // Check if already in branch
        if ($patient->branches()->where('branch_id', $branchId)->exists()) {
            return redirect()->back()->with('error', 'Patient is already assigned to this branch.');
        }

        DB::transaction(function () use ($patient, $branchId) {
            $branch = Branch::findOrFail($branchId);
            $branchCode = $branch->code ?? 'BR';

            $count = DB::table('patient_branches')->where('branch_id', $branchId)->count() + 1;

            do {
                $sequence = str_pad($count, 5, '0', STR_PAD_LEFT);
                $cardNumber = $branchCode . $sequence;
                $exists = DB::table('patient_branches')->where('card_number', $cardNumber)->exists();
                if ($exists) $count++;
            } while ($exists);

            $patient->branches()->attach($branchId, ['card_number' => $cardNumber]);

            // Log Audit Trail
            AuditTrail::create([
                'user_id' => auth()->id(),
                'event' => 'extended',
                'description' => "Extended Patient: {$patient->name} to Branch: {$branch->name}",
                'auditable_type' => get_class($patient),
                'auditable_id' => $patient->id,
                'old_values' => null,
                'new_values' => json_encode(['branch_id' => $branchId, 'card_number' => $cardNumber]),
                'url' => request()->fullUrl(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        });

        return redirect()->back()->with('success', 'Patient extended to branch successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient)
    {
        $user = auth()->user();

        // Authorization
        if (!$user->isSuperadmin()) {
            if (!$patient->branches()->where('branches.id', $user->branch_id)->exists()) {
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
            'initial_complaint' => 'required|string',
        ]);

        $data = $request->except(['card_number', 'branch_id', 'photo']);

        // Handle Photo Upload
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos/patients', 'public');
            $data['photo'] = $path;
        }

        $patient->update($data);

        return redirect()->back()->with('success', 'Patient updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Patient $patient)
    {
        $user = auth()->user();

        // Super Admin Logic
        if ($user->isSuperadmin()) {
            $type = $request->query('type', 'global'); // 'global' or 'branch'

            if ($type === 'branch') {
                $branchId = $request->query('branch_id');
                if (!$branchId) {
                    return redirect()->back()->with('error', 'Branch ID is required for branch deletion.');
                }

                // Soft delete from specific branch (Pivot)
                $patient->branches()->updateExistingPivot($branchId, ['deleted_at' => now()]);

                AuditTrail::create([
                    'user_id' => auth()->id(),
                    'event' => 'deleted',
                    'description' => "Removed Patient: {$patient->name} from Branch ID: {$branchId}",
                    'auditable_type' => get_class($patient),
                    'auditable_id' => $patient->id,
                    'old_values' => null,
                    'new_values' => json_encode(['deleted_from_branch' => $branchId]),
                    'url' => request()->fullUrl(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);

                return redirect()->back()->with('success', 'Patient removed from branch successfully.');
            } else {
                // Global Delete (Soft Delete the Patient record itself)
                $patient->delete();

                AuditTrail::create([
                    'user_id' => auth()->id(),
                    'event' => 'deleted',
                    'description' => "Deleted Patient Globally: {$patient->name}",
                    'auditable_type' => get_class($patient),
                    'auditable_id' => $patient->id,
                    'old_values' => null,
                    'new_values' => json_encode(['deleted_at' => now()]),
                    'url' => request()->fullUrl(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);

                return redirect()->back()->with('success', 'Patient deleted globally successfully.');
            }
        }

        // Branch Admin Logic
        // Check if patient belongs to this user's branch
        if (!$patient->branches()->where('branches.id', $user->branch_id)->exists()) {
            abort(403, 'Unauthorized action.');
        }

        // Soft delete from THIS branch only (Pivot)
        $patient->branches()->updateExistingPivot($user->branch_id, ['deleted_at' => now()]);

        AuditTrail::create([
            'user_id' => auth()->id(),
            'event' => 'deleted',
            'description' => "Removed Patient: {$patient->name} from Branch: {$user->branch->name}",
            'auditable_type' => get_class($patient),
            'auditable_id' => $patient->id,
            'old_values' => null,
            'new_values' => json_encode(['deleted_from_branch' => $user->branch_id]),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Patient removed from branch successfully.');
    }
}
