import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";
import {
    Bell,
    User,
    Users,
    Map,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    Clock,
    HelpCircle,
    CalendarOff,
    Megaphone,
} from "lucide-react";
import DarkModeToggle from "@/Components/DarkModeToggle";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);

    // Check if user is superadmin
    const isSuperadmin = user.role?.name === "superadmin";

    const fetchNotifications = () => {
        fetch(route("notifications.index"))
            .then((res) => res.json())
            .then((data) => {
                setNotifications(data.notifications);
                setNotificationCount(data.unread_count);
            })
            .catch(() => {});
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = (id: string) => {
        fetch(route("notifications.read", id), {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                ).content,
            },
        }).then(() => fetchNotifications());
    };

    const markAllAsRead = () => {
        fetch(route("notifications.read-all"), {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                ).content,
            },
        }).then(() => fetchNotifications());
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header - Icon Only */}
            <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Toggle Sidebar + Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#ad2c90] dark:hover:text-[#ad2c90] transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <Link
                                href={route("dashboard")}
                                className="flex items-center"
                            >
                                <span className="text-2xl font-bold bg-gradient-to-r from-[#ad2c90] to-[#5400d4] bg-clip-text text-transparent">
                                    Longevitology
                                </span>
                            </Link>
                        </div>

                        {/* Right: Icon-only buttons */}
                        <div className="flex items-center gap-2">
                            {/* Dark Mode Toggle */}
                            <DarkModeToggle />

                            {/* Notifications - Icon Only */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowNotifications(!showNotifications)
                                    }
                                    className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-[#ad2c90] dark:hover:text-[#ad2c90] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                    {notificationCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                            {notificationCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                Notifications
                                            </h3>
                                            {notificationCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-[#ad2c90] hover:underline"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                    No new notifications
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!n.read_at ? "bg-purple-50/30 dark:bg-purple-900/10" : ""}`}
                                                        onClick={() =>
                                                            markAsRead(n.id)
                                                        }
                                                    >
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {n.data.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {n.data.message}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            {new Date(
                                                                n.created_at,
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Manage Users - Superadmin Only */}
                            {isSuperadmin && (
                                <Link
                                    href={route("users.index")}
                                    className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#ad2c90] dark:hover:text-[#ad2c90] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                                    title="Manage Users"
                                >
                                    <Users className="w-5 h-5" />
                                </Link>
                            )}

                            {/* User Menu - Icon Only */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className="p-2 bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white rounded-full hover:shadow-lg transition-all"
                                    title={user.name}
                                >
                                    <User className="w-5 h-5" />
                                </button>

                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user.role?.name || "User"}
                                            </p>
                                        </div>
                                        <Link
                                            href={route("profile.edit")}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
                    sidebarOpen ? "w-64" : "w-0"
                } overflow-hidden`}
            >
                <div className="p-4 space-y-2">
                    {/* Dashboard */}
                    <Link
                        href={route("dashboard")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            route().current("dashboard")
                                ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dasbor</span>
                    </Link>

                    {/* Manage Schedules */}
                    {isSuperadmin && (
                        <Link
                            href={route("schedules.index")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                route().current("schedules.*")
                                    ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                            }`}
                        >
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">Kelola Jadwal</span>
                        </Link>
                    )}

                    {/* Manage Schedule Exceptions */}
                    <Link
                        href={route("schedule-exceptions.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            route().current("schedule-exceptions.*")
                                ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <CalendarOff className="w-5 h-5" />
                        <span className="font-medium">Pengecualian Jadwal</span>
                    </Link>

                    {/* Manage Announcements */}
                    <Link
                        href={route("announcements.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            route().current("announcements.*")
                                ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Megaphone className="w-5 h-5" />
                        <span className="font-medium">Pengumuman</span>
                    </Link>

                    {/* Manage Patients */}
                    <Link
                        href={route("patients.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            route().current("patients.*")
                                ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Kelola Pasien</span>
                    </Link>

                    {/* Manage Therapists */}
                    <Link
                        href={route("therapists.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            route().current("therapists.*")
                                ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Kelola Terapis</span>
                    </Link>

                    {/* Attendance */}
                    <div className="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ml-4">
                        Kehadiran
                    </div>

                    <Link
                        href={route("attendance.patients.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            route().current("attendance.patients.*")
                                ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <rect
                                width="8"
                                height="4"
                                x="8"
                                y="2"
                                rx="1"
                                ry="1"
                            />
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <path d="m9 14 2 2 4-4" />
                        </svg>
                        <span className="font-medium">Pendaftaran Pasien</span>
                    </Link>

                    <Link
                        href={route("attendance.therapists.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            route().current("attendance.therapists.*")
                                ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <polyline points="17 11 19 13 23 9" />
                        </svg>
                        <span className="font-medium">Pendaftaran Terapis</span>
                    </Link>

                    <Link
                        href={route("attendance.archives.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            route().current("attendance.archives.*")
                                ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <rect width="20" height="18" x="2" y="3" rx="2" />
                            <path d="M12 11v6" />
                            <path d="M9 14h6" />
                            <path d="M2 7h20" />
                        </svg>
                        <span className="font-medium">Arsip Kehadiran</span>
                    </Link>

                    {isSuperadmin && (
                        <>
                            <div className="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ml-4">
                                Administration
                            </div>

                            <Link
                                href={route("users.index")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    route().current("users.*")
                                        ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                                }`}
                            >
                                <Users className="w-5 h-5" />
                                <span className="font-medium">
                                    Kelola Pengguna
                                </span>
                            </Link>

                            <Link
                                href={route("branches.index")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    route().current("branches.*")
                                        ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                                }`}
                            >
                                <Map className="w-5 h-5" />
                                <span className="font-medium">
                                    Kelola Cabang
                                </span>
                            </Link>

                            <Link
                                href={route("faqs.index")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    route().current("faqs.*")
                                        ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                                }`}
                            >
                                <HelpCircle className="w-5 h-5" />
                                <span className="font-medium">
                                    Kelola FAQ
                                </span>
                            </Link>

                            <Link
                                href={route("audit-logs.index")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    route().current("audit-logs.*")
                                        ? "bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <path d="M16 13H8"></path>
                                    <path d="M16 17H8"></path>
                                    <path d="M10 9H8"></path>
                                </svg>
                                <span className="font-medium">Log Audit</span>
                            </Link>
                        </>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`pt-16 transition-all duration-300 ${
                    sidebarOpen ? "ml-64" : "ml-0"
                }`}
            >
                {header && (
                    <header className="bg-white dark:bg-slate-900 shadow transition-colors duration-300">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
