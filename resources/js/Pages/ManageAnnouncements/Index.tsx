import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { PageProps } from "@/types";

interface Branch {
    id: number;
    name: string;
}

interface Announcement {
    id: number;
    branch_id: number;
    title: string;
    content: string;
    type: "permanent" | "date_range";
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
    branch?: Branch;
}

interface Props extends PageProps {
    announcements: {
        data: Announcement[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    branches: Branch[];
    filters: {
        search?: string;
        branch_id?: string;
    };
}

export default function AnnouncementIndex({ announcements, branches, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const isSuperadmin = auth.user.role?.name === "superadmin";

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const [searchQuery, setSearchQuery] = useState(filters?.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("announcements.index"),
            {
                search: searchQuery,
                branch_id: new URLSearchParams(window.location.search).get("branch_id") || "all",
            },
            { preserveState: true }
        );
    };

    const handleFilterBranch = (branchId: string) => {
        router.get(
            route("announcements.index"),
            {
                search: searchQuery,
                branch_id: branchId,
            },
            { preserveState: true }
        );
    };

    // Form State
    const [data, setData] = useState({
        branch_id: "",
        title: "",
        content: "",
        type: "permanent" as "permanent" | "date_range",
        start_date: "",
        end_date: "",
        is_active: true,
        _method: "post",
    });
    const [errors, setErrors] = useState<any>({});

    const handleDataChange = (field: string, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev: any) => ({ ...prev, [field]: undefined }));
        }
    };

    const openAddModal = () => {
        setData({
            branch_id: branches.length === 1 ? branches[0].id.toString() : "",
            title: "",
            content: "",
            type: "permanent",
            start_date: "",
            end_date: "",
            is_active: true,
            _method: "post",
        });
        setErrors({});
        setShowAddModal(true);
    };

    const openEditModal = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setData({
            branch_id: announcement.branch_id.toString(),
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            start_date: announcement.start_date ? announcement.start_date.split("T")[0] : "",
            end_date: announcement.end_date ? announcement.end_date.split("T")[0] : "",
            is_active: announcement.is_active,
            _method: "put",
        });
        setErrors({});
        setShowEditModal(true);
    };

    const openDeleteModal = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setShowDeleteModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (showEditModal && selectedAnnouncement) {
            router.post(route("announcements.update", selectedAnnouncement.id), data, {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedAnnouncement(null);
                },
                onError: (err) => setErrors(err),
            });
        } else {
            router.post(route("announcements.store"), data, {
                onSuccess: () => setShowAddModal(false),
                onError: (err) => setErrors(err),
            });
        }
    };

    const handleDelete = () => {
        if (!selectedAnnouncement) return;
        router.delete(route("announcements.destroy", selectedAnnouncement.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedAnnouncement(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Pengumuman</h2>}
        >
            <Head title="Pengumuman" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header & Controls */}
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <TextInput
                                        className="w-full md:w-64 dark:bg-slate-900 dark:border-slate-700 dark:text-gray-200"
                                        placeholder="Cari pengumuman..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Button type="submit" variant="secondary" className="dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600">
                                        Cari
                                    </Button>
                                </form>
                                {isSuperadmin && (
                                    <select
                                        className="border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={filters.branch_id || "all"}
                                        onChange={(e) => handleFilterBranch(e.target.value)}
                                    >
                                        <option value="all">Semua Cabang</option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <Button onClick={openAddModal} className="flex items-center gap-2">
                                <Plus size={16} /> Tambah Pengumuman
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cabang</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipe</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {announcements.data.length > 0 ? (
                                        announcements.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{item.title}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.content}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {item.branch?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900 dark:text-gray-200">
                                                        {item.type === "permanent" ? "Selalu Aktif" : "Rentang Tanggal"}
                                                    </span>
                                                    {item.type === "date_range" && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {item.start_date} s/d {item.end_date}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                        {item.is_active ? "Aktif" : "Tidak Aktif"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => openEditModal(item)} className="dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-600">
                                                            <Pencil size={14} />
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => openDeleteModal(item)}>
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                Tidak ada pengumuman.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Component can be added here if needed */}
                    </div>
                </div>
            </div>

            {/* Add / Edit Modal */}
            <Modal show={showAddModal || showEditModal} onClose={() => { setShowAddModal(false); setShowEditModal(false); }}>
                <div className="p-6 bg-white dark:bg-slate-800 relative">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                    >
                        ✖
                    </button>
                    <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-indigo-500" />
                        {showAddModal ? "Tambah Pengumuman" : "Edit Pengumuman"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSuperadmin || branches.length > 1 ? (
                            <div>
                                <InputLabel className="dark:text-gray-300">
                                    Cabang <span className="text-red-500">*</span>
                                </InputLabel>
                                <select
                                    className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    value={data.branch_id}
                                    onChange={(e) => handleDataChange("branch_id", e.target.value)}
                                >
                                    <option value="">Pilih Cabang</option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.branch_id} className="mt-2" />
                            </div>
                        ) : (
                            <input type="hidden" value={data.branch_id} />
                        )}

                        <div>
                            <InputLabel className="dark:text-gray-300">
                                Judul Pengumuman <span className="text-red-500">*</span>
                            </InputLabel>
                            <TextInput
                                type="text"
                                className="mt-1 block w-full dark:bg-slate-900 dark:border-slate-700 dark:text-gray-200"
                                value={data.title}
                                onChange={(e) => handleDataChange("title", e.target.value)}
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel className="dark:text-gray-300">
                                Isi Pengumuman <span className="text-red-500">*</span>
                            </InputLabel>
                            <textarea
                                className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                rows={4}
                                value={data.content}
                                onChange={(e) => handleDataChange("content", e.target.value)}
                            ></textarea>
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel className="dark:text-gray-300">
                                Tipe Pengumuman <span className="text-red-500">*</span>
                            </InputLabel>
                            <select
                                className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.type}
                                onChange={(e) => handleDataChange("type", e.target.value)}
                            >
                                <option value="permanent">Selalu Ada (Permanen)</option>
                                <option value="date_range">Rentang Tanggal (Date Range)</option>
                            </select>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        {data.type === "date_range" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel className="dark:text-gray-300">
                                        Tanggal Mulai <span className="text-red-500">*</span>
                                    </InputLabel>
                                    <TextInput
                                        type="date"
                                        className="mt-1 block w-full dark:bg-slate-900 dark:border-slate-700 dark:text-gray-200"
                                        value={data.start_date}
                                        onChange={(e) => handleDataChange("start_date", e.target.value)}
                                        required={data.type === "date_range"}
                                    />
                                    <InputError message={errors.start_date} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel className="dark:text-gray-300">
                                        Tanggal Selesai <span className="text-red-500">*</span>
                                    </InputLabel>
                                    <TextInput
                                        type="date"
                                        className="mt-1 block w-full dark:bg-slate-900 dark:border-slate-700 dark:text-gray-200"
                                        value={data.end_date}
                                        onChange={(e) => handleDataChange("end_date", e.target.value)}
                                        required={data.type === "date_range"}
                                    />
                                    <InputError message={errors.end_date} className="mt-2" />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="rounded dark:bg-slate-900 dark:border-slate-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                                checked={data.is_active}
                                onChange={(e) => setData({ ...data, is_active: e.target.checked })}
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                Aktifkan Pengumuman ini
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-600">
                                Batal
                            </Button>
                            <Button type="submit">
                                Simpan
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6 bg-white dark:bg-slate-800">
                    <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Konfirmasi Hapus</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Apakah Anda yakin ingin menghapus pengumuman <strong>{selectedAnnouncement?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-600">
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
