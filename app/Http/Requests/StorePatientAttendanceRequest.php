<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'therapist_ids' => 'nullable|array',
            'therapist_ids.*' => 'exists:therapists,id',
            'complaint' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ];
    }
}
