<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TherapyClassController extends Controller
{
    public function index()
    {
        return \Inertia\Inertia::render('ManageTherapyClasses', [
            'therapyClasses' => \App\Models\TherapyClass::orderBy('order_column')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'registration_url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'order_column' => 'nullable|integer|unique:therapy_classes,order_column',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'content.required' => 'Deskripsi wajib diisi.',
            'registration_url.url' => 'Format tautan pendaftaran tidak valid (harus berupa URL valid).',
        ]);

        if (!isset($validated['order_column'])) {
            $validated['order_column'] = \App\Models\TherapyClass::max('order_column') + 1;
        }

        \App\Models\TherapyClass::create($validated);

        return back()->with('message', 'Kelas Terapi berhasil ditambahkan');
    }

    public function update(Request $request, \App\Models\TherapyClass $therapyClass)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'registration_url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'order_column' => 'required|integer|unique:therapy_classes,order_column,' . $therapyClass->id,
        ], [
            'title.required' => 'Judul wajib diisi.',
            'content.required' => 'Deskripsi wajib diisi.',
            'registration_url.url' => 'Format tautan pendaftaran tidak valid (harus berupa URL valid).',
        ]);

        $therapyClass->update($validated);

        return back()->with('message', 'Kelas Terapi berhasil diperbarui');
    }

    public function destroy(\App\Models\TherapyClass $therapyClass)
    {
        $therapyClass->delete();

        return back()->with('message', 'Kelas Terapi berhasil dihapus');
    }
}
