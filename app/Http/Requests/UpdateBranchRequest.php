<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $branchId = $this->route('branch') ? $this->route('branch')->id : null;

        return [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:10|unique:branches,code,' . $branchId,
            'address' => 'required|string',
            'map_url' => 'nullable|url',
        ];
    }
}
