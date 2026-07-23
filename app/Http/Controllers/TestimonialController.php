<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function index()
    {
        return Inertia::render('ManageTestimonials', [
            'testimonials' => Testimonial::all(),
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'link' => 'nullable|url|max:255',
            'is_active' => 'boolean',
        ];

        $messages = [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal 255 karakter.',
            'content.required' => 'Cerita Lengkap wajib diisi.',
            'content.string' => 'Cerita Lengkap harus berupa teks.',
            'link.url' => 'Format tautan tidak valid (harus berupa URL valid seperti https://...).',
            'link.max' => 'Tautan maksimal 255 karakter.',
        ];

        $validated = $request->validate($rules, $messages);

        Testimonial::create($validated);

        return back()->with('message', 'Testimoni berhasil ditambahkan');
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'link' => 'nullable|url|max:255',
            'is_active' => 'boolean',
        ];

        $messages = [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal 255 karakter.',
            'content.required' => 'Cerita Lengkap wajib diisi.',
            'content.string' => 'Cerita Lengkap harus berupa teks.',
            'link.url' => 'Format tautan tidak valid (harus berupa URL valid seperti https://...).',
            'link.max' => 'Tautan maksimal 255 karakter.',
        ];

        $validated = $request->validate($rules, $messages);

        $testimonial->update($validated);

        return back()->with('message', 'Testimoni berhasil diubah');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return back()->with('message', 'Testimoni berhasil dihapus');
    }
}
