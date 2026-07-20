import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function Index({ auth, scheduleExceptions, branches }: any) {
    const isSuperadmin = auth.user.role?.name === 'superadmin';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingException, setEditingException] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        branch_id: isSuperadmin ? '' : auth.user.branch_id,
        original_date: '',
        type: 'libur', // 'libur' or 'dipindahkan'
        rescheduled_date: '',
        description: '',
    });

    const openModal = (exception: any = null) => {
        clearErrors();
        if (exception) {
            setEditingException(exception);
            setData({
                branch_id: exception.branch_id,
                original_date: exception.original_date,
                type: exception.type,
                rescheduled_date: exception.rescheduled_date || '',
                description: exception.description,
            });
        } else {
            setEditingException(null);
            setData({
                branch_id: isSuperadmin ? '' : auth.user.branch_id,
                original_date: '',
                type: 'libur',
                rescheduled_date: '',
                description: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            reset();
            setEditingException(null);
            clearErrors();
        }, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const options = {
            onSuccess: () => closeModal(),
        };

        if (editingException) {
            put(route('schedule-exceptions.update', editingException.id), options);
        } else {
            post(route('schedule-exceptions.store'), options);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Yakin ingin menghapus pengecualian jadwal ini?')) {
            destroy(route('schedule-exceptions.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Pengecualian Jadwal</h2>}
        >
            <Head title="Pengecualian Jadwal" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Daftar Pengecualian Jadwal</h3>
                            <button
                                onClick={() => openModal()}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ad2c90] to-[#5400d4] text-white rounded-lg hover:shadow-lg transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Pengecualian
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700/50 dark:text-gray-400">
                                    <tr>
                                        {isSuperadmin && <th className="px-6 py-3">Cabang</th>}
                                        <th className="px-6 py-3">Tanggal Terdampak</th>
                                        <th className="px-6 py-3">Tipe</th>
                                        <th className="px-6 py-3">Tanggal Pengganti</th>
                                        <th className="px-6 py-3">Deskripsi</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scheduleExceptions.map((exception: any) => (
                                        <tr key={exception.id} className="border-b dark:border-gray-700">
                                            {isSuperadmin && (
                                                <td className="px-6 py-4">{exception.branch?.name}</td>
                                            )}
                                            <td className="px-6 py-4">{new Date(exception.original_date).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${exception.type === 'libur' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                    {exception.type === 'libur' ? 'Libur' : 'Dipindahkan'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{exception.rescheduled_date ? new Date(exception.rescheduled_date).toLocaleDateString('id-ID') : '-'}</td>
                                            <td className="px-6 py-4">{exception.description}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openModal(exception)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(exception.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {scheduleExceptions.length === 0 && (
                                        <tr>
                                            <td colSpan={isSuperadmin ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                                                Belum ada data pengecualian jadwal.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity">
                    <div
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingException ? 'Edit Pengecualian' : 'Tambah Pengecualian'}
                                </h3>
                                <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {isSuperadmin && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cabang <span className="text-red-500">*</span> </label>
                                        <select
                                            value={data.branch_id}
                                            onChange={(e) => setData('branch_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                                        >
                                            <option value="">Pilih Cabang</option>
                                            {branches.map((b: any) => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                        {errors.branch_id && <p className="mt-1 text-sm text-red-600">{errors.branch_id}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Terdampak (Jadwal Asli) <span className="text-red-500">*</span> </label>
                                    <input
                                        type="date"
                                        value={data.original_date}
                                        onChange={(e) => setData('original_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                                    />
                                    {errors.original_date && <p className="mt-1 text-sm text-red-600">{errors.original_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Perubahan <span className="text-red-500">*</span> </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                                    >
                                        <option value="libur">Libur</option>
                                        <option value="dipindahkan">Dipindahkan ke Hari Lain</option>
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                </div>

                                {data.type === 'dipindahkan' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Pengganti <span className="text-red-500">*</span> </label>
                                        <input
                                            type="date"
                                            value={data.rescheduled_date}
                                            onChange={(e) => setData('rescheduled_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                                        />
                                        {errors.rescheduled_date && <p className="mt-1 text-sm text-red-600">{errors.rescheduled_date}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi / Informasi untuk Publik <span className="text-red-500">*</span> </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        placeholder="Misal: Libur karena tanggal merah, dipindahkan ke hari Jumat."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                                    ></textarea>
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#ad2c90] to-[#5400d4] rounded-lg opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
