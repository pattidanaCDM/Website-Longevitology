import { Link, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Button } from "@/Components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useState, useCallback } from "react";
import { LogIn } from "lucide-react";

import ApplicationLogo from "@/Components/ApplicationLogo";
import DarkModeToggle from "@/Components/DarkModeToggle";

export default function Welcome({ branches, filters, allBranches, slideshowImages = [] }: any) {
    const [values, setValues] = useState({
        branch_id: filters.branch_id || "",
        day: filters.day || "",
    });

    const handleChange = useCallback((field: string, value: string) => {
        const newValues = { ...values, [field]: value };
        setValues(newValues);
        router.get('/', newValues, { preserveState: true, preserveScroll: true });
    }, [values]);

    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    return (
        <GuestLayout
            fullWidth={true}
            slideshowImages={slideshowImages}
            header={
                <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
                    <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                        <Link href="/" className="flex items-center gap-1">
                            <ApplicationLogo className="h-16 w-16" />
                            <p className="font-brand text-xl font-semibold text-[#ad2c90]">
                                Longevitology
                            </p>
                        </Link>
                        <div className="flex items-center gap-4">
                            <DarkModeToggle />
                            <Link href="/login">
                                <Button
                                    className="
                                    bg-[#ad2c90]
                                    hover:bg-[#9c2782]
                                    text-white
                                    rounded-lg
                                    px-6
                                    font-medium
                                    flex items-center gap-2
                                    transition-all
                                    duration-200
                                    ease-out
                                    hover:-translate-y-0.5
                                    hover:shadow-lg
                                "
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>
            }
        >
            <div className="flex flex-col min-h-screen">
                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-[#ad2c90]">
                        Longevitology
                    </h1>

                    <p className="text-muted-foreground text-lg max-w-2xl mb-8">
                        Platform kesehatan & longevity berbasis sains. Temukan pusat latihan terdekat dan mulai perjalanan kesehatan Anda.
                    </p>
                </section>

                {/* Cabang & Jadwal Section */}
                <section className="py-16 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">
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
                                        className="bg-card dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                                    >
                                        <h3 className="text-xl font-semibold mb-4 text-card-foreground dark:text-white">
                                            {branch.name}
                                        </h3>

                                        <div className="space-y-3 text-muted-foreground dark:text-slate-400">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                                                <span className="text-sm">{branch.address}</span>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                                                <span className="text-sm">{branch.schedule}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t dark:border-slate-800">
                                            {branch.map_url ? (
                                                <a
                                                    href={branch.map_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                                                        w-full
                                                        text-primary
                                                        flex items-center justify-center
                                                        transition-all
                                                        duration-200
                                                        ease-out
                                                        hover:-translate-y-0.5
                                                        hover:shadow-lg
                                                        py-2 px-4 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800
                                                        font-medium text-sm
                                                    "
                                                >
                                                    Lihat Peta
                                                    <MapPin className="ml-2 w-4 h-4" />
                                                </a>
                                            ) : (
                                                <Button
                                                    disabled
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full text-slate-400 cursor-not-allowed"
                                                >
                                                    Peta Tidak Tersedia
                                                    <MapPin className="ml-2 w-4 h-4" />
                                                </Button>
                                            )}
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
            </div>
        </GuestLayout>
    );
}
