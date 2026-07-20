<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Therapist;
use App\Models\Branch;
use App\Services\TherapistService;
use App\Http\Requests\StoreTherapistRequest;
use App\Http\Requests\UpdateTherapistRequest;
use App\Http\Requests\ExtendTherapistRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TherapistExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\Response as HttpResponse;

class TherapistController extends Controller
{
    public function __construct(private TherapistService $therapistService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $query = $this->getTherapistsQuery(request());
        $therapists = $query->paginate(10)->withQueryString();

        return Inertia::render('Therapists/Index', [
            'therapists' => $therapists,
            'branches' => $user->isSuperadmin() ? Branch::all() : [$user->branch],
            'filters' => request()->only(['search', 'branch_id']),
        ]);
    }

    private function getTherapistsQuery(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $query = Therapist::with(['branches']);

        if (!$user->isSuperadmin()) {
            $query->whereHas('branches', function ($q) use ($user) {
                $q->where('branches.id', $user->branch_id);
            });
        } else {
            $branchId = $request->input('branch_id');
            if ($branchId && $branchId !== 'all') {
                $query->whereHas('branches', function ($q) use ($branchId) {
                    $q->where('branches.id', $branchId);
                });
            }
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return $query->latest('updated_at');
    }

    public function exportExcel(Request $request): BinaryFileResponse
    {
        $therapists = $this->getTherapistsQuery($request)->get();
        return Excel::download(new TherapistExport($therapists), 'data_terapis_' . date('Y-m-d') . '.xlsx');
    }

    public function exportPdf(Request $request): HttpResponse
    {
        $therapists = $this->getTherapistsQuery($request)->get();
        $pdf = Pdf::loadView('exports.therapist_pdf', compact('therapists'));
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('data_terapis_' . date('Y-m-d') . '.pdf');
    }

    /**
     * Display the specified resource.
     */
    public function show(Therapist $therapist): JsonResponse
    {
        $therapist->load(['branches', 'attendances.branch']);
        return response()->json($therapist);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTherapistRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $this->therapistService->store(
            $request->validated(), 
            $request->file('photo'), 
            $user
        );

        return redirect()->back()->with('success', 'Therapist created successfully.');
    }

    /**
     * Verify and search for a therapist globaly.
     */
    public function verify(Request $request): JsonResponse
    {
        $search = preg_replace('/[^0-9]/', '', (string) $request->search);

        if (empty($search)) {
            return response()->json(['therapist' => null]);
        }

        $therapist = Therapist::where('phone', $search)
            ->with(['branches' => function ($q) {
                $q->select('branches.id', 'branches.name');
            }, 'attendances' => function ($q) {
                $q->latest('check_in')->with('branch:id,name')->limit(1);
            }])
            ->first();

        return response()->json(['therapist' => $therapist]);
    }

    /**
     * Extend a therapist to the current user's branch.
     */
    public function extend(ExtendTherapistRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        try {
            $this->therapistService->extend(
                (int) $request->therapist_id,
                $request->branch_id ? (int) $request->branch_id : null,
                $user,
                $request->fullUrl(),
                $request->ip(),
                $request->userAgent()
            );
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()->back()->with('success', 'Therapist extended to branch successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTherapistRequest $request, Therapist $therapist): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $this->therapistService->update(
            $therapist,
            $request->validated(),
            $request->file('photo'),
            $user
        );

        return redirect()->back()->with('success', 'Therapist updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Therapist $therapist): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $type = $request->query('type', 'global');
        $branchId = $request->query('branch_id');

        $this->therapistService->destroy(
            $therapist,
            is_string($type) ? $type : 'global',
            $branchId ? (int) $branchId : null,
            $user,
            $request->fullUrl(),
            $request->ip(),
            $request->userAgent()
        );

        return redirect()->back()->with('success', 'Therapist deleted successfully.');
    }
}
