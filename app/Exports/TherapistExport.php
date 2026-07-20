<?php

declare(strict_types=1);

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TherapistExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $therapists;

    public function __construct($therapists)
    {
        $this->therapists = $therapists;
    }

    public function collection()
    {
        return $this->therapists;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nama',
            'Nomor HP',
            'Status',
            'Cabang',
        ];
    }

    public function map($therapist): array
    {
        return [
            $therapist->id,
            $therapist->name,
            $therapist->phone,
            $therapist->status,
            $therapist->branches->pluck('name')->implode(', '),
        ];
    }
}
