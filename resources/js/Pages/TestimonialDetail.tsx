import { Link, Head } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import DarkModeToggle from "@/Components/DarkModeToggle";
import { User, Youtube, ExternalLink } from "lucide-react";

export default function TestimonialDetail({ testimonials = [] }: any) {
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#ad2c90]">Testimoni Peserta</h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                            Kisah nyata dan pengalaman dari mereka yang telah merasakan langsung manfaat energi kosmik Longevitology dalam membantu proses penyembuhan diri.
                        </p>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto py-16 px-6 space-y-20">
                    {testimonials.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            Belum ada testimoni.
                        </div>
                    ) : (
                        testimonials.map((testimonial: any, index: number) => (
                            <section key={testimonial.id} id={`testimonial-${testimonial.id}`} className="scroll-mt-32">
                                <div className="flex flex-col md:flex-row gap-8 items-start py-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-[#ad2c90]/10 dark:bg-[#ad2c90]/20 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-[#ad2c90] dark:text-[#d35fb9]" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{testimonial.name}</h2>
                                        {testimonial.location && (
                                            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6">- {testimonial.location}</h3>
                                        )}
                                        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4 whitespace-pre-wrap">
                                            {testimonial.content}
                                        </div>
                                        {testimonial.link && (
                                            <div className="mt-8">
                                                <a 
                                                    href={testimonial.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ad2c90] text-white hover:bg-[#8b2373] rounded-lg font-medium transition-colors"
                                                >
                                                    {testimonial.link.includes('youtube.com') || testimonial.link.includes('youtu.be') ? (
                                                        <>
                                                            <Youtube className="w-5 h-5" />
                                                            Tonton di YouTube
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ExternalLink className="w-5 h-5" />
                                                            Kunjungi Tautan
                                                        </>
                                                    )}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {index < testimonials.length - 1 && (
                                    <hr className="mt-20 border-gray-200 dark:border-gray-800" />
                                )}
                            </section>
                        ))
                    )}
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
