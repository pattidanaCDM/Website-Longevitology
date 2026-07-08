<!DOCTYPE html>
<html>
<head>
    <title>Patient Attendance</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 4px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2>Laporan Absensi Pasien - {{ \Carbon\Carbon::parse($date)->locale('id')->isoFormat('dddd, D MMMM Y') }}</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Absensi CDM</th>
                <th>Tanggal</th>
                <th>Hari</th>
                <th>Nama Pasien</th>
                <th>Keluhan Awal</th>
                <th>Keluhan Saat Ini</th>
                <th>Terapis</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attendances as $attendance)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $attendance->branch->name ?? 'CDM' }}</td>
                <td>{{ \Carbon\Carbon::parse($attendance->check_in)->format('d-m-Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($attendance->check_in)->locale('id')->isoFormat('dddd') }}</td>
                <td>{{ $attendance->patient->name ?? '-' }}</td>
                <td>{{ $attendance->patient->initial_complaint ?? '-' }}</td>
                <td>{{ $attendance->complaint ?? '-' }}</td>
                <td>
                    {{ $attendance->therapists->pluck('name')->implode(', ') }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
