import { Link, Head } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import DarkModeToggle from "@/Components/DarkModeToggle";
import { Target, Lightbulb, History } from "lucide-react";

export default function AboutDetail() {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-slate-950 transition-colors duration-300">
            <Head title="Tentang Kami - Longevitology" />
            
            {/* Header */}
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
                <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <Link href={route('home')} className="flex items-center gap-1 group">
                        <ApplicationLogo className="h-16 w-16 transition-transform group-hover:scale-105" />
                        <p className="font-brand text-xl font-semibold text-[#ad2c90]">
                            Longevitology
                        </p>
                    </Link>
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <Link href="/#home" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Home</Link>
                            <Link href="/#classes" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Kelas</Link>
                            <Link href="/#branches" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Cabang</Link>
                            <Link href="/#testimonials" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Testimoni</Link>
                            <Link href="/#faq" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">FAQ</Link>
                            <Link href="/#about" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Tentang</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full flex-1">
                {/* Hero Section */}
                <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#ad2c90]">Tentang Longevitology</h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                            Mengenal lebih dalam tentang metode penyembuhan alami yang memanfaatkan energi kosmik semesta. 
                            Temukan misi, kepraktisan, dan sejarah perjalanan kami.
                        </p>
                    </div>
                </section>

                {/* Misi Section */}
                <section className="py-20 px-6 bg-white dark:bg-slate-950">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="p-8 bg-[#ad2c90]/10 dark:bg-[#ad2c90]/20 rounded-full">
                                    <Target className="w-24 h-24 text-[#ad2c90] dark:text-[#d35fb9]" />
                                </div>
                            </div>
                            <div className="w-full md:w-2/3">
                                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b-2 border-[#ad2c90] inline-block pb-2">Misi Kami</h2>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                                    <blockquote className="italic border-l-4 border-[#ad2c90] pl-4 text-gray-700 dark:text-gray-200 font-medium mb-6 w-full text-center">
                                        "Menyelamatkan nyawa dengan penuh kasih."
                                    </blockquote>
                                    <p> 
                                        Teruslah melangkah dengan cinta kasih, kesabaran, dan welas asih,
                                        tanpa mengejar ketenaran ataupun imbalan, tanpa pamrih maupun keserakahan,
                                        melayani dengan gigih dan penuh pengabdian
                                        seraya mencurahkan cinta dan kepedulian bagi masyarakat.
                                        Dengan demikian, kita dapat semakin memupuk rasa welas asih,
                                        sehingga keluarga kita menjadi lebih sejahtera,
                                        masyarakat kita menjadi lebih harmonis,
                                        negara kita menjadi lebih kuat,
                                        dan umat manusia menjadi lebih sehat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Praktis Section */}
                <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="p-8 bg-orange-500/10 dark:bg-orange-500/20 rounded-full">
                                    <Lightbulb className="w-24 h-24 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <div className="w-full md:w-2/3">
                                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b-2 border-orange-500 inline-block pb-2">Praktis</h2>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                                    <p className="mb-4">
                                        Longevitology (yang dalam bahasa Mandarin berarti "studi tentang umur panjang") adalah salah satu metode penyembuhan yang memanfaatkan aliran energi untuk meningkatkan kemampuan tubuh dalam menyembuhkan dirinya sendiri. 
                                        Sama halnya dengan tubuh sehat yang menyerap oksigen ke dalam paru-paru, tubuh juga menyerap energi semesta melalui pusat-pusat saraf yang disebut cakra. 
                                        Setiap cakra mengatur sistem tubuh yang berbeda. Ketika energi semesta masuk ke dalam tubuh melalui cakra-cakra tersebut, sistem tubuh yang terkait akan kembali mendapatkan energi. 
                                        Karena berbagai alasan fisik maupun emosional, cakra seseorang bisa saja mengalami penyumbatan sebagian atau menjadi kurang efisien dalam menyerap maupun menyalurkan energi semesta tersebut.
                                    </p>
                                    <p className="mb-4">
                                        Dalam kelas Longevitology, Pengajar Tzu-Chen Lin dan Yu-Feng Wei membuka cakra para siswa agar dapat menerima energi semesta. 
                                        Selanjutnya, kita dapat menggunakan tangan untuk menyalurkan energi semesta (yang masuk melalui cakra yang telah terbuka) ke dalam tubuh sendiri (penyelarasan mandiri) atau ke tubuh orang lain (penyelarasan untuk orang lain). 
                                        Proses penyaluran energi menggunakan tangan ini dikenal sebagai penyelarasan (*adjustment*). 
                                        Selain belajar melakukan meditasi dalam keheningan, para siswa diajarkan untuk menerapkan berbagai teknik penyelarasan guna meningkatkan kesehatan secara umum atau meringankan kondisi masalah kesehatan maupun penyakit tertentu dalam tubuh mereka. 
                                        Teknik modern ini tidak hanya mudah dipelajari dan digunakan tanpa efek samping, tetapi juga memberikan manfaat bagi tubuh fisik, mental, maupun spiritual, baik bagi praktisi maupun penerima manfaat (pasien).
                                    </p>
                                    <p className="mb-4">
                                        Pengajar Lin dan Pengajar Wei telah berkeliling dunia untuk mengajarkan metode ini secara cuma-cuma, dan mereka menetapkan ketentuan bahwa para praktisi juga wajib melakukan penyelarasan bagi orang lain secara gratis.
                                    </p>
                                    <p className="mb-4">
                                        Penting untuk dicatat bahwa penyelarasan energi ini tidak menyembuhkan atau mengobati penyakit apa pun, serta bukan merupakan pengganti perawatan medis konvensional. 
                                        Dengan memulihkan keseimbangan energi, metode ini dapat mendukung kemampuan alami tubuh untuk menyembuhkan dirinya sendiri. 
                                        Longevitology tidak mewajibkan siswanya untuk menjadi sukarelawan, namun seluruh praktisi Longevitology adalah sukarelawan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Histori Section */}
                <section className="py-20 px-6 bg-white dark:bg-slate-950">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                                    <img 
                                        src="/image/teachers.jpg" 
                                        alt="Pengajar Longevitology" 
                                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-2/3">
                                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b-2 border-blue-500 inline-block pb-2">Sejarah & Perjalanan</h2>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                                    <p>
                                        Panitia Persiapan Yayasan Amal Longevitology (*Longevitology Benevolent Foundation Preparatory Committee*) adalah organisasi nirlaba yang didirikan pada tahun 1993 di Taiwan oleh Dr. Tom Lin. 
                                        Organisasi nirlaba Longevitology yang terkait di Amerika Serikat adalah Longevitology USA, yang berlokasi di Los Angeles, California.
                                    </p>
                                    <p>
                                        Setelah mengenal suatu bentuk pengobatan energi, Dr. Lin merekomendasikan praktik tersebut kepada Pengajar Tzu-Chen Lin. 
                                        Melalui pengalaman klinis nyata, Pengajar Lin menyempurnakan praktik kuno tersebut serta menambahkan konsep, teori, dan metode baru, termasuk menghilangkan beberapa unsur dan gagasan awal yang dianggap tidak perlu. 
                                        Berkat perubahan-perubahan mendasar ini, beliau menghadirkan teknik penyelarasan energi modern yang lebih sederhana, yang dikenal sebagai Longevitology. 
                                        Teknik modern ini tidak hanya mudah dipelajari dan diterapkan tanpa efek samping, tetapi juga memberikan manfaat bagi tubuh fisik, mental, maupun spiritual, baik bagi praktisi maupun pasien.
                                    </p>
                                    <p>
                                        Kegiatan organisasi, termasuk pengajaran, telah dijalankan oleh Pengajar Lin dan Pengajar Wei sejak tahun 1993. 
                                        Mereka meyakini bahwa siapa pun—bahkan mereka yang sedang sakit atau lanjut usia—dapat menggunakan metode ini untuk meningkatkan kemampuan tubuh dalam menyembuhkan diri sendiri sekaligus membantu orang lain.
                                    </p>
                                    <p>
                                        Longevitology bukanlah sebuah bisnis; tidak ada transaksi jual-beli di dalamnya. 
                                        Longevitology bukan pula sebuah agama, tidak memiliki aspirasi politik, serta tidak berafiliasi dengan kelompok keagamaan, spiritual, pendidikan, pemerintah, komersial, medis, ataupun politik mana pun di dunia.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* CTA / Back to Home */}
                <section className="py-16 px-6 bg-[#ad2c90] text-white text-center">
                    <h3 className="text-2xl font-bold mb-6">Siap Memulai Perjalanan Kesehatan Anda?</h3>
                    <Link 
                        href={route('home')} 
                        className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#ad2c90] hover:bg-gray-100 font-bold rounded-full shadow-lg transition-all transform hover:scale-105"
                    >
                        Kembali ke Halaman Utama
                    </Link>
                </section>
            </main>
        </div>
    );
}
