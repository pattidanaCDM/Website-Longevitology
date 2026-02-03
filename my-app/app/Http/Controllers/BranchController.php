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
        $branch->delete();

        return redirect()->back()->with('success', 'Branch deleted successfully.');
    }
}
