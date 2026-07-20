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
        return Branch::with(['contacts', 'photos'])->get();
    }

    /**
     * Store a new branch.
     *
     * @param array<string, mixed> $data
     * @return Branch
     */
    public function store(array $data): Branch
    {
        $branch = Branch::create(\Illuminate\Support\Arr::except($data, ['contacts', 'photos']));

        if (isset($data['contacts']) && is_array($data['contacts'])) {
            $branch->contacts()->createMany($data['contacts']);
        }

        if (isset($data['photos']) && is_array($data['photos'])) {
            foreach ($data['photos'] as $photo) {
                $path = $photo->store('branches/photos', 'public');
                $branch->photos()->create(['photo_path' => $path]);
            }
        }

        return $branch;
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
        $branch->update(\Illuminate\Support\Arr::except($data, ['contacts', 'photos', 'deleted_photo_ids']));

        if (isset($data['contacts'])) {
            $branch->contacts()->delete(); // Replace all contacts
            $branch->contacts()->createMany($data['contacts']);
        }

        if (isset($data['deleted_photo_ids']) && is_array($data['deleted_photo_ids'])) {
            $photosToDelete = $branch->photos()->whereIn('id', $data['deleted_photo_ids'])->get();
            foreach ($photosToDelete as $photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($photo->photo_path);
                $photo->delete();
            }
        }

        if (isset($data['photos']) && is_array($data['photos'])) {
            foreach ($data['photos'] as $photo) {
                $path = $photo->store('branches/photos', 'public');
                $branch->photos()->create(['photo_path' => $path]);
            }
        }
    }

    /**
     * Delete a branch.
     *
     * @param Branch $branch
     * @return void
     */
    public function destroy(Branch $branch): void
    {
        foreach ($branch->photos as $photo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($photo->photo_path);
        }
        $branch->delete();
    }
}
