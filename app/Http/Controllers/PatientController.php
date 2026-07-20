<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Branch;
use App\Services\PatientService;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Requests\ExtendPatientRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function __construct(private PatientService $patientService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $query = Patient::with(['branches']);

        if (!$user->isSuperadmin()) {
            // Branch Admin: only view patients in their branch
            $query->whereHas('branches', function ($q) use ($user) {
                $q->where('branches.id', $user->branch_id);
            });
        } else {
            $branchId = request('branch_id');
            if ($branchId && $branchId !== 'all') {
                $query->whereHas('branches', function ($q) use ($branchId) {
                    $q->where('branches.id', $branchId);
                });
            }
        }

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $patients = $query->latest('updated_at')->paginate(10)->withQueryString();

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'branches' => $user->isSuperadmin() ? Branch::all() : [$user->branch],
            'filters' => request()->only(['search', 'branch_id']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient): JsonResponse
    {
        $patient->load(['branches', 'attendances.branch', 'attendances.therapists']);
        return response()->json($patient);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePatientRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $this->patientService->store(
            $request->validated(), 
            $request->file('photo'), 
            $user
        );

        return redirect()->back()->with('success', 'Patient created successfully.');
    }

    /**
     * Verify and search for a patient globaly.
     */
    public function verify(Request $request): JsonResponse
    {
        $search = preg_replace('/[^0-9]/', '', (string) $request->search);

        if (empty($search)) {
            return response()->json(['patient' => null]);
        }

        $patient = Patient::where('phone', $search)
            ->with(['branches' => function ($q) {
                $q->select('branches.id', 'branches.name');
            }, 'attendances' => function ($q) {
                $q->latest('check_in')->with('branch:id,name')->limit(1);
            }])
            ->first();

        return response()->json(['patient' => $patient]);
    }

    /**
     * Extend a patient to the current user's branch.
     */
    public function extend(ExtendPatientRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        try {
            $this->patientService->extend(
                (int) $request->patient_id,
                $request->branch_id ? (int) $request->branch_id : null,
                $user,
                $request->fullUrl(),
                $request->ip(),
                $request->userAgent()
            );
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()->back()->with('success', 'Patient extended to branch successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $this->patientService->update(
            $patient,
            $request->validated(),
            $request->file('photo'),
            $user
        );

        return redirect()->back()->with('success', 'Patient updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Patient $patient): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $type = $request->query('type', 'global');
        $branchId = $request->query('branch_id');

        $this->patientService->destroy(
            $patient,
            is_string($type) ? $type : 'global',
            $branchId ? (int) $branchId : null,
            $user,
            $request->fullUrl(),
            $request->ip(),
            $request->userAgent()
        );

        return redirect()->back()->with('success', 'Patient deleted successfully.');
    }
}
