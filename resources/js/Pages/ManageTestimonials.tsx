import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Quote } from 'lucide-react';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';

interface Testimonial {
    id: number;
    name: string;
    location: string | null;
    excerpt: string | null;
    content: string;
    link: string | null;
    is_active: boolean;
}

interface ManageTestimonialsProps {
    testimonials: Testimonial[];
}

export default function ManageTestimonials({ testimonials }: ManageTestimonialsProps) {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

    const form = useForm({
        name: '',
        location: '',
        excerpt: '',
        content: '',
        link: '',
        is_active: true,
    });

    const handleAdd = () => {
        setSelectedTestimonial(null);
        form.setData({
            name: '',
            location: '',
            excerpt: '',
            content: '',
            link: '',
            is_active: true,
        });
        form.clearErrors();
        setShowModal(true);
    };

    const handleEdit = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        form.setData({
            name: testimonial.name,
            location: testimonial.location || '',
            excerpt: testimonial.excerpt || '',
            content: testimonial.content,
            link: testimonial.link || '',
            is_active: testimonial.is_active,
        });
        form.clearErrors();
        setShowModal(true);
    };

    const handleDelete = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setShowDeleteModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTestimonial) {
            form.put(route('testimonials.update', selectedTestimonial.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            form.post(route('testimonials.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const confirmDelete = () => {
        if (selectedTestimonial) {
            form.delete(route('testimonials.destroy', selectedTestimonial.id), {
                onSuccess: () => setShowDeleteModal(false),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Manage Testimonials
                </h2>
            }
        >
            <Head title="Manage Testimonials" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Quote className="w-5 h-5 text-[#ad2c90]" /> Daftar Testimoni
                            </h3>
                            <Button onClick={handleAdd} className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Tambah Testimoni
                            </Button>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">Nama</th>
                                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">Lokasi</th>
                                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">Kutipan</th>
                                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-center">Status</th>
                                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {testimonials.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                Belum ada testimoni.
                                            </td>
                                        </tr>
                                    ) : (
                                        testimonials.map(testimonial => (
                                            <tr key={testimonial.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 align-top">
                                                    {testimonial.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 align-top">
                                                    {testimonial.location || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 align-top whitespace-pre-wrap">
                                                    {testimonial.excerpt ? (testimonial.excerpt.length > 50 ? testimonial.excerpt.substring(0, 50) + '...' : testimonial.excerpt) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-center align-top">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        testimonial.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {testimonial.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right align-top">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEdit(testimonial)} className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/50">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(testimonial)} className="p-1 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/50">
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

            {/* Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                        {selectedTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={e => {
                                        form.setData('name', e.target.value);
                                        form.clearErrors('name');
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                    required
                                />
                                <InputError message={form.errors.name} className="mt-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lokasi</label>
                                <input
                                    type="text"
                                    value={form.data.location}
                                    onChange={e => {
                                        form.setData('location', e.target.value);
                                        form.clearErrors('location');
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                />
                                <InputError message={form.errors.location} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kutipan Singkat (Halaman Depan)</label>
                            <textarea
                                value={form.data.excerpt}
                                onChange={e => {
                                    form.setData('excerpt', e.target.value);
                                    form.clearErrors('excerpt');
                                }}
                                rows={2}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                placeholder="Contoh: '...Membantu Sesama...'"
                            />
                            <InputError message={form.errors.excerpt} className="mt-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cerita Lengkap <span className="text-red-500">*</span></label>
                            <textarea
                                value={form.data.content}
                                onChange={e => {
                                    form.setData('content', e.target.value);
                                    form.clearErrors('content');
                                }}
                                rows={6}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                required
                            />
                            <InputError message={form.errors.content} className="mt-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tautan Tambahan (Opsional, misal URL Youtube)</label>
                            <input
                                type="url"
                                value={form.data.link}
                                onChange={e => {
                                    form.setData('link', e.target.value);
                                    form.clearErrors('link');
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                placeholder="https://youtube.com/..."
                            />
                            <InputError message={form.errors.link as string} className="mt-2" />
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={e => form.setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Aktifkan Testimoni (tampil di website)</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Delete */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Hapus Testimoni</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Apakah Anda yakin ingin menghapus testimoni dari {selectedTestimonial?.name}?
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={form.processing}>Hapus</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
