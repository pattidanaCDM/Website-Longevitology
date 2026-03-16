<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Store a newly created branch.
     */
    public function store(Request $request)
    {
        // Only Super Admin can create branches (handled by Policy or Middleware)
        // If you want to use the policy: $this->authorize('create', Branch::class);

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'map_url' => 'nullable|url',
        ]);

        Branch::create($request->all());

        return redirect()->back()->with('success', 'Branch created successfully.');
    }

    /**
     * Update the specified branch.
     */
    public function update(Request $request, Branch $branch)
    {
        // Check if user is authorized to update this branch
        if ($request->user()->cannot('update', $branch)) {
            abort(403, 'You do not have permission to update this branch.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'map_url' => 'nullable|url',
        ]);

        $branch->update($request->all());

        return redirect()->back()->with('success', 'Branch updated successfully.');
    }

    /**
     * Remove the specified branch.
     */
    public function destroy(Branch $branch)
    {
        if (request()->user()->cannot('delete', $branch)) {
            abort(403, 'You do not have permission to delete this branch.');
        }

        $branch->delete();

        return redirect()->back()->with('success', 'Branch deleted successfully.');
    }
}
