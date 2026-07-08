<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'check_out_now' => 'nullable|boolean',
            'therapist_ids' => 'nullable|array',
            'therapist_ids.*' => 'exists:therapists,id',
            'check_in' => 'nullable|date',
            'check_out' => 'nullable|date',
        ];
    }
}
