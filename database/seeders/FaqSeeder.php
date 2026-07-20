<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faq;
use App\Models\FaqCategory;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data Kategori
        $categories = [
            'Umum',
            'Manfaat Terapi',
            'Kelas Longevitology',
            'Praktik & Latihan',
            'Lain-lain'
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat] = FaqCategory::firstOrCreate(['name' => $cat]);
        }

        // Data FAQ
        $faqs = [
            [
                'question' => 'Apa itu Longevitology?',
                'answer' => 'Longevitology adalah metode penyembuhan alami yang menggunakan energi alam semesta (kosmik) untuk membantu menyeimbangkan aliran energi di dalam tubuh, sehingga meningkatkan kemampuan tubuh untuk menyembuhkan dirinya sendiri.',
                'categories' => ['Umum']
            ],
            [
                'question' => 'Apakah terapi ini dipungut biaya?',
                'answer' => 'Tidak. Semua kelas pembelajaran dan sesi penyembuhan Longevitology dilakukan secara sukarela dan gratis. Ini adalah bentuk pelayanan sosial kepada masyarakat.',
                'categories' => ['Umum', 'Kelas Longevitology']
            ],
            [
                'question' => 'Siapa saja yang boleh belajar Longevitology?',
                'answer' => 'Siapa saja boleh belajar, tanpa memandang usia, agama, latar belakang, maupun tingkat pendidikan. Anda tidak memerlukan pengalaman meditasi sebelumnya untuk bisa menguasai dasar-dasar Longevitology.',
                'categories' => ['Kelas Longevitology']
            ],
            [
                'question' => 'Penyakit apa saja yang bisa dibantu dengan Longevitology?',
                'answer' => 'Longevitology bukan pengobatan medis, melainkan terapi komplementer (pelengkap). Metode ini bisa membantu meringankan stres, kelelahan, nyeri sendi, masalah tidur, migrain, dan mendukung pemulihan berbagai kondisi medis dengan memperbaiki aliran energi tubuh.',
                'categories' => ['Manfaat Terapi']
            ],
            [
                'question' => 'Bagaimana cara kerja terapi Longevitology?',
                'answer' => 'Terapis akan membuka titik-titik cakra (pusat energi) pada tubuh pasien secara halus, lalu menyalurkan energi kosmik melalui sentuhan tangan di sekitar area yang sakit atau pada pusat saraf yang relevan.',
                'categories' => ['Umum', 'Praktik & Latihan']
            ],
            [
                'question' => 'Apakah ada efek samping setelah diterapi?',
                'answer' => 'Pada umumnya tidak ada efek samping negatif. Beberapa orang mungkin merasakan hangat, kesemutan ringan, atau tubuh terasa lebih lelah/mengantuk sebagai bagian dari proses detoksifikasi dan penyesuaian energi tubuh.',
                'categories' => ['Manfaat Terapi', 'Praktik & Latihan']
            ],
            [
                'question' => 'Berapa lama proses belajarnya untuk kelas dasar?',
                'answer' => 'Kelas dasar (Tingkat Awal dan Menengah) biasanya berlangsung selama 6 hari (beberapa jam per hari). Setelah mengikuti kelas ini, cakra peserta akan dibuka oleh guru dan sudah dapat mulai berlatih untuk diri sendiri.',
                'categories' => ['Kelas Longevitology']
            ],
            [
                'question' => 'Apakah Longevitology bertentangan dengan agama tertentu?',
                'answer' => 'Sama sekali tidak. Longevitology adalah murni pemanfaatan energi alam semesta dan tidak melibatkan ritual agama, mantra, jimat, maupun sistem kepercayaan tertentu. Siapapun dari agama apapun bisa bergabung.',
                'categories' => ['Lain-lain', 'Umum']
            ],
            [
                'question' => 'Berapa sering saya harus berlatih setelah mengikuti kelas?',
                'answer' => 'Sangat disarankan untuk berlatih (duduk tenang menyerap energi kosmik) secara rutin setiap hari selama kurang lebih 15-30 menit untuk menjaga kebugaran dan keseimbangan energi tubuh Anda.',
                'categories' => ['Praktik & Latihan']
            ],
            [
                'question' => 'Apakah ibu hamil atau anak-anak boleh menerima terapi?',
                'answer' => 'Tentu saja boleh. Energi alam semesta sangat murni dan aman. Longevitology bisa membantu menenangkan ibu hamil dan juga aman dilakukan pada balita atau anak-anak.',
                'categories' => ['Manfaat Terapi']
            ]
        ];

        foreach ($faqs as $faqData) {
            $faq = Faq::firstOrCreate([
                'question' => $faqData['question'],
            ], [
                'answer' => $faqData['answer']
            ]);

            // Sync categories
            $categoryIds = collect($faqData['categories'])->map(function($catName) use ($categoryModels) {
                return $categoryModels[$catName]->id;
            });

            $faq->categories()->sync($categoryIds);
        }
    }
}
