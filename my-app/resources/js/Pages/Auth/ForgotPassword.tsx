import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
            <Head title="Forgot Password" />

            {/* CSS-based Background Replacements for better control */}
            <div className="absolute top-0 right-0 bottom-0 w-full md:w-[50%] bg-gradient-to-br from-[#ad2c90] to-[#5400d4] z-0 
                rounded-tl-[100px] rounded-bl-[50px] md:rounded-tl-[300px] md:rounded-bl-[200px] translate-x-20 md:translate-x-0 transition-all duration-500">
            </div>
            {/* Additional decorative blobs */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mb-20"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row shadow-2xl bg-white/80 md:bg-white/0 rounded-3xl overflow-hidden min-h-[600px] backdrop-blur-sm md:backdrop-blur-none m-4">

                {/* LEFT SIDE: FORM */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/90 dark:bg-slate-900/90 md:bg-transparent dark:md:bg-transparent transition-colors">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8 text-center md:text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <Link
                                    href={route('login')}
                                    className="flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 group"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#ad2c90] transition-colors" />
                                </Link>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                            </div>
                            <p className="text-gray-500 dark:text-slate-400">Enter your email and we'll notify the admin to reset your password.</p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-green-600 dark:text-green-400 text-sm font-medium">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <div className="p-1.5 bg-[#ad2c90] rounded-lg shadow-sm">
                                        <Mail className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="block w-full pl-14 pr-4 py-4 bg-white dark:bg-slate-900 border-0 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-none dark:border dark:border-slate-700 focus:ring-2 focus:ring-[#ad2c90] text-gray-700 dark:text-white placeholder-gray-400 text-sm transition-all"
                                    placeholder="E-mail"
                                    autoComplete="username"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2 text-center md:text-left" />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <Button
                                    className="w-full py-6 rounded-full bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:from-[#7a2ce0] hover:to-[#ad2c90] text-white shadow-lg shadow-purple-500/30 text-base font-bold tracking-wide uppercase transition-all hover:shadow-purple-500/50 hover:-translate-y-0.5"
                                    disabled={processing}
                                >
                                    SEND REQUEST
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE: TEXT CONTENT */}
                <div className="hidden md:flex w-1/2 p-12 flex-col justify-center items-center text-center text-white relative z-10">
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold mb-6">Password Help</h2>
                        <p className="text-lg text-white/80 leading-relaxed">
                            Jangan khawatir jika Anda lupa password. Admin kami akan membantu Anda mereset password agar Anda dapat kembali menggunakan layanan Longevitology.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
