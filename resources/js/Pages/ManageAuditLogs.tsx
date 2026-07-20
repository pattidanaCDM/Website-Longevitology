import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react"; // Import router
import { User } from "@/types";
import { useState, useEffect } from "react"; // Import React hooks

interface AuditLog {
    id: number;
    user: User;
    event: string;
    description: string; // Add description
    auditable_type: string;
    auditable_id: number;
    old_values: string;
    new_values: string;
    url: string;
    ip_address: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ManageAuditLogsProps {
    logs: {
        data: AuditLog[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        user_id?: string;
        event?: string;
        auditable_type?: string;
    };
    users: { id: number; name: string }[];
    events: string[];
    types: string[];
}

export default function ManageAuditLogs({
    logs,
    filters,
    users,
    events,
    types,
}: ManageAuditLogsProps) {
    // State for filters
    const [search, setSearch] = useState(filters.search || "");
    const [selectedUser, setSelectedUser] = useState(filters.user_id || "");
    const [selectedEvent, setSelectedEvent] = useState(filters.event || "");
    const [selectedType, setSelectedType] = useState(
        filters.auditable_type || "",
    );

    // Debounce search (optional but good practice, keeping it simple for now)
    const handleSearch = () => {
        router.get(
            route("audit-logs.index"),
            {
                search: search,
                user_id: selectedUser,
                event: selectedEvent,
                auditable_type: selectedType,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Trigger search on filter change or enter key
    useEffect(() => {
        // Only trigger on explicit action or timeout if needed
        // For dropdowns, trigger immediately can be nice
    }, [selectedUser, selectedEvent, selectedType]);

    const applyFilters = () => {
        router.get(
            route("audit-logs.index"),
            {
                search: search,
                user_id: selectedUser,
                event: selectedEvent,
                auditable_type: selectedType,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedUser("");
        setSelectedEvent("");
        setSelectedType("");
        router.get(route("audit-logs.index"));
    };

    // Helper to decode JSON values
    const formatValues = (json: string | null) => {
        if (!json) return <span className="text-gray-400 dark:text-gray-500">-</span>;
        try {
            const parsed = typeof json === "string" ? JSON.parse(json) : json;
            return (
                <div className="max-h-32 overflow-y-auto text-xs whitespace-pre-wrap bg-gray-50 dark:bg-slate-800 p-2 rounded border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200">
                    {JSON.stringify(parsed, null, 2)}
                </div>
            );
        } catch (e) {
            return <span className="text-gray-400 dark:text-gray-500">{String(json)}</span>;
        }
    };

    const formatModelName = (model: string) => {
        return model.replace("App\\Models\\", "");
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Log Audit
                </h2>
            }
        >
            <Head title="Log Audit" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Filters & Search */}
                        <div className="p-6 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Cari
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Cari log..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && applyFilters()
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Pengguna
                                    </label>
                                    <select
                                        value={selectedUser}
                                        onChange={(e) =>
                                            setSelectedUser(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Semua Pengguna</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Aksi
                                    </label>
                                    <select
                                        value={selectedEvent}
                                        onChange={(e) =>
                                            setSelectedEvent(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Semua Aksi</option>
                                        {events.map((e) => (
                                            <option key={e} value={e}>
                                                {e}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Tipe
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) =>
                                            setSelectedType(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Semua Tipe</option>
                                        {types.map((t) => (
                                            <option key={t} value={t}>
                                                {t.split("\\").pop()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={applyFilters}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Saring
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-slate-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Bersihkan
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 text-gray-900 dark:text-gray-100 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Waktu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Pengguna
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Perubahan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            IP
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {logs.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                Tidak ada log audit ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.data.map((log) => (
                                            <tr key={log.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(
                                                        log.created_at,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                                                    {log.user ? (
                                                        log.user.name
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-500">
                                                            System
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${log.event ===
                                                                "created"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                                                                : log.event ===
                                                                    "updated"
                                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
                                                                    : log.event ===
                                                                        "deleted"
                                                                        ? "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400"
                                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                                            }`}
                                                    >
                                                        {log.event}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {log.description ||
                                                        `${formatModelName(log.auditable_type)} #${log.auditable_id}`}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs overflow-hidden">
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {log.event ===
                                                            "updated" && (
                                                                <>
                                                                    <div>
                                                                        <span className="text-xs font-bold text-red-500 block">
                                                                            Old:
                                                                        </span>
                                                                        {formatValues(
                                                                            log.old_values,
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs font-bold text-green-500 block">
                                                                            New:
                                                                        </span>
                                                                        {formatValues(
                                                                            log.new_values,
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        {log.event ===
                                                            "created" && (
                                                                <div>
                                                                    <span className="text-xs font-bold text-green-500 block">
                                                                        New:
                                                                    </span>
                                                                    {formatValues(
                                                                        log.new_values,
                                                                    )}
                                                                </div>
                                                            )}
                                                        {(log.event ===
                                                            "deleted" ||
                                                            log.event ===
                                                            "restored") && (
                                                                <div>
                                                                    <span className="text-xs font-bold text-gray-500 block">
                                                                        Details:
                                                                    </span>
                                                                    {formatValues(
                                                                        log.old_values ||
                                                                        log.new_values,
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {log.ip_address}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="mt-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        Menampilkan{" "}
                                        <span className="font-medium">
                                            {(logs.current_page - 1) * 50 + 1}
                                        </span>{" "}
                                        hingga{" "}
                                        <span className="font-medium">
                                            {Math.min(
                                                logs.current_page * 50,
                                                logs.total,
                                            )}
                                        </span>{" "}
                                        dari{" "}
                                        <span className="font-medium">
                                            {logs.total}
                                        </span>{" "}
                                        hasil
                                    </p>
                                </div>
                                <div>
                                    <nav
                                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                        aria-label="Pagination"
                                    >
                                        {logs.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url || "#"}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                    ${link.active ? "z-10 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600 dark:text-indigo-400" : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"}
                                                    ${!link.url ? "cursor-not-allowed opacity-50" : ""}
                                                    ${i === 0 ? "rounded-l-md" : ""}
                                                    ${i === logs.links.length - 1 ? "rounded-r-md" : ""}
                                                `}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
