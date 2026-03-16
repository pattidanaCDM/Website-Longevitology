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
        if (!json) return <span className="text-gray-400">-</span>;
        try {
            const parsed = typeof json === "string" ? JSON.parse(json) : json;
            return (
                <div className="max-h-32 overflow-y-auto text-xs whitespace-pre-wrap bg-gray-50 p-2 rounded border">
                    {JSON.stringify(parsed, null, 2)}
                </div>
            );
        } catch (e) {
            return <span className="text-gray-400">{String(json)}</span>;
        }
    };

    const formatModelName = (model: string) => {
        return model.replace("App\\Models\\", "");
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Audit Logs
                </h2>
            }
        >
            <Head title="Audit Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Filters & Search */}
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && applyFilters()
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        User
                                    </label>
                                    <select
                                        value={selectedUser}
                                        onChange={(e) =>
                                            setSelectedUser(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Users</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Event
                                    </label>
                                    <select
                                        value={selectedEvent}
                                        onChange={(e) =>
                                            setSelectedEvent(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Events</option>
                                        {events.map((e) => (
                                            <option key={e} value={e}>
                                                {e}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Type
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) =>
                                            setSelectedType(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Types</option>
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
                                        Filter
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Changes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            IP
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No audit logs found.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.data.map((log) => (
                                            <tr key={log.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(
                                                        log.created_at,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {log.user ? (
                                                        log.user.name
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            System
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${
                                                            log.event ===
                                                            "created"
                                                                ? "bg-green-100 text-green-800"
                                                                : log.event ===
                                                                    "updated"
                                                                  ? "bg-blue-100 text-blue-800"
                                                                  : log.event ===
                                                                      "deleted"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {log.event}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {log.description ||
                                                        `${formatModelName(log.auditable_type)} #${log.auditable_id}`}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                                    <p className="text-sm text-gray-700">
                                        Showing{" "}
                                        <span className="font-medium">
                                            {(logs.current_page - 1) * 50 + 1}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {Math.min(
                                                logs.current_page * 50,
                                                logs.total,
                                            )}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {logs.total}
                                        </span>{" "}
                                        results
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
                                                    ${link.active ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}
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
