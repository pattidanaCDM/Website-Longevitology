<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\Branch;
use Illuminate\Foundation\Application;

class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Branch::with('schedules');

        if ($request->filled('branch_id')) {
            $query->where('id', $request->branch_id);
        }

        if ($request->filled('day')) {
            $query->whereHas('schedules', function ($q) use ($request) {
                $q->where('day', $request->day);
            });
        }

        // Get slideshow images
        $slideshowImages = [];
        $slideshowPath = public_path('image/slideshow');
        if (\Illuminate\Support\Facades\File::exists($slideshowPath)) {
            $files = \Illuminate\Support\Facades\File::files($slideshowPath);
            foreach ($files as $file) {
                $slideshowImages[] = '/image/slideshow/' . $file->getFilename();
            }
        }

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'branches' => $query->get()->map(function ($branch) {
                // Map schedules to the old format for backward compatibility or ease of display
                $branch->schedule = $branch->schedules->map(function ($s) {
                    return $s->day . ' (' . substr($s->time_start, 0, 5) . '-' . substr($s->time_end, 0, 5) . ')';
                })->implode(', ');
                return $branch;
            }),
            'filters' => $request->only(['branch_id', 'day']),
            'allBranches' => Branch::all(['id', 'name']),
            'slideshowImages' => $slideshowImages,
        ]);
    }
}
