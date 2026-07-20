<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:10|unique:branches,code',
            'address' => 'required|string',
            'map_url' => 'nullable|url',
            'embed_map_url' => 'nullable|string',
            'contacts' => 'nullable|array',
            'contacts.*.name' => 'required|string|max:255',
            'contacts.*.phone' => 'nullable|string|max:50',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }
}
