<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'birth_date' => 'required|date',
            'phone' => 'required|string|max:20|unique:patients,phone,' . $this->route('patient')->id,
            'address' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'initial_complaint' => 'required|string',
            'cakra' => 'nullable|string|max:255',
        ];

        /** @var \App\Models\User $user */
        $user = $this->user();
        
        if ($user && $user->isSuperadmin()) {
            $rules['branch_id'] = 'required|array|min:1';
            $rules['branch_id.*'] = 'exists:branches,id';
        }

        return $rules;
    }
}
