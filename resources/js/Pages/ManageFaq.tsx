import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, HelpCircle, ListTree } from 'lucide-react';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';

interface Category {
    id: number;
    name: string;
}

interface Faq {
    id: number;
    question: string;
    answer: string;
    categories: Category[];
}

interface ManageFaqProps {
    faqs: Faq[];
    categories: Category[];
}

export default function ManageFaq({ faqs, categories }: ManageFaqProps) {
    const [activeTab, setActiveTab] = useState<'faqs' | 'categories'>('faqs');

    // Modals state
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [showDeleteFaqModal, setShowDeleteFaqModal] = useState(false);

    // Selected items for edit/delete
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);

    // Forms
    const categoryForm = useForm({
        name: '',
    });

    const faqForm = useForm({
        question: '',
        answer: '',
        categories: [] as number[],
    });

    // Category Handlers
    const handleAddCategory = () => {
        setSelectedCategory(null);
        categoryForm.setData({ name: '' });
        categoryForm.clearErrors();
        setShowCategoryModal(true);
    };

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        categoryForm.setData({ name: category.name });
        categoryForm.clearErrors();
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteCategoryModal(true);
    };

    const submitCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCategory) {
            categoryForm.put(route('faqs.categories.update', selectedCategory.id), {
                onSuccess: () => setShowCategoryModal(false),
            });
        } else {
            categoryForm.post(route('faqs.categories.store'), {
                onSuccess: () => setShowCategoryModal(false),
            });
        }
    };

    const confirmDeleteCategory = () => {
        if (selectedCategory) {
            categoryForm.delete(route('faqs.categories.destroy', selectedCategory.id), {
                onSuccess: () => setShowDeleteCategoryModal(false),
            });
        }
    };

    // FAQ Handlers
    const handleAddFaq = () => {
        setSelectedFaq(null);
        faqForm.setData({
            question: '',
            answer: '',
            categories: [] as number[],
        });
        faqForm.clearErrors();
        setShowFaqModal(true);
    };

    const handleEditFaq = (faq: Faq) => {
        setSelectedFaq(faq);
        faqForm.setData({
            question: faq.question,
            answer: faq.answer,
            categories: faq.categories.map((c) => c.id),
        });
        faqForm.clearErrors();
        setShowFaqModal(true);
    };

    const handleDeleteFaq = (faq: Faq) => {
        setSelectedFaq(faq);
        setShowDeleteFaqModal(true);
    };

    const submitFaq = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFaq) {
            faqForm.put(route('faqs.update', selectedFaq.id), {
                onSuccess: () => setShowFaqModal(false),
            });
        } else {
            faqForm.post(route('faqs.store'), {
                onSuccess: () => setShowFaqModal(false),
            });
        }
    };

    const confirmDeleteFaq = () => {
        if (selectedFaq) {
            faqForm.delete(route('faqs.destroy', selectedFaq.id), {
                onSuccess: () => setShowDeleteFaqModal(false),
            });
        }
    };

    const toggleCategory = (categoryId: number) => {
        const currentCategories = faqForm.data.categories;
        if (currentCategories.includes(categoryId)) {
            faqForm.setData('categories', currentCategories.filter(id => id !== categoryId));
        } else {
            faqForm.setData('categories', [...currentCategories, categoryId]);
        }
        faqForm.clearErrors('categories');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Manage FAQs
                </h2>
            }
        >
            <Head title="Manage FAQs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('faqs')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'faqs'
                                        ? 'border-[#ad2c90] text-[#ad2c90] dark:text-[#d33aae]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                <HelpCircle className="w-4 h-4" />
                                FAQs
                            </button>
                            <button
                                onClick={() => setActiveTab('categories')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'categories'
                                        ? 'border-[#ad2c90] text-[#ad2c90] dark:text-[#d33aae]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                <ListTree className="w-4 h-4" />
                                Kategori
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-6">
                            
                            {/* FAQs Tab */}
                            {activeTab === 'faqs' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Daftar FAQ</h3>
                                        <Button onClick={handleAddFaq} className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> Tambah FAQ
                                        </Button>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">Pertanyaan</th>
                                                    <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">Jawaban</th>
                                                    <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">Kategori</th>
                                                    <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-right w-24">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {faqs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                            Belum ada FAQ.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    faqs.map(faq => (
                                                        <tr key={faq.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 align-top">
                                                                {faq.question}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 align-top whitespace-pre-wrap">
                                                                {faq.answer.length > 100 ? faq.answer.substring(0, 100) + '...' : faq.answer}
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {faq.categories.map(c => (
                                                                        <span key={c.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                            {c.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right align-top">
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => handleEditFaq(faq)} className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/50">
                                                                        <Pencil className="w-4 h-4" />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteFaq(faq)} className="p-1 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/50">
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
                            )}

                            {/* Categories Tab */}
                            {activeTab === 'categories' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Kategori FAQ</h3>
                                        <Button onClick={handleAddCategory} className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> Tambah Kategori
                                        </Button>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">Nama Kategori</th>
                                                    <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-right w-24">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {categories.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                            Belum ada kategori.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    categories.map(category => (
                                                        <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                                {category.name}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => handleEditCategory(category)} className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/50">
                                                                        <Pencil className="w-4 h-4" />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteCategory(category)} className="p-1 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/50">
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
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal FAQ */}
            <Modal show={showFaqModal} onClose={() => setShowFaqModal(false)} maxWidth="2xl">
                <form onSubmit={submitFaq} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                        {selectedFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pertanyaan <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={faqForm.data.question}
                                onChange={e => {
                                    faqForm.setData('question', e.target.value);
                                    faqForm.clearErrors('question');
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                            <InputError message={faqForm.errors.question} className="mt-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jawaban <span className="text-red-500">*</span></label>
                            <textarea
                                value={faqForm.data.answer}
                                onChange={e => {
                                    faqForm.setData('answer', e.target.value);
                                    faqForm.clearErrors('answer');
                                }}
                                rows={5}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                            <InputError message={faqForm.errors.answer} className="mt-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map(c => (
                                    <label key={c.id} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                                        <input 
                                            type="checkbox" 
                                            checked={faqForm.data.categories.includes(c.id)}
                                            onChange={() => toggleCategory(c.id)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span>{c.name}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={faqForm.errors.categories} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setShowFaqModal(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={faqForm.processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Delete FAQ */}
            <Modal show={showDeleteFaqModal} onClose={() => setShowDeleteFaqModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Hapus FAQ</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteFaqModal(false)}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDeleteFaq} disabled={faqForm.processing}>Hapus</Button>
                    </div>
                </div>
            </Modal>

            {/* Modal Kategori */}
            <Modal show={showCategoryModal} onClose={() => setShowCategoryModal(false)} maxWidth="sm">
                <form onSubmit={submitCategory} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                        {selectedCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Kategori <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={categoryForm.data.name}
                            onChange={e => {
                                categoryForm.setData('name', e.target.value);
                                categoryForm.clearErrors('name');
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            required
                        />
                        <InputError message={categoryForm.errors.name} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setShowCategoryModal(false)}>Batal</Button>
                        <Button type="submit" disabled={categoryForm.processing}>Simpan</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Delete Kategori */}
            <Modal show={showDeleteCategoryModal} onClose={() => setShowDeleteCategoryModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Hapus Kategori</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Apakah Anda yakin ingin menghapus kategori ini?
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteCategoryModal(false)}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDeleteCategory} disabled={categoryForm.processing}>Hapus</Button>
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
