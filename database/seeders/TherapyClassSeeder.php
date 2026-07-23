<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TherapyClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\TherapyClass::create([
            'title' => 'Kelas Dasar',
            'content' => "Pada kelas Pemula, cakra peserta akan dibuka sebesar 30%.\nMateri mengenai teori, teknik, dan etika Longevitology akan diajarkan, termasuk teknik meditasi kesadaran penuh (*mindfulness*).\n\nSetelah mengikuti kelas ini, peserta dapat melakukan penyesuaian diri.\nSetiap sesi kelas pemula berlangsung selama 10–12 jam dan diadakan pada malam hari serta akhir pekan dalam kurun waktu tiga hari. Meskipun tidak dipungut biaya untuk mengikuti kelas ini, pendaftaran awal tetap diperlukan dengan sistem siapa cepat dia dapat.",
            'order_column' => 1,
            'is_active' => true,
        ]);

        \App\Models\TherapyClass::create([
            'title' => 'Kelas Menengah',
            'content' => "Dalam kelas tingkat menengah (Intermediate), cakra peserta akan dibuka kembali dan tingkat energi mereka akan meningkat sebesar 30%.\nPeserta akan mempelajari cara menggunakan berbagai posisi tangan untuk melakukan penyesuaian khusus guna mengatasi beragam penyakit dan masalah kesehatan.\nSetelah mengikuti kelas ini, peserta dapat mulai melakukan penyesuaian terhadap orang lain.\n\nSetiap sesi tingkat menengah berlangsung selama 10–12 jam dan diadakan pada malam hari serta akhir pekan dalam kurun waktu tiga hari.\nMeskipun kelas ini tidak dipungut biaya, pendaftaran awal wajib dilakukan dengan sistem siapa cepat dia dapat.",
            'order_column' => 2,
            'is_active' => true,
        ]);

        \App\Models\TherapyClass::create([
            'title' => 'Kelas Lanjutan',
            'content' => "Dalam kelas tingkat lanjut, cakra para peserta akan terbuka sepenuhnya dan tingkat energi mereka akan meningkat.\nPeserta akan mempelajari teknik penyembuhan tingkat lanjut, seperti cara melakukan penyembuhan jarak jauh melalui telepon serta penyesuaian energi untuk penyakit serius.\n\nKelas ini berdurasi 15–18 jam dan diselenggarakan pada malam hari serta akhir pekan dalam kurun waktu lima hari.\nCalon peserta kelas tingkat lanjut harus telah menyelesaikan kelas tingkat menengah lebih dari dua bulan sebelumnya, memenuhi jumlah jam penyesuaian tertentu, serta menulis esai mengenai kesan dan pengalaman mereka selama mengikuti Longevitology.",
            'order_column' => 3,
            'is_active' => true,
        ]);
    }
}
