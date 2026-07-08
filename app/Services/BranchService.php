<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Branch;

class BranchService
{
    /**
     * Get all branches.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllBranches(): \Illuminate\Database\Eloquent\Collection
    {
        return Branch::all();
    }

    /**
     * Store a new branch.
     *
     * @param array<string, mixed> $data
     * @return Branch
     */
    public function store(array $data): Branch
    {
        return Branch::create($data);
    }

    /**
     * Update an existing branch.
     *
     * @param Branch $branch
     * @param array<string, mixed> $data
     * @return void
     */
    public function update(Branch $branch, array $data): void
    {
        $branch->update($data);
    }

    /**
     * Delete a branch.
     *
     * @param Branch $branch
     * @return void
     */
    public function destroy(Branch $branch): void
    {
        $branch->delete();
    }
}
