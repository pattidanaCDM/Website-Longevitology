<!DOCTYPE html>
<html>
<head>
    <title>Therapists Data</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 4px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2>Data Terapis - {{ \Carbon\Carbon::now()->locale('id')->isoFormat('dddd, D MMMM Y') }}</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Nomor HP</th>
                <th>Status</th>
                <th>Cabang</th>
            </tr>
        </thead>
        <tbody>
            @foreach($therapists as $therapist)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $therapist->name }}</td>
                <td>{{ $therapist->phone }}</td>
                <td>{{ $therapist->status }}</td>
                <td>{{ $therapist->branches->pluck('name')->implode(', ') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
