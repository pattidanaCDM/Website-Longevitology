<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTherapistAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'therapist_id' => 'required|exists:therapists,id',
            'branch_id' => 'nullable|exists:branches,id',
        ];
    }
}
