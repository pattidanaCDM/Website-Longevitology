import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { PageProps } from '@/types';

export default function ManageTherapyClasses({ auth, therapyClasses, flash }: PageProps<{ therapyClasses: any[], flash: { message?: string } }>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<any>(null);
    const [deletingClass, setDeletingClass] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        content: '',
        registration_url: '',
        is_active: true,
        order_column: '',
    });

    const openModal = (therapyClass: any = null) => {
        if (therapyClass) {
            setEditingClass(therapyClass);
            setData({
                title: therapyClass.title,
                content: therapyClass.content,
                registration_url: therapyClass.registration_url || '',
                is_active: therapyClass.is_active,
                order_column: therapyClass.order_column || '',
            });
        } else {
            setEditingClass(null);
            setData({
                title: '',
                content: '',
                registration_url: '',
                is_active: true,
                order_column: '',
            });
        }
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            reset();
            setEditingClass(null);
            clearErrors();
        }, 300);
    };

    const openDeleteModal = (therapyClass: any) => {
        setDeletingClass(therapyClass);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTimeout(() => setDeletingClass(null), 300);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingClass) {
            put(route('therapy-classes.update', editingClass.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('therapy-classes.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const confirmDelete = () => {
        if (deletingClass) {
            destroy(route('therapy-classes.destroy', deletingClass.id), {
                onSuccess: () => closeDeleteModal(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Kelola Kelas Terapi</h2>}
        >
            <Head title="Kelola Kelas Terapi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.message && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{flash.message}</span>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Daftar Kelas Terapi</h3>
                                <Button onClick={() => openModal()} className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tambah Kelas
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Urutan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Judul</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {therapyClasses.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Belum ada kelas yang ditambahkan.
                                                </td>
                                            </tr>
                                        ) : (
                                            therapyClasses.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {item.order_column}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                                                        {item.registration_url && (
                                                            <div className="text-xs text-blue-500 truncate max-w-xs flex items-center gap-1 mt-1" title={item.registration_url}>
                                                                <ExternalLink className="w-3 h-3" />
                                                                {item.registration_url}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.is_active ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Tidak Aktif</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => openModal(item)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteModal(item)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create/Edit */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                        {editingClass ? 'Edit Kelas Terapi' : 'Tambah Kelas Terapi Baru'}
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="title">Judul Kelas <span className="text-red-500">*</span></InputLabel>
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Cth: Kelas Dasar"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="content">Deskripsi Kelas <span className="text-red-500">*</span></InputLabel>
                            <textarea
                                id="content"
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                rows={6}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Masukkan penjelasan kelas..."
                            ></textarea>
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="registration_url" value="Tautan Pendaftaran (Opsional)" />
                            <TextInput
                                id="registration_url"
                                type="url"
                                className="mt-1 block w-full"
                                value={data.registration_url}
                                onChange={(e) => setData('registration_url', e.target.value)}
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Jika diisi, tombol 'Daftar Sekarang' akan muncul di bawah kelas.</p>
                            <InputError message={errors.registration_url} className="mt-2" />
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-1">
                                <InputLabel htmlFor="order_column" value="Urutan (Opsional)" />
                                <TextInput
                                    id="order_column"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.order_column}
                                    onChange={(e) => setData('order_column', e.target.value)}
                                    placeholder="Cth: 1"
                                />
                                <InputError message={errors.order_column} className="mt-2" />
                            </div>
                            <div className="flex-1">
                                <label className="flex items-center mt-8">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Tampilkan Kelas Ini</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={closeModal} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Delete */}
            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} maxWidth="md">
                <div className="p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Konfirmasi Hapus
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Apakah Anda yakin ingin menghapus kelas <strong>{deletingClass?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={closeDeleteModal} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="button" variant="destructive" onClick={confirmDelete} disabled={processing}>
                            {processing ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
