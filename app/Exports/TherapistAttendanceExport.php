<?php

declare(strict_types=1);

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TherapistAttendanceExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $attendances;

    public function __construct($attendances)
    {
        $this->attendances = $attendances;
        Carbon::setLocale('id');
    }

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
            'Nama Terapis',
            'Jam Masuk',
            'Jam Keluar',
            'Status',
        ];
    }

    public function map($attendance): array
    {
        $checkIn = Carbon::parse($attendance->check_in);
        $checkOut = $attendance->check_out ? Carbon::parse($attendance->check_out)->format('H:i') : '-';
        
        return [
            $attendance->id,
            $attendance->branch->name ?? 'CDM',
            $checkIn->format('d-m-Y'),
            $checkIn->locale('id')->isoFormat('dddd'),
            $attendance->therapist->name ?? '-',
            $checkIn->format('H:i'),
            $checkOut,
            $attendance->check_out ? 'Selesai' : 'Belum Selesai',
        ];
    }
}
