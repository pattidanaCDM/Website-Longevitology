import { Link, Head } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import DarkModeToggle from "@/Components/DarkModeToggle";
import { User } from "lucide-react";

export default function TestimonialDetail() {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-slate-950 transition-colors duration-300">
            <Head title="Testimoni - Longevitology" />

            {/* Header */}
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
                <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <Link href={route('home')} className="flex items-center gap-1 group">
                        <ApplicationLogo className="h-16 w-16 transition-transform group-hover:scale-105" />
                        <p className="font-brand text-xl font-semibold text-[#ad2c90]">
                            Longevitology
                        </p>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Link href="/#home" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Home</Link>
                        <Link href="/#classes" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Kelas</Link>
                        <Link href="/#branches" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Cabang</Link>
                        <Link href="/#testimonials" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Testimoni</Link>
                        <Link href="/#faq" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">FAQ</Link>
                        <Link href="/#about" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Tentang</Link>
                        <Link href="/#contact" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Hubungi Kami</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <DarkModeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full flex-1">
                {/* Hero Section */}
                <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#ad2c90]">Testimoni Peserta</h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                            Kisah nyata dan pengalaman dari mereka yang telah merasakan langsung manfaat energi kosmik Longevitology dalam membantu proses penyembuhan diri.
                        </p>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto py-16 px-6 space-y-20">

                    {/* Dr. Chen */}
                    <section id="kidney-stones" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-8 items-start py-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-[#ad2c90]/10 dark:bg-[#ad2c90]/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-[#ad2c90] dark:text-[#d35fb9]" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Batu Ginjal & Bakti Anak</h2>
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6">- Dr. Chen, MD - Taiwan</h3>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
                                    <p>
                                        Beberapa tahun yang lalu, atas permintaan banyak pihak, Pengajar Lin dan Pengajar Wei mulai membuka kelas Longevitology di Vancouver. Suatu kehormatan bagi saya untuk menjadi tuan rumah bagi mereka selama mereka tinggal di Vancouver. Saya sangat mengagumi dan menghormati mereka atas pengabdian dan cinta kasih mereka. Mereka sangat toleran, sehingga mudah bagi kami untuk bergaul dengan mereka. Mereka membuat kami merasa seperti keluarga. Rasanya berat bagi kami untuk merelakan mereka pergi setelah kelas selesai.
                                    </p>
                                    <p>
                                        Suatu hari kami mengajak mereka melihat ikan salmon yang bermigrasi dari laut ke sungai tempat mereka dilahirkan untuk bertelur. Fenomena ini terjadi sekali setiap empat tahun. Bagi ikan salmon, berenang melawan arus sungai untuk jarak yang sangat jauh adalah sebuah penderitaan. Banyak dari mereka yang terluka, kelelahan, dan mati di tepi sungai. Seluruh sungai dipenuhi oleh ikan salmon. Para turis pun berdatangan hanya untuk menyaksikan peristiwa ini. Saat Pengajar Lin melihat ikan salmon yang menderita itu, beliau mengulurkan tangannya untuk menyalurkan energi Longevitology kepada ikan-ikan yang sedang sekarat. Beliau berdiri di sana dalam diam di tengah kerumunan turis kaukasia yang melewatinya dengan tatapan aneh. Namun, hal itu sama sekali tidak mengganggu Pengajar Lin. Saya sangat tersentuh. Beliau begitu peduli hingga menyelamatkan ikan salmon sekalipun, apalagi manusia.
                                    </p>
                                    <p>
                                        Tahun lalu, masalah ginjal saya kambuh (batu ginjal). Gejalanya dimulai dengan nyeri punggung bawah. Istri saya kemudian memberikan terapi Longevitology kepada saya. Saya juga meletakkan satu tangan di C7 dan tangan lainnya di area yang sakit sampai saya tertidur. Beberapa hari kemudian, saya mengeluarkan batu berdiameter 0,9 cm dengan tepi yang tajam. Saya membawanya ke dokter, dan dokter berkata, "Wow! Saya hanya bisa mengatakan bahwa Anda memiliki toleransi rasa sakit yang luar biasa." Sebenarnya, selama seluruh proses itu, saya hanya merasakan pegal, bukan rasa sakit. Ini semua berkat Longevitology. Beberapa bulan yang lalu, saya kembali mengeluarkan batu yang lebih kecil. Saya sangat terkejut karena saya bahkan tidak tahu bahwa saya masih memiliki batu di ginjal saya.
                                    </p>
                                    <p>
                                        Energi Longevitology dapat membuat hal-hal luar biasa terjadi. Kita semua harus mengulurkan tangan kita untuk memancarkan cinta kasih dan energi. Jangan meragukannya.
                                    </p>
                                    <p>
                                        Ibu saya meninggal dunia dua tahun lalu di usia 84 tahun. Beliau menderita penyakit jantung. Kondisinya lemah dan beliau sering mengalami kesulitan tidur. Beliau merasa bahwa waktunya sudah tidak lama lagi dan bahkan sudah menyiapkan pakaian untuk pemakamannya sendiri. Saya sering membantunya dengan Longevitology saat beliau berada di kursi roda atau di tempat tidur. Beliau akan menatap saya sambil tersenyum. Terkadang beliau menyentuh wajah saya atau menepuk lutut saya. Saya merasa seperti bayi baginya. Sering kali, beliau tertidur di pangkuan saya. Pemandangan ini adalah potret seorang ibu berusia 80-an tahun yang tertidur di pangkuan putranya yang berusia 50-an tahun.
                                    </p>
                                    <p>
                                        Itu adalah sebuah pemandangan penuh cinta. Longevitology memberi kita kesempatan untuk menyentuh dan menunjukkan cinta serta kepedulian kita kepada orang-orang yang kita sayangi. Ibu saya tahu bahwa saya sangat mencintainya. Saat ayah saya sekarat dulu, saya belum belajar Longevitology. Saya tidak tahu bagaimana cara menunjukkan rasa cinta saya kepadanya.
                                    </p>
                                    <p>
                                        Setelah ibu saya meninggal, kenangan menyembuhkannya dengan Longevitology sering kali muncul di benak saya. Saat saya sedang menyembuhkannya, mungkin beliau berpikir, "Pria yang aku besarkan ini sedang memberitahuku betapa ia sangat mencintaiku melalui tangannya."
                                    </p>
                                    <p>
                                        Saya sangat berterima kasih kepada Longevitology, khususnya kepada Pengajar Lin dan Pengajar Wei. Saya juga ingin mengucapkan kepada seluruh relawan, "Rasa hormat saya yang tulus untuk Anda semua atas pengabdian Anda kepada sesama."
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-20 border-gray-200 dark:border-gray-800" />
                    </section>

                    {/* Szusin Chen */}
                    <section id="liver-cysts" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-8 items-start py-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Kista & Tumor Hati</h2>
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6">- Szusin Chen - USA</h3>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
                                    <p>
                                        Pada malam tanggal 5 Juli 2007, saya tiba-tiba merasakan tekanan gas di perut dan nyeri di lambung. Diagnosis dokter menunjukkan adanya kista di hati saya. Yang terbesar berukuran 15 sentimeter, diikuti oleh ukuran 12 dan 8,9 sentimeter, yang tersebar di dalam hati saya.
                                    </p>
                                    <p>
                                        Setelah itu, saya mulai kesulitan makan dan kehilangan nafsu makan, yang mengakibatkan penurunan berat badan drastis sebesar enam belas pon dalam tiga bulan. Pada saat itu, operasi sangat berbahaya mengingat kondisi fisik saya, dan tidak ada obat yang cocok untuk menyembuhkannya. Dokter tidak bisa berbuat banyak.
                                    </p>
                                    <p>
                                        Untungnya, saya telah mengikuti kelas Longevitology. Ibu dan saudara perempuan saya selalu membantu memberikan terapi Longevitology setiap hari sepulang kerja. Setelah beberapa waktu, energi saya meningkat, dan pembengkakan gas di perut saya juga mengecil dari yang tadinya sebesar kehamilan 5 bulan menjadi hanya sedikit menonjol. Nafsu makan saya pun bertambah, dari yang tadinya hanya sanggup makan dua sendok sup menjadi satu mangkuk penuh. Energi dan kekuatan fisik saya mampu menopang saya untuk terus bekerja. Selama masa ini, kami terus-menerus mempraktikkan Longevitology, memanfaatkan setiap kesempatan di luar waktu makan dan tidur.
                                    </p>
                                    <p>
                                        Pada tahun 2008, ketika kondisi fisik saya sudah membaik, teman-teman saya hampir tidak percaya bahwa saya memiliki kista sebesar itu di dalam tubuh saya. Namun, saya tahu bahwa kista-kista yang tertinggal di hati saya ini ibarat bom waktu; oleh karena itu, saya tidak boleh berhenti berlatih Longevitology agar energi di dalam tubuh saya tetap terjaga. Meski begitu, kondisi fisik saya berfluktuasi, terkadang kuat dan terkadang lemah.
                                    </p>
                                    <p>
                                        Pada musim semi 2009, saya terkena flu ringan yang menyebabkan pembengkakan di seluruh tubuh. Berkat bantuan para relawan Longevitology, tubuh saya pulih ke kondisi yang sangat baik. Namun, di musim dingin, luka di mulut membuat saya tidak bisa makan, yang berakibat pada penurunan berat badan sebanyak lima belas pon, hingga saya terlihat seperti tinggal kulit pembalut tulang. Setelah saya bisa makan lagi, rasa nyeri tajam yang belum pernah saya alami sebelumnya muncul di bagian hati saya. Kami pun bekerja lebih keras lagi dalam melakukan terapi penyembuhan Longevitology.
                                    </p>
                                    <p>
                                        Pada akhir Februari 2010, suatu hari saya merasa cukup sehat, dan makan sedikit lebih banyak dari biasanya. Setelah itu, saya merasa tidak nyaman di perut, dan anehnya ada sebuah benjolan. Tebakan saya, mungkin saya terlalu banyak mencampur makanan yang berbeda-beda. Sejak saat itu, para relawan dan keluarga saya secara khusus meningkatkan terapi Longevitology.
                                    </p>
                                    <p>
                                        Pada tanggal 5 April, ketika keponakan saya menggendong saya ke lantai atas, benjolan di perut saya bergesekan dengan punggungnya, dan membengkak menjadi ukuran 10 kali 9 sentimeter dengan tinggi 5 sentimeter disertai rasa sakit yang parah. Sejak hari itu, kulit di sekitar benjolan berubah menjadi merah, terasa seperti kantung nanah.
                                    </p>
                                    <p>
                                        Baru pada tanggal 22 April keropeng (koreng) muncul. Saya dirawat di rumah sakit karena rasa sakitnya sudah tak tertahankan. Tak disangka, setelah menjalani CT scan, dokter memberi tahu saya bahwa ada saluran yang menghubungkan kista di hati saya ke kantung nanah tersebut. Saat itulah saya teringat perkataan Pengajar Longevitology saya, Pengajar Lin: semua tumor pada akhirnya akan keluar melalui kulit. Dokter pun segera melakukan prosedur pembedahan untuk mengeluarkan cairan, darah, dan nanah dari kantung tersebut. Seketika itu juga, rasa sakit akibat tekanan di tubuh saya yang membengkak menghilang. Seluruh proses itu memakan waktu sekitar enam hari. Hasil CT scan berikutnya memastikan bahwa semua kista di hati saya telah lenyap.
                                    </p>
                                    <p>
                                        Pada saat yang sama, saya mendapatkan kembali nafsu makan yang luar biasa, dengan energi chi yang berlimpah di dalam tubuh saya. Bahkan kerutan di wajah saya ikut memudar. Longevitology yang luar biasa telah menyelamatkan saya dari ambang kematian. Kini setelah kembali ke rumah, saya mengandalkan Longevitology untuk proses pemulihan yang cepat.
                                    </p>
                                    <p>
                                        Setelah mengalami semua respons positif ini, saya baru menyadari bahwa segala penyakit saya di masa lalu, seperti asma, hidung tersumbat, detak jantung cepat, hipertensi, tekanan darah rendah, hingga kulit bersisik, semuanya telah menghilang. Setelah kejadian ini, saya merasa sangat berutang budi kepada Longevitology serta semangat mulia para Pengajar yang telah menyelamatkan kami, membiarkan para siswa menemukan kembali kesehatan dan umur panjang mereka sendiri.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-20 border-gray-200 dark:border-gray-800" />
                    </section>

                    {/* Mr. Ku */}
                    <section id="own-physician" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-8 items-start py-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-green-500/10 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Menjadi Dokter bagi Diri Sendiri</h2>
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6">- Mr. Ku - Germany</h3>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
                                    <p>
                                        Pada bulan Juli 2004, saya pertama kali mendengar tentang Longevitology dari Dr. Wong Fong Ying, M.D. Setelah itu, saya mengikuti kelasnya. Selama Anda memiliki kesabaran dan ketekunan dalam bermeditasi serta berlatih, Anda pasti akan merasakan manfaatnya. Longevitology layaknya memiliki seorang dokter yang selalu menemani Anda setiap saat. Ia akan meningkatkan kesehatan Anda tanpa Anda sadari.
                                    </p>
                                    <p>
                                        Suatu hari, Anda akan menyadari bahwa tangan dan kaki Anda tidak lagi terasa dingin. Anda tidak lagi perlu menumpuk selimut tambahan di atas tempat tidur saat musim dingin tiba.
                                    </p>
                                    <p>
                                        Suatu hari, Anda akan menyadari bahwa Anda telah melupakan obat-obatan yang biasa Anda minum untuk masalah lambung. Sebagai gantinya, Anda sudah terbiasa mengandalkan "dokter" yang praktis dan nyaman ini.
                                    </p>
                                    <p>
                                        Suatu hari, Anda tiba-tiba menyadari bahwa Anda tidak mudah lelah lagi. Anda tidak lagi merasa kurang tidur. Hanya dengan bermeditasi selama satu atau dua menit, rasa lelah Anda pun sirna.
                                    </p>
                                    <p>
                                        Suatu hari, Anda akan mendapati diri Anda menjadi jauh lebih sabar. Anda tidak lagi mudah terpancing amarah.
                                    </p>
                                    <p>
                                        Suatu hari, Anda akan menemukan bahwa Anda dapat meredakan rasa sakit yang dialami keluarga, teman, maupun rekan kerja Anda. Mungkin awalnya Anda khawatir bahwa rekan Anda tidak akan memercayai "dokter" yang selalu mengikuti Anda ke mana-mana ini. Sampai akhirnya, Anda memberanikan diri untuk menolong seorang rekan yang punggungnya terkilir. Hanya dalam beberapa menit, rasa sakitnya mereda dan ia bisa berjalan kembali. Hati Anda pun dipenuhi oleh sukacita. Anda menjadi lebih percaya diri dan mulai membantu lebih banyak orang.
                                    </p>
                                    <p>
                                        Hingga saat ini, sembilan rekan kerja saya telah mengikuti kelas Longevitology tingkat dasar dan menengah. Mereka belajar dengan tekun dan bahkan telah membuat rencana untuk membantu orang lain.
                                    </p>
                                    <p>
                                        Suatu hari, dokter keluarga Anda akan memberi tahu bahwa Anda sangat sehat. Hasil tes darah dan tekanan darah Anda kembali normal. Semua ini bukanlah sekadar mimpi saya; ini adalah pengalaman nyata saya.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-20 border-gray-200 dark:border-gray-800" />
                    </section>

                    {/* Ms. Gu */}
                    <section id="headache" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-8 items-start py-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-orange-500/10 dark:bg-orange-500/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sakit Kepala, Telinga Berdenging & Pusing</h2>
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6">- Ms. Gu, retired prof - Taiwan</h3>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
                                    <p>
                                        Sebulan yang lalu, saya diperkenalkan dengan Longevitology. Selama bertahun-tahun, saya menderita sakit kepala, telinga berdenging, dan pusing. Saya sudah mencoba berbagai cara, mulai dari obat pereda nyeri, akupunktur, hingga obat herbal. Kemudian, seorang teman memperkenalkan saya pada energi penyembuhan semesta Longevitology.
                                    </p>
                                    <p>
                                        Saya beruntung bisa bertemu dengan Bapak dan Ibu Hsu Hwan Tsung. Mereka membantu saya dengan energi tersebut. Awalnya, saya tidak merasakan adanya perubahan. Suatu kali, mereka datang saat saya sedang mengalami sakit kepala hebat. Mereka meletakkan tangan mereka di pelipis saya. Setelah 20 menit, saya merasakan dengan jelas bahwa rasa sakit itu berpindah ke dahi saya. Sepuluh menit setelah mereka meletakkan tangan di dahi saya, rasa sakit berkurang setidaknya 80 persen, lalu berpindah kembali ke pelipis. Mereka terus menempelkan tangan di kepala saya sampai akhirnya sakit kepala saya hilang. Sungguh sebuah keajaiban. Ini adalah pengalaman pertama saya di mana sakit kepala saya teratasi tanpa menggunakan obat-obatan.
                                    </p>
                                    <p>
                                        Saya mengikuti kelas Longevitology pada bulan Oktober 2006 dan menjadi lebih percaya diri. Kini, saya dapat memanfaatkan apa yang telah saya pelajari untuk membantu diri sendiri maupun orang lain. Saya sangat menghargai ikatan saya dengan Longevitology dan berniat menggunakannya untuk membantu keluarga, teman-teman, serta orang lain.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-20 border-gray-200 dark:border-gray-800" />
                    </section>

                    {/* Mrs. Chen */}
                    <section id="allergies" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-8 items-start py-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-pink-500/10 dark:bg-pink-500/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bakteri Pemakan Daging & Alergi</h2>
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6">- Mrs. Chen - England</h3>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
                                    <p>
                                        Tiga tahun yang lalu, ketika saya berkunjung ke Mesir, saya terjangkit penyakit yang disebabkan oleh bakteri pemakan daging. Karena tidak didiagnosis cukup dini, borok (ulserasi) menyebar ke seluruh kaki saya dan menggerogoti otot hingga ke tulang. Kondisi ini diperparah oleh penyakit radang sendi (rheumatoid arthritis) dan hepatitis B. Saya harus dirawat di rumah sakit selama sebulan. Efek samping dari obat-obatan merusak ginjal saya. Saya kehilangan berat badan sebanyak 22 pon serta sebagian besar rambut saya rontok. Kerabat dan teman-teman saya sangat sedih melihat kondisi saya. Saya sudah seperti mayat hidup.
                                    </p>
                                    <p>
                                        Saya belum pulih pasca operasi. Luka bedah di kaki saya tidak kunjung sembuh selama lebih dari satu tahun dan terus-menerus mengeluarkan cairan. Saat saya berkunjung ke Amerika Serikat, infeksi tersebut kambuh. Kaki saya membengkak sebesar kaki gajah. Saya dilarikan ke ruang gawat darurat dan dokter harus mengangkat jaringan otot dan tulang yang telah mati (nekrotik). Saya kembali ke Inggris dengan menggunakan kruk. Saya menjadi cacat.
                                    </p>
                                    <p>
                                        Saya lalu kembali ke Taiwan. Tn. Yu, seorang siswa Longevitology, merekomendasikan Longevitology kepada saya dan putri saya. Namun, lama-kelamaan saya menjadi malas dan berhenti berlatih. Karma baik rupanya membalikkan nasib saya—Longevitology mengikuti saya hingga ke Inggris. Tn. Yu mendapat pekerjaan di Inggris dan mengundang Pengajar Lin beserta Pengajar Wei untuk mengajar di sana. Pada saat itulah, saya sadar bahwa nyawa saya sedang dalam bahaya. Demi menyelamatkan hidup saya, suami saya yang berkebangsaan Inggris pun ikut serta bersama saya untuk mengikuti kelas tersebut.
                                    </p>
                                    <p>
                                        Longevitology sangatlah bermanfaat. Orang-orang yang telah mempelajari Longevitology pasti akan setuju dengan saya. Setelah menyelesaikan kelas, kami membentuk kelompok peserta untuk rutin berlatih dan bertukar pengalaman dua kali seminggu. Berkat latihan yang tekun, ginjal saya yang rusak kini telah pulih. Warna luka di kaki saya secara bertahap kembali normal. Jaringan otot baru mulai tumbuh. Saraf-saraf saya pulih dan kaki saya kembali bisa merasakan sensasi. Dan yang paling membahagiakan, rambut saya tumbuh kembali.
                                    </p>
                                    <p>
                                        Pengajar Lin dan Pengajar Wei kembali datang ke Inggris pada bulan Mei 2006 untuk mengadakan kelas lanjutan. Pada saat itu, hasil tes darah saya menunjukkan bahwa radang sendi saya telah sembuh. Hasil sinar-X juga memperlihatkan bahwa kelainan bentuk (deformitas) pada tulang saya telah berhenti. Daripada mengharuskan saya untuk melakukan kontrol rutin setiap dua hingga tiga bulan, dokter saya justru menyarankan agar saya datang menemuinya hanya jika saya merasakan sakit yang tak tertahankan.
                                    </p>
                                    <p>
                                        Niat awal suami saya belajar Longevitology adalah untuk menyelamatkan saya. Namun, setelah mempraktikkan Longevitology, alergi serbuk sarinya juga membaik secara drastis. Ia telah menderita reaksi alergi sejak usia enam tahun dan sering kali membutuhkan obat untuk mengendalikannya. Bahkan akupunktur tidak membuahkan hasil baginya. Mengejutkannya, Longevitology berhasil mengatasinya. Ia bahkan tidak bersin sekalipun saat serbuk sari bertebaran di Inggris pada bulan Mei tahun ini.
                                    </p>
                                    <p>
                                        Ia sangat bersyukur. Sebagai bentuk rasa terima kasihnya, ia meminta saya untuk mengundang Pengajar Lin dan Pengajar Wei untuk minum teh dan berbincang-bincang setelah kelas selesai. Kami ingin menggunakan Longevitology untuk membantu orang lain, sebagai balasan atas apa yang telah diberikan oleh para pengajar kepada kami.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-20 border-gray-200 dark:border-gray-800" />
                    </section>

                    {/* Russ Gothrick */}
                    <section id="empower" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-8 items-start py-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Memberdayakan Diri Sendiri</h2>
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6">- Russ Gothrick - USA</h3>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                                    <p>
                                        Saya diperkenalkan dengan Longetivology pada tahun 2001. Pada tahun 2004, saya menyelesaikan kelas tingkat lanjut. Sejak saat itu, saya telah melakukan ribuan sesi penyesuaian (*adjustment*) terhadap ratusan orang. Hasilnya sungguh luar biasa. Begitu banyak orang telah merasakan manfaat dari penyesuaian ini. Beberapa orang yang telah menderita selama bertahun-tahun kondisinya membaik sepenuhnya setelah menjalani beberapa kali penyesuaian. Masalah radang sendi dan nyeri punggung kronis berhasil diatasi; bahkan ada yang sembuh hanya setelah 2 atau 3 kali penyesuaian. Saya juga sempat melakukan penyesuaian di Los Angeles pada bulan Mei 2010. Saya sangat menantikan kesempatan untuk melakukannya lagi saat kelas dimulai kembali. Terima kasih banyak telah mengajarkan kemampuan yang luar biasa ini. Saya tidak pernah jatuh sakit selama 9 tahun terakhir!!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-20 border-gray-200 dark:border-gray-800" />
                    </section>

                    {/* Tien Fa Tzai */}
                    <section id="stroke" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-8 items-start py-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-red-500/10 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pemulihan Pasca Stroke</h2>
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6">- Tien Fa Tzai - China</h3>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                                    <p>
                                        Akibat perubahan situasi global, banyak pengusaha Taiwan berinvestasi di Tiongkok. Saya pun mengikuti tren tersebut dan menanamkan modal di sana. Lingkungan baru ini memberikan tekanan yang luar biasa bagi saya, karena saya harus mempelajari berbagai peraturan hukum, gaya manajemen bisnis, dan sebagainya.
                                    </p>
                                    <p>
                                        Sehari sebelum jadwal kepulangan saya ke Taiwan untuk mengikuti kelas lanjutan Longevitology, seorang teman datang berkunjung sekitar pukul 16.00. Teman dan keluarga saya menyadari bahwa wajah dan mulut saya tampak miring. Saya juga tidak bisa menggerakkan tangan atau kaki kiri saya. Ya Tuhan, ternyata saya terkena stroke. (Ibu saya pernah mengalami stroke yang melumpuhkan sisi kanan tubuhnya seumur hidup). Rekan saya melakukan terapi penyesuaian energi pada saya sepanjang malam. Keesokan paginya, saya sudah bisa bergerak dengan leluasa. Setelah kembali ke Taiwan, saya pergi ke rumah sakit untuk pemeriksaan. Awalnya, dokter tidak menemukan adanya kelainan pada diri saya. Rekan saya kemudian meminta dokter untuk melakukan pemindaian MRI, dan ditemukan adanya gumpalan darah sebesar 20 cc di batang otak yang tidak dapat dioperasi. Anehnya, saya sama sekali tidak merasakan keluhan apa pun. Saya menjalani masa observasi di rumah sakit selama satu minggu. Selama masa itu, Guru Wei, Guru Lin, dan para sukarelawan lainnya datang ke rumah sakit untuk memberikan terapi penyesuaian energi. Saya pun diperbolehkan pulang setelah satu minggu.
                                    </p>
                                    <p>
                                        Peristiwa ini menjadi bukti nyata sebuah keajaiban bagi semua orang yang menyaksikannya. Longevitology terbukti mampu mengubah hidup seseorang dalam situasi darurat.                                        
                                    </p>
                                    <p>
                                        Saya ingin mengucapkan terima kasih kepada Guru Lin dan Guru Wei atas welas asih mereka.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* CTA / Back to Home */}
                <section className="py-16 px-6 bg-[#ad2c90] text-white text-center mt-12">
                    <h3 className="text-2xl font-bold mb-6">Penasaran Ingin Merasakan Sendiri Manfaatnya?</h3>
                    <Link
                        href="/#classes"
                        className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#ad2c90] hover:bg-gray-100 font-bold rounded-full shadow-lg transition-all transform hover:scale-105"
                    >
                        Lihat Jadwal Kelas
                    </Link>
                </section>
            </main>
        </div>
    );
}
