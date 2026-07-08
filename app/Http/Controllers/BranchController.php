<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Services\BranchService;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class BranchController extends Controller
{
    public function __construct(private BranchService $branchService)
    {
    }
    /**
     * Display a listing of the branches.
     */
    public function index(): \Inertia\Response
    {
        $branches = $this->branchService->getAllBranches();
        return \Inertia\Inertia::render('ManageBranches', [
            'branches' => $branches,
        ]);
    }

    /**
     * Store a newly created branch.
     */
    public function store(StoreBranchRequest $request): RedirectResponse
    {
        $this->branchService->store($request->validated());

        return redirect()->back()->with('success', 'Branch created successfully.');
    }

    /**
     * Update the specified branch.
     */
    public function update(UpdateBranchRequest $request, Branch $branch): RedirectResponse
    {
        if ($request->user()->cannot('update', $branch)) {
            abort(403, 'You do not have permission to update this branch.');
        }

        $this->branchService->update($branch, $request->validated());

        return redirect()->back()->with('success', 'Branch updated successfully.');
    }

    /**
     * Remove the specified branch.
     */
    public function destroy(Request $request, Branch $branch): RedirectResponse
    {
        if ($request->user()->cannot('delete', $branch)) {
            abort(403, 'You do not have permission to delete this branch.');
        }

        $this->branchService->destroy($branch);

        return redirect()->back()->with('success', 'Branch deleted successfully.');
    }
}
