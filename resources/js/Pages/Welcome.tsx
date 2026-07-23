import { Link, router, Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import ImageSlideshow from "@/Components/ImageSlideshow";
import { Button } from "@/Components/ui/button";
import { MapPin, Calendar, Clock, Phone, ExternalLink, ChevronDown, Target, Lightbulb, History, AlertCircle, Megaphone } from "lucide-react";
import { useState, useCallback } from "react";
import { LogIn } from "lucide-react";

import ApplicationLogo from "@/Components/ApplicationLogo";
import DarkModeToggle from "@/Components/DarkModeToggle";
import Modal from "@/Components/Modal";
import { Branch } from "@/types";

export default function Welcome({ branches, filters, allBranches, slideshowImages = [], faqs = [], faqCategories = [], testimonials = [], therapyClasses = [] }: any) {
    const [values, setValues] = useState({
        branch_id: filters.branch_id || "",
        day: filters.day || "",
    });

    const [selectedDetailBranch, setSelectedDetailBranch] = useState<Branch | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [activeFaqCategory, setActiveFaqCategory] = useState<number | null>(faqCategories?.length > 0 ? faqCategories[0].id : null);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const filteredFaqs = activeFaqCategory === null
        ? []
        : faqs.filter((faq: any) => faq.categories.some((c: any) => c.id === activeFaqCategory));

    const handleChange = useCallback((field: string, value: string) => {
        const newValues = { ...values, [field]: value };
        setValues(newValues);
        router.get('/', newValues, { preserveState: true, preserveScroll: true });
    }, [values]);

    const openDetailModal = (branch: Branch) => {
        setSelectedDetailBranch(branch);
        setShowDetailModal(true);
    };

    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    return (
        <>
            <Head title="Longevitology" />
            <GuestLayout
            fullWidth={true}
            header={
                <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
                    <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                        <Link href="/" className="flex items-center gap-1">
                            <ApplicationLogo className="h-16 w-16" />
                            <p className="font-brand text-xl font-semibold text-[#ad2c90]">
                                Longevitology
                            </p>
                        </Link>
                        <div className="flex items-center gap-8">
                            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                                <a href="#home" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Home</a>
                                <a href="#classes" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Kelas</a>
                                <a href="#branches" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Cabang</a>
                                <a href="#testimonials" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Testimoni</a>
                                <a href="#faq" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">FAQ</a>
                                <a href="#about" className="hover:text-[#ad2c90] dark:hover:text-[#d35fb9] transition-colors">Tentang</a>
                            </nav>
                            <div className="flex items-center gap-4">
                                <DarkModeToggle />
                            </div>
                        </div>
                    </div>
                </header>
            }
        >
            <div className="flex flex-col min-h-screen">
                {/* Hero Section */}
                <section id="home" className="relative flex flex-col items-center justify-center text-center min-h-[80vh] px-6 overflow-hidden">
                    {/* Background Slideshow */}
                    <div className="absolute inset-0 z-0">
                        <ImageSlideshow 
                            images={slideshowImages.length > 0 ? slideshowImages : ['/image/slideshow1.png']}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay: Dark gradient to ensure text remains readable over the images */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-md">
                            Longevitology
                        </h1>
                        <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-10 drop-shadow">
                            Platform kesehatan & longevity berbasis sains. Temukan pusat latihan terdekat dan mulai perjalanan kesehatan Anda.
                        </p>
                        <a href="#classes" className="px-8 py-4 bg-[#ad2c90] hover:bg-[#8b1e70] text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Mulai Perjalanan Anda
                        </a>
                    </div>
                </section>

                {/* Classes Section */}
                <section id="classes" className="py-20 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4 text-[#ad2c90]">Kelas Terapi</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                            Tingkatkan energi dan keseimbangan tubuh Anda melalui kelas Longevitology yang dipandu oleh praktisi berpengalaman.
                        </p>
                        <div className="flex overflow-x-auto pb-8 pt-4 -mx-6 px-6 md:-mx-4 md:px-4 snap-x snap-mandatory gap-6 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                            {therapyClasses.length === 0 ? (
                                <div className="w-full text-center text-gray-500">Belum ada kelas terapi yang tersedia.</div>
                            ) : (
                                therapyClasses.map((therapyClass: any, index: number) => (
                                    <div key={therapyClass.id} className="min-w-[85vw] sm:min-w-[320px] max-w-[350px] shrink-0 snap-center bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
                                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{therapyClass.title}</h3>
                                        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 whitespace-pre-wrap flex-grow">
                                            {therapyClass.content}
                                        </div>
                                        {therapyClass.registration_url && (
                                            <a 
                                                href={therapyClass.registration_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 bg-[#ad2c90] hover:bg-[#8a2373] text-white text-sm font-semibold rounded-lg shadow transition-colors"
                                            >
                                                Daftar Sekarang <ExternalLink className="ml-2 w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Cabang & Jadwal Section */}
                <section id="branches" className="py-16 px-6 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8 text-[#ad2c90]">
                            Cabang & Jadwal Terapi
                        </h2>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
                            <select
                                className="border rounded-md px-4 py-2 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-gray-200"
                                value={values.branch_id}
                                onChange={(e) => handleChange("branch_id", e.target.value)}
                            >
                                <option value="">Semua Cabang</option>
                                {allBranches.map((branch: any) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border rounded-md pl-4 pr-10 py-2 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-gray-200"
                                value={values.day}
                                onChange={(e) => handleChange("day", e.target.value)}
                            >
                                <option value="">Semua Hari</option>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {branches.length > 0 ? (
                                branches.map((branch: any, index: number) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                                    >
                                        {/* Image Section */}
                                        <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                                            {branch.photos && branch.photos.length > 0 ? (
                                                <img
                                                    src={`/storage/${branch.photos[0].photo_path}`}
                                                    alt={branch.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#ad2c90]/10 to-purple-500/10 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                                                    <MapPin className="w-12 h-12 text-[#ad2c90]/30" />
                                                </div>
                                            )}

                                            <div className="absolute top-4 left-4 flex gap-2 flex-col items-start">
                                                <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-[#ad2c90] dark:text-[#d35fb9] text-xs font-bold rounded-full uppercase tracking-wide shadow-sm">
                                                    Cabang
                                                </span>
                                                {branch.schedule_exceptions && branch.schedule_exceptions.length > 0 && (
                                                    <span className="px-3 py-1 bg-red-600/90 dark:bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Pemberitahuan Jadwal
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white line-clamp-1">
                                                {branch.name}
                                            </h3>

                                            <div className="space-y-3 text-gray-600 dark:text-slate-400 flex-grow text-sm">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 mt-0.5 text-[#ad2c90] shrink-0" />
                                                    <span className="line-clamp-2">{branch.address}</span>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Calendar className="w-5 h-5 mt-0.5 text-[#ad2c90] shrink-0" />
                                                    <span className="line-clamp-2 leading-relaxed">{branch.schedule}</span>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-2 relative">
                                                {branch.schedule_exceptions && branch.schedule_exceptions.length > 0 && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                        <span className="flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        </span>
                                                    </div>
                                                )}
                                                <Button
                                                    onClick={() => openDetailModal(branch)}
                                                    className={`w-full rounded-full text-white font-semibold py-6 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${(branch.schedule_exceptions && branch.schedule_exceptions.length > 0) && (branch.active_announcements && branch.active_announcements.length > 0)
                                                            ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700'
                                                            : (branch.schedule_exceptions && branch.schedule_exceptions.length > 0)
                                                                ? 'bg-red-600 hover:bg-red-700'
                                                                : (branch.active_announcements && branch.active_announcements.length > 0)
                                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                                    : 'bg-[#ad2c90] hover:bg-[#8a2373]'
                                                        }`}
                                                >
                                                    Lihat Detail
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-muted-foreground">
                                    Tidak ada jadwal latihan yang ditemukan untuk filter ini.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-12 text-[#ad2c90]">Testimoni</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 item-stretch">
                            {testimonials.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500">Belum ada testimoni.</div>
                            ) : (
                                testimonials.map((testimonial: any) => (
                                    <div key={testimonial.id} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-left flex flex-col h-full">
                                        <p className="text-gray-600 dark:text-gray-300 italic mb-6 text-sm flex-grow">
                                            "{testimonial.excerpt ? testimonial.excerpt : (testimonial.content.length > 100 ? testimonial.content.substring(0, 100) + '...' : testimonial.content)}"
                                        </p>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{testimonial.name}</h4>
                                        {testimonial.location && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-4">{testimonial.location}</span>
                                        )}
                                        <Link
                                            href={`/testimonials#testimonial-${testimonial.id}`}
                                            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition mt-4 text-sm w-fit mt-auto"
                                        >
                                            Baca Selengkapnya
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors duration-300 border-t border-gray-100 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4 text-[#ad2c90]">Frequently Asked Questions</h2>
                            <p className="text-gray-600 dark:text-gray-400">Temukan jawaban untuk pertanyaan yang sering diajukan seputar Longevitology.</p>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {faqCategories.map((category: any) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveFaqCategory(category.id)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeFaqCategory === category.id
                                        ? 'bg-[#ad2c90] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* FAQ Accordion */}
                        <div className="space-y-4">
                            {filteredFaqs.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-8">Belum ada FAQ untuk kategori ini.</p>
                            ) : (
                                filteredFaqs.map((faq: any) => (
                                    <div
                                        key={faq.id}
                                        className="border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 transition-all duration-200"
                                    >
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                        >
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 pr-8">{faq.question}</span>
                                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div
                                            className={`transition-all duration-300 ease-in-out ${expandedFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                                        >
                                            <div className="p-5 pt-0 text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed border-t border-gray-100 dark:border-slate-700/50 mt-2">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-12 text-[#ad2c90]">Tentang Longevitology</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {/* Misi */}
                            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center">
                                <div className="p-4 bg-[#ad2c90]/10 dark:bg-[#ad2c90]/20 rounded-full mb-6">
                                    <Target className="w-8 h-8 text-[#ad2c90] dark:text-[#d35fb9]" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Misi</h3>
                                <blockquote className="italic border-l-4 border-[#ad2c90] pl-4 text-gray-700 dark:text-gray-200 font-medium mb-6 w-full text-center">
                                    "Menyelamatkan nyawa dengan penuh kasih."
                                </blockquote>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                    Melatih para relawan untuk mengulurkan tangan penuh kasih guna membantu sesama yang sedang sakit, menderita, atau dalam kesulitan melalui penyelarasan energi Longevitology.
                                </p>
                            </div>

                            {/* Praktis */}
                            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center transform md:-translate-y-4">
                                <div className="p-4 bg-orange-500/10 dark:bg-orange-500/20 rounded-full mb-6">
                                    <Lightbulb className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Praktis</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                    Saat cakra kita terbuka, tangan kita dapat digunakan untuk menyalurkan energi semesta ke dalam tubuh kita sendiri maupun tubuh orang lain. Dengan memulihkan keseimbangan energi di dalam tubuh, Longevitology meningkatkan kemampuan tubuh untuk menyembuhkan dirinya sendiri.
                                </p>
                            </div>

                            {/* Histori */}
                            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center">
                                <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-full mb-6">
                                    <History className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Histori</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                    Longevitology bukanlah sebuah bisnis dan tidak memiliki afiliasi dengan kelompok keagamaan, medis, politik, maupun kelompok lainnya di dunia. Para pendiri bersamanya, yaitu Guru Lin dan Guru Wei, telah mengajarkan praktik ini di seluruh dunia sejak tahun 1993.
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route('about')}
                            className="inline-flex items-center justify-center px-8 py-3 bg-[#ad2c90] hover:bg-[#8a2373] text-white font-semibold rounded-full shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            Baca Selengkapnya
                        </Link>
                    </div>
                </section>

            </div>

            {/* Detail Branch Modal */}
            <Modal show={showDetailModal} onClose={() => setShowDetailModal(false)} maxWidth="5xl">
                {selectedDetailBranch && (
                    <div className="relative bg-white dark:bg-slate-900 overflow-y-auto max-h-[90vh]">
                        {/* Close Button Floating */}
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full transition-all"
                        >
                            <span className="sr-only">Tutup</span>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Hero Image Header */}
                        <div className="relative h-64 sm:h-80 w-full bg-gray-200 dark:bg-slate-800">
                            {selectedDetailBranch.photos && selectedDetailBranch.photos.length > 0 ? (
                                <img
                                    src={`/storage/${selectedDetailBranch.photos[0].photo_path}`}
                                    alt={selectedDetailBranch.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#ad2c90]/20 to-purple-500/20 flex items-center justify-center">
                                    <MapPin className="w-16 h-16 text-[#ad2c90]/40" />
                                </div>
                            )}
                            {/* Gradient Overlay for Title */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            {/* Title */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                <span className="px-3 py-1 bg-[#ad2c90] text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-sm mb-3 inline-block">
                                    Detail Cabang
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-bold text-white shadow-sm drop-shadow-md">
                                    {selectedDetailBranch.name}
                                </h2>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 sm:p-8 space-y-8">
                            {/* Announcements Full Row */}
                            {selectedDetailBranch.active_announcements && selectedDetailBranch.active_announcements.length > 0 && (
                                <div className="space-y-4">
                                    {selectedDetailBranch.active_announcements.map((announcement: any) => (
                                        <div key={announcement.id} className="p-4 rounded-xl border bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50 shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg shrink-0 mt-0.5">
                                                    <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
                                                        {announcement.title}
                                                        <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-[10px] rounded-full uppercase font-bold tracking-wider">
                                                            Pengumuman
                                                        </span>
                                                    </h4>
                                                    <p className="text-sm mt-2 text-blue-800 dark:text-blue-200 whitespace-pre-wrap leading-relaxed">
                                                        {announcement.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={`grid grid-cols-1 ${(selectedDetailBranch.embed_map_url || selectedDetailBranch.map_url) ? 'lg:grid-cols-2' : ''} gap-8`}>
                                <div className="space-y-8">
                                    {/* Address */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-3">
                                            <div className="p-2.5 bg-[#ad2c90]/10 dark:bg-[#ad2c90]/20 rounded-xl">
                                                <MapPin className="w-5 h-5 text-[#ad2c90] dark:text-[#d35fb9]" />
                                            </div>
                                            Lokasi
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-[3.25rem]">
                                            {selectedDetailBranch.address}
                                        </p>
                                    </div>

                                    {/* Schedule */}
                                    {selectedDetailBranch.schedule && (
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-3">
                                                    <div className="p-2.5 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl">
                                                        <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    Jadwal Praktik
                                                </h3>
                                                <div className="text-gray-600 dark:text-gray-300 leading-relaxed ml-[3.25rem] space-y-1">
                                                    {selectedDetailBranch.schedule.split(', ').map((sch, idx) => (
                                                        <div key={idx}>{sch}</div>
                                                    ))}
                                                </div>
                                            </div>

                                            {selectedDetailBranch.schedule_exceptions && selectedDetailBranch.schedule_exceptions.length > 0 && (
                                                <div className="ml-[3.25rem] mt-4 space-y-3">
                                                    {selectedDetailBranch.schedule_exceptions.map((exception: any) => (
                                                        <div key={exception.id} className={`p-4 rounded-xl border ${exception.type === 'libur' ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30'}`}>
                                                            <div className="flex items-start gap-3">
                                                                <AlertCircle className={`w-5 h-5 mt-0.5 ${exception.type === 'libur' ? 'text-red-500' : 'text-blue-500'}`} />
                                                                <div>
                                                                    <h4 className={`font-bold text-sm ${exception.type === 'libur' ? 'text-red-800 dark:text-red-400' : 'text-blue-800 dark:text-blue-400'}`}>
                                                                        {exception.type === 'libur' ? 'Libur Sementara' : 'Pemindahan Jadwal'}
                                                                    </h4>
                                                                    <p className={`text-sm mt-1 ${exception.type === 'libur' ? 'text-red-600 dark:text-red-300' : 'text-blue-600 dark:text-blue-300'}`}>
                                                                        Tanggal Asli: {new Date(exception.original_date).toLocaleDateString('id-ID')}
                                                                    </p>
                                                                    {exception.rescheduled_date && (
                                                                        <p className={`text-sm ${exception.type === 'libur' ? 'text-red-600 dark:text-red-300' : 'text-blue-600 dark:text-blue-300'}`}>
                                                                            Tanggal Pengganti: {new Date(exception.rescheduled_date).toLocaleDateString('id-ID')}
                                                                        </p>
                                                                    )}
                                                                    <p className={`text-sm mt-2 font-medium ${exception.type === 'libur' ? 'text-red-700 dark:text-red-200' : 'text-blue-700 dark:text-blue-200'}`}>
                                                                        "{exception.description}"
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Contacts */}
                                    {selectedDetailBranch.contacts && selectedDetailBranch.contacts.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
                                                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                Kontak
                                            </h3>
                                            <div className="space-y-3 ml-[3.25rem]">
                                                {selectedDetailBranch.contacts.map(contact => (
                                                    <div key={contact.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                                                        <div>
                                                            <span className="font-semibold text-gray-900 dark:text-gray-200 block">{contact.name}</span>
                                                            <span className="text-gray-600 dark:text-gray-400 text-sm mt-0.5 block">{contact.phone}</span>
                                                        </div>
                                                        {contact.phone && (
                                                            <a href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 rounded-full text-sm font-bold transition-colors">
                                                                WhatsApp <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Map */}
                                {(selectedDetailBranch.embed_map_url || selectedDetailBranch.map_url) && (
                                    <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-slate-800 h-[300px] sm:h-[400px] lg:h-full lg:min-h-[400px] w-full relative group">
                                        {selectedDetailBranch.embed_map_url ? (
                                            <>
                                                <iframe
                                                    src={
                                                        selectedDetailBranch.embed_map_url.includes('<iframe')
                                                            ? (selectedDetailBranch.embed_map_url.match(/src="([^"]+)"/) || [])[1] || selectedDetailBranch.embed_map_url
                                                            : selectedDetailBranch.embed_map_url
                                                    }
                                                    className="w-full h-full border-0 absolute inset-0 block"
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                ></iframe>

                                                {/* Floating button to open the exact link provided if map_url is also provided */}
                                                {selectedDetailBranch.map_url && (
                                                    <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <a
                                                            href={selectedDetailBranch.map_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-[#ad2c90] dark:text-[#d35fb9] rounded-full shadow-lg hover:scale-105 transition-all font-semibold text-xs border border-gray-200 dark:border-gray-700"
                                                        >
                                                            Buka di App <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
                                                        </a>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 p-6 text-center flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800">
                                                <div className="p-4 bg-[#ad2c90]/10 rounded-full mb-4">
                                                    <MapPin className="w-10 h-10 text-[#ad2c90]" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Lihat Lokasi di Peta</h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm font-medium max-w-[250px]">
                                                    Untuk melihat rute dan lokasi persisnya, silakan buka aplikasi Google Maps.
                                                </p>
                                                <a
                                                    href={selectedDetailBranch.map_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-6 py-3 bg-[#ad2c90] text-white rounded-full hover:bg-[#8a2373] shadow-lg transition-all font-semibold text-sm hover:scale-105"
                                                >
                                                    Buka Google Maps <ExternalLink className="ml-2 w-4 h-4" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Gallery */}
                            {selectedDetailBranch.photos && selectedDetailBranch.photos.length > 1 && (
                                <div className="pt-8 mt-4 border-t border-gray-100 dark:border-gray-800/50">
                                    <h3 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">
                                        Galeri Cabang
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                                        {selectedDetailBranch.photos.map((photo, idx) => (
                                            <div key={photo.id} className="rounded-2xl overflow-hidden shadow-sm aspect-square relative group">
                                                <img
                                                    src={`/storage/${photo.photo_path}`}
                                                    alt={`Galeri ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Footer */}
                        <div className="p-6 sm:p-8 pt-0 flex justify-end">
                        </div>
                    </div>
                )}
            </Modal>
        </GuestLayout>
        </>
    );
}
