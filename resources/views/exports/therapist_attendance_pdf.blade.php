<!DOCTYPE html>
<html>
<head>
    <title>Therapist Attendance</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 4px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2>Laporan Absensi Terapis - {{ \Carbon\Carbon::parse($date)->locale('id')->isoFormat('dddd, D MMMM Y') }}</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Absensi CDM</th>
                <th>Tanggal</th>
                <th>Hari</th>
                <th>Nama Terapis</th>
                <th>Jam Masuk</th>
                <th>Jam Keluar</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attendances as $attendance)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $attendance->branch->name ?? 'CDM' }}</td>
                <td>{{ \Carbon\Carbon::parse($attendance->check_in)->format('d-m-Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($attendance->check_in)->locale('id')->isoFormat('dddd') }}</td>
                <td>{{ $attendance->therapist->name ?? '-' }}</td>
                <td>{{ \Carbon\Carbon::parse($attendance->check_in)->format('H:i') }}</td>
                <td>{{ $attendance->check_out ? \Carbon\Carbon::parse($attendance->check_out)->format('H:i') : '-' }}</td>
                <td>{{ $attendance->check_out ? 'Selesai' : 'Belum Selesai' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
