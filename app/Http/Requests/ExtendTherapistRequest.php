<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExtendTherapistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'therapist_id' => 'required|exists:therapists,id',
        ];

        /** @var \App\Models\User $user */
        $user = $this->user();
        
        if ($user && $user->isSuperadmin()) {
            $rules['branch_id'] = 'required|exists:branches,id';
        }

        return $rules;
    }
}
