import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
            <Head title="Log in" />



            {/* Background Organic Shapes */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Main Purple Wave Background */}
                <svg
                    className="absolute top-0 right-0 h-full w-full md:w-[55%] text-[#ad2c90] fill-current transform translate-x-1/4 scale-110"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path d="M0,0 L100,0 L100,100 L0,100 C20,80 50,90 40,50 C30,10 0,20 0,0 Z" />
                    {/* Better wave approximation */}
                    <path d="M50 0 L100 0 L100 100 L20 100 C60 80 80 50 30 0 Z" fill="#ad2c90" />
                </svg>
                {/* This is a visual approximation. For pixel perfect we'd need the exact SVG path or image. 
                     Using a gradient background with a mask or a simple div with border-radius is often easier/cleaner 
                     for this specific "blob" look if we don't have the SVG asset.
                     Let's try a CSS based approach for the big purple blob to be more robust.
                 */}
            </div>

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
                                    href="/"
                                    className="flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 group"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#ad2c90] transition-colors" />
                                </Link>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Hello!</h2>
                            </div>
                            <p className="text-gray-500 dark:text-slate-400">Sign in to your account</p>
                        </div>

                        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

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
                                />
                                <InputError message={errors.email} className="mt-2 text-center md:text-left" />
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <div className="p-1.5 bg-[#ad2c90] rounded-lg shadow-sm">
                                        <Lock className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full pl-14 pr-4 py-4 bg-white dark:bg-slate-900 border-0 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-none dark:border dark:border-slate-700 focus:ring-2 focus:ring-[#ad2c90] text-gray-700 dark:text-white placeholder-gray-400 text-sm transition-all"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#ad2c90] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                <InputError message={errors.password} className="mt-2 text-center md:text-left" />
                            </div>

                            {/* Remember & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="text-[#ad2c90] focus:ring-[#ad2c90] rounded border-gray-300"
                                    />
                                    <span className="text-gray-400 group-hover:text-gray-600 transition-colors">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-purple-400 hover:text-[#ad2c90] transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <Button
                                    className="w-full py-6 rounded-full bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:from-[#7a2ce0] hover:to-[#ad2c90] text-white shadow-lg shadow-purple-500/30 text-base font-bold tracking-wide uppercase transition-all hover:shadow-purple-500/50 hover:-translate-y-0.5"
                                    disabled={processing}
                                >
                                    SIGN IN
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE: TEXT CONTENT */}
                <div className="hidden md:flex w-1/2 p-12 flex-col justify-center items-center text-center text-white relative z-10">
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                        <p className="text-lg text-white/80 leading-relaxed">
                            Masuk untuk mengakses dashboard, jadwal terapi, dan informasi terbaru seputar Longevitology.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
