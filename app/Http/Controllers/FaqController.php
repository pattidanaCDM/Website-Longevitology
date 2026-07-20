<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        return Inertia::render('ManageFaq', [
            'faqs' => Faq::with('categories')->get(),
            'categories' => FaqCategory::all(),
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:faq_categories,name',
        ]);

        FaqCategory::create($validated);

        return back()->with('message', 'Kategori berhasil ditambahkan');
    }

    public function updateCategory(Request $request, FaqCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:faq_categories,name,' . $category->id,
        ]);

        $category->update($validated);

        return back()->with('message', 'Kategori berhasil diubah');
    }

    public function destroyCategory(FaqCategory $category)
    {
        $category->delete();

        return back()->with('message', 'Kategori berhasil dihapus');
    }

    public function storeFaq(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'categories' => 'required|array',
            'categories.*' => 'exists:faq_categories,id',
        ]);

        $faq = Faq::create([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
        ]);

        $faq->categories()->attach($validated['categories']);

        return back()->with('message', 'FAQ berhasil ditambahkan');
    }

    public function updateFaq(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'categories' => 'required|array',
            'categories.*' => 'exists:faq_categories,id',
        ]);

        $faq->update([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
        ]);

        $faq->categories()->sync($validated['categories']);

        return back()->with('message', 'FAQ berhasil diubah');
    }

    public function destroyFaq(Faq $faq)
    {
        $faq->delete();

        return back()->with('message', 'FAQ berhasil dihapus');
    }
}
