import { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Branch, BranchPhoto } from '@/types';
import { Pencil, Trash2, Plus, MapPin, X, Upload } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Modal from '@/Components/Modal';

interface ManageBranchesProps {
    branches: Branch[];
}

export default function ManageBranches({ branches }: ManageBranchesProps) {
    const [showAddBranchModal, setShowAddBranchModal] = useState(false);
    const [showEditBranchModal, setShowEditBranchModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const { data: branchData, setData: setBranchData, post: postBranch, processing: branchProcessing, errors: branchErrors, reset: resetBranch, clearErrors: clearBranchErrors } = useForm({
        name: '',
        code: '',
        address: '',
        map_url: '',
        embed_map_url: '',
        contacts: [] as {name: string, phone: string}[],
        photos: [] as File[],
        deleted_photo_ids: [] as number[],
        _method: 'POST',
    });

    const [existingPhotos, setExistingPhotos] = useState<BranchPhoto[]>([]);

    const { delete: destroy, processing: deleteProcessing } = useForm();
    const [showDeleteBranchModal, setShowDeleteBranchModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

    const handleAddBranch = (e: React.FormEvent) => {
        e.preventDefault();
        setBranchData('_method', 'POST');
        postBranch(route('branches.store'), {
            onSuccess: () => {
                setShowAddBranchModal(false);
                resetBranch();
            },
        });
    };

    const handleEditBranch = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedBranch) {
            // Inertia doesn't support multipart/form-data with PUT method directly, so we use POST and spoof PUT
            postBranch(route('branches.update', selectedBranch.id), {
                onSuccess: () => {
                    setShowEditBranchModal(false);
                    setSelectedBranch(null);
                    resetBranch();
                },
            });
        }
    };

    const confirmDeleteBranch = (branch: Branch) => {
        setBranchToDelete(branch);
        setShowDeleteBranchModal(true);
    };

    const handleDeleteBranch = (e: React.FormEvent) => {
        e.preventDefault();
        if (branchToDelete) {
            destroy(route('branches.destroy', branchToDelete.id), {
                onSuccess: () => {
                    setShowDeleteBranchModal(false);
                    setBranchToDelete(null);
                }
            });
        }
    };

    const openEditBranchModal = (branch: Branch) => {
        setSelectedBranch(branch);
        setExistingPhotos(branch.photos || []);
        
        setBranchData({
            name: branch.name,
            code: branch.code || '',
            address: branch.address,
            map_url: branch.map_url || '',
            embed_map_url: branch.embed_map_url || '',
            contacts: branch.contacts ? branch.contacts.map(c => ({ name: c.name, phone: c.phone || '' })) : [],
            photos: [],
            deleted_photo_ids: [],
            _method: 'PUT',
        });
        setShowEditBranchModal(true);
    };

    const addContactField = () => {
        setBranchData('contacts', [...branchData.contacts, { name: '', phone: '' }]);
    };

    const removeContactField = (index: number) => {
        const newContacts = [...branchData.contacts];
        newContacts.splice(index, 1);
        setBranchData('contacts', newContacts);
    };

    const handleContactChange = (index: number, field: 'name' | 'phone', value: string) => {
        const newContacts = [...branchData.contacts];
        newContacts[index][field] = value;
        setBranchData('contacts', newContacts);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setBranchData('photos', [...branchData.photos, ...newFiles]);
        }
    };

    const removeNewPhoto = (index: number) => {
        const newPhotos = [...branchData.photos];
        newPhotos.splice(index, 1);
        setBranchData('photos', newPhotos);
    };

    const markPhotoForDeletion = (photoId: number) => {
        setBranchData('deleted_photo_ids', [...branchData.deleted_photo_ids, photoId]);
        setExistingPhotos(existingPhotos.filter(p => p.id !== photoId));
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputRefEdit = useRef<HTMLInputElement>(null);

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Cabang" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg transition-colors duration-300">
                    {/* Page Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-[#ad2c90]" />
                                Manajemen Cabang
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola semua cabang klinik</p>
                        </div>
                        <Button
                            onClick={() => {
                                resetBranch();
                                setBranchData('_method', 'POST');
                                setShowAddBranchModal(true);
                            }}
                            className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:from-[#7a2ce0] hover:to-[#ad2c90]"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Cabang
                        </Button>
                    </div>

                    {/* Table Content */}
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Cabang</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kode</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alamat</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {branches.map((branch) => (
                                        <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {branch.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {branch.code ? (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                        {branch.code}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{branch.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditBranchModal(branch)}
                                                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDeleteBranch(branch)}
                                                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {branches.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                Tidak ada cabang ditemukan. Klik "Tambah Cabang" untuk membuat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Branch Modal */}
            <Modal show={showAddBranchModal} onClose={() => setShowAddBranchModal(false)} maxWidth="2xl">
                <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tambah Cabang Baru</h3>
                        </div>
                        <form onSubmit={handleAddBranch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Cabang <span className="text-red-500">*</span> </label>
                                    <input
                                        type="text"
                                        value={branchData.name}
                                        onChange={(e) => setBranchData('name', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    />
                                    {branchErrors.name && <p className="mt-1 text-sm text-red-600">{branchErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Cabang (Opsional)</label>
                                    <input
                                        type="text"
                                        value={branchData.code}
                                        onChange={(e) => setBranchData('code', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    />
                                    {branchErrors.code && <p className="mt-1 text-sm text-red-600">{branchErrors.code}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat <span className="text-red-500">*</span> </label>
                                <textarea
                                    value={branchData.address}
                                    onChange={(e) => setBranchData('address', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    rows={3}
                                />
                                {branchErrors.address && <p className="mt-1 text-sm text-red-600">{branchErrors.address}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Peta (Opsional)</label>
                                    <input
                                        type="text"
                                        value={branchData.map_url}
                                        onChange={(e) => {
                                            setBranchData('map_url', e.target.value);
                                            clearBranchErrors('map_url');
                                        }}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                        placeholder="Link asli Google Maps"
                                    />
                                    {branchErrors.map_url && <p className="mt-1 text-sm text-red-600">{branchErrors.map_url}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Embed Map URL (Opsional)</label>
                                    <input
                                        type="text"
                                        value={branchData.embed_map_url}
                                        onChange={(e) => {
                                            setBranchData('embed_map_url', e.target.value);
                                            clearBranchErrors('embed_map_url');
                                        }}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                        placeholder="Link dari 'Embed a map'"
                                    />
                                    {branchErrors.embed_map_url && <p className="mt-1 text-sm text-red-600">{branchErrors.embed_map_url}</p>}
                                </div>
                            </div>

                            <hr className="my-4 border-gray-200 dark:border-gray-700" />
                            
                            {/* Contacts Section */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kontak (Opsional)</label>
                                    <Button type="button" variant="outline" size="sm" onClick={addContactField}>
                                        <Plus className="w-3 h-3 mr-1" /> Tambah Kontak
                                    </Button>
                                </div>
                                {branchData.contacts.map((contact, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-start">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Nama Kontak"
                                                value={contact.name}
                                                onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm text-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="No. Telepon"
                                                value={contact.phone}
                                                onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm text-sm"
                                            />
                                        </div>
                                        <button type="button" onClick={() => removeContactField(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md dark:hover:bg-red-900/30">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-4 border-gray-200 dark:border-gray-700" />

                            {/* Photos Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto Cabang (Opsional)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handlePhotoChange}
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-4">
                                    <Upload className="w-4 h-4 mr-2" /> Upload Foto
                                </Button>
                                
                                {branchData.photos.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                        {branchData.photos.map((file, idx) => (
                                            <div key={idx} className="relative group">
                                                <img src={URL.createObjectURL(file)} alt="Preview" className="h-24 w-full object-cover rounded-md" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewPhoto(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100 dark:border-gray-800">
                                <Button type="button" onClick={() => setShowAddBranchModal(false)} variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={branchProcessing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:shadow-lg transition-all">
                                    {branchProcessing ? 'Menyimpan...' : 'Tambah Cabang'}
                                </Button>
                            </div>
                        </form>
                </div>
            </Modal>

            {/* Edit Branch Modal */}
            <Modal show={showEditBranchModal} onClose={() => setShowEditBranchModal(false)} maxWidth="2xl">
                <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Pencil className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ubah Cabang</h3>
                        </div>
                        <form onSubmit={handleEditBranch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Cabang <span className="text-red-500">*</span> </label>
                                    <input
                                        type="text"
                                        value={branchData.name}
                                        onChange={(e) => setBranchData('name', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    />
                                    {branchErrors.name && <p className="mt-1 text-sm text-red-600">{branchErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Cabang (Opsional)</label>
                                    <input
                                        type="text"
                                        value={branchData.code}
                                        onChange={(e) => setBranchData('code', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    />
                                    {branchErrors.code && <p className="mt-1 text-sm text-red-600">{branchErrors.code}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat <span className="text-red-500">*</span> </label>
                                <textarea
                                    value={branchData.address}
                                    onChange={(e) => setBranchData('address', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    rows={3}
                                />
                                {branchErrors.address && <p className="mt-1 text-sm text-red-600">{branchErrors.address}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Peta (Opsional)</label>
                                    <input
                                        type="text"
                                        value={branchData.map_url}
                                        onChange={(e) => {
                                            setBranchData('map_url', e.target.value);
                                            clearBranchErrors('map_url');
                                        }}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                        placeholder="Link asli Google Maps"
                                    />
                                    {branchErrors.map_url && <p className="mt-1 text-sm text-red-600">{branchErrors.map_url}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Embed Map URL (Opsional)</label>
                                    <input
                                        type="text"
                                        value={branchData.embed_map_url}
                                        onChange={(e) => {
                                            setBranchData('embed_map_url', e.target.value);
                                            clearBranchErrors('embed_map_url');
                                        }}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                        placeholder="Link dari 'Embed a map'"
                                    />
                                    {branchErrors.embed_map_url && <p className="mt-1 text-sm text-red-600">{branchErrors.embed_map_url}</p>}
                                </div>
                            </div>

                            <hr className="my-4 border-gray-200 dark:border-gray-700" />
                            
                            {/* Contacts Section */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kontak (Opsional)</label>
                                    <Button type="button" variant="outline" size="sm" onClick={addContactField}>
                                        <Plus className="w-3 h-3 mr-1" /> Tambah Kontak
                                    </Button>
                                </div>
                                {branchData.contacts.map((contact, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-start">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Nama Kontak"
                                                value={contact.name}
                                                onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm text-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="No. Telepon"
                                                value={contact.phone}
                                                onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm text-sm"
                                            />
                                        </div>
                                        <button type="button" onClick={() => removeContactField(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md dark:hover:bg-red-900/30">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-4 border-gray-200 dark:border-gray-700" />

                            {/* Photos Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto Cabang (Opsional)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRefEdit}
                                    onChange={handlePhotoChange}
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRefEdit.current?.click()} className="mb-4">
                                    <Upload className="w-4 h-4 mr-2" /> Upload Foto Tambahan
                                </Button>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                    {/* Existing Photos */}
                                    {existingPhotos.map((photo) => (
                                        <div key={photo.id} className="relative group">
                                            <img src={`/storage/${photo.photo_path}`} alt="Existing" className="h-24 w-full object-cover rounded-md" />
                                            <button
                                                type="button"
                                                onClick={() => markPhotoForDeletion(photo.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Hapus foto ini"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Photos */}
                                    {branchData.photos.map((file, idx) => (
                                        <div key={`new-${idx}`} className="relative group">
                                            <img src={URL.createObjectURL(file)} alt="Preview" className="h-24 w-full object-cover rounded-md border-2 border-green-500" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewPhoto(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100 dark:border-gray-800">
                                <Button type="button" onClick={() => setShowEditBranchModal(false)} variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={branchProcessing} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all">
                                    {branchProcessing ? 'Menyimpan...' : 'Perbarui Cabang'}
                                </Button>
                            </div>
                        </form>
                </div>
            </Modal>

            {/* Delete Branch Modal */}
            <Modal show={showDeleteBranchModal} onClose={() => setShowDeleteBranchModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">
                        Hapus Cabang
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Apakah Anda yakin ingin menghapus <strong>{branchToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteBranchModal(false)}
                            className="dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleDeleteBranch}
                            disabled={deleteProcessing}
                            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                        >
                            Konfirmasi Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
