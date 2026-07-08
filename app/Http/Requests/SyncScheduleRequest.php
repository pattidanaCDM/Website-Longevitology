<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'schedules' => 'required|array',
            'schedules.*.day' => 'required|string',
            'schedules.*.time_start' => 'required',
            'schedules.*.time_end' => 'required',
        ];
    }
}
