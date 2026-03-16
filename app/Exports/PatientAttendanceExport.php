<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PatientAttendanceExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $attendances;

    public function __construct($attendances)
    {
        $this->attendances = $attendances;
        // Ensure Carbon uses Indonesian locale if not already set globally
        Carbon::setLocale('id');
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->attendances;
    }

    public function headings(): array
    {
        return [
            'No',
            'Absensi CDM',
            'Tanggal',
            'Hari',
            'No Anggota',
            'Nama Pasien',
            'Keluhan Awal',
            'Keluhan Saat Ini',
            'Terapis',
        ];
    }

    public function map($attendance): array
    {
        $checkIn = Carbon::parse($attendance->check_in);

        // Find the card number for the branch where attendance occurred
        $cardNumber = '-';
        if ($attendance->patient && $attendance->branch_id) {
            $branchPivot = $attendance->patient->branches
                ->where('id', $attendance->branch_id)
                ->first();

            if ($branchPivot) {
                $cardNumber = $branchPivot->pivot->card_number ?? '-';
            }
        }

        return [
            $attendance->id,
            $attendance->branch->name ?? 'CDM',
            $checkIn->format('d-m-Y'),
            $checkIn->locale('id')->isoFormat('dddd'),
            $cardNumber,
            $attendance->patient->name ?? '-',
            $attendance->patient->initial_complaint ?? '-',
            $attendance->complaint ?? '-',
            $attendance->therapists->pluck('name')->implode(', '),
        ];
    }
}
