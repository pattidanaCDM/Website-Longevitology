import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Branch } from '@/types';
import { Pencil, Trash2, Plus, MapPin } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Modal from '@/Components/Modal';

interface ManageBranchesProps {
    branches: Branch[];
}

export default function ManageBranches({ branches }: ManageBranchesProps) {
    const [showAddBranchModal, setShowAddBranchModal] = useState(false);
    const [showEditBranchModal, setShowEditBranchModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

        const { data: branchData, setData: setBranchData, post: postBranch, put: putBranch, processing: branchProcessing, errors: branchErrors, reset: resetBranch, clearErrors: clearBranchErrors } = useForm({
            name: '',
            code: '',
            address: '',
            map_url: '',
        });

    const { delete: destroy, processing: deleteProcessing } = useForm();
    const [showDeleteBranchModal, setShowDeleteBranchModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

    const handleAddBranch = (e: React.FormEvent) => {
        e.preventDefault();
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
            putBranch(route('branches.update', selectedBranch.id), {
                onSuccess: () => {
                    setShowEditBranchModal(false);
                    setSelectedBranch(null);
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
        setBranchData({
            name: branch.name,
            code: branch.code || '',
            address: branch.address,
            map_url: branch.map_url || '',
        });
        setShowEditBranchModal(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Branches" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg transition-colors duration-300">
                    {/* Page Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-[#ad2c90]" />
                                Branch Management
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all clinic branches</p>
                        </div>
                        <Button
                            onClick={() => {
                                resetBranch();
                                setShowAddBranchModal(true);
                            }}
                            className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:from-[#7a2ce0] hover:to-[#ad2c90]"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Branch
                        </Button>
                    </div>

                    {/* Table Content */}
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
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
                                                No branches found. Click "Add Branch" to create one.
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
            <Modal show={showAddBranchModal} onClose={() => setShowAddBranchModal(false)} maxWidth="md">
                <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Branch</h3>
                        </div>
                        <form onSubmit={handleAddBranch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch Name <span className="text-red-500">*</span> </label>
                                <input
                                    type="text"
                                    value={branchData.name}
                                    onChange={(e) => setBranchData('name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    placeholder="e.g. Longevitology Clinic - North"
                                />
                                {branchErrors.name && <p className="mt-1 text-sm text-red-600">{branchErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch Code (Optional)</label>
                                <input
                                    type="text"
                                    value={branchData.code}
                                    onChange={(e) => setBranchData('code', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    placeholder="e.g. NORTH"
                                />
                                {branchErrors.code && <p className="mt-1 text-sm text-red-600">{branchErrors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address <span className="text-red-500">*</span> </label>
                                <textarea
                                    value={branchData.address}
                                    onChange={(e) => setBranchData('address', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    rows={3}
                                    placeholder="Full address of the branch"
                                />
                                {branchErrors.address && <p className="mt-1 text-sm text-red-600">{branchErrors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Map URL (Optional)</label>
                                <input
                                    type="text"
                                    value={branchData.map_url}
                                    onChange={(e) => {
                                        setBranchData('map_url', e.target.value);
                                        clearBranchErrors('map_url');
                                    }}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    placeholder="https://maps.google.com/..."
                                />
                                {branchErrors.map_url && <p className="mt-1 text-sm text-red-600">{branchErrors.map_url}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100 dark:border-gray-800">
                                <Button type="button" onClick={() => setShowAddBranchModal(false)} variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={branchProcessing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:shadow-lg transition-all">
                                    {branchProcessing ? 'Saving...' : 'Add Branch'}
                                </Button>
                            </div>
                        </form>
                </div>
            </Modal>

            {/* Edit Branch Modal */}
            <Modal show={showEditBranchModal} onClose={() => setShowEditBranchModal(false)} maxWidth="md">
                <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Pencil className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Branch</h3>
                        </div>
                        <form onSubmit={handleEditBranch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch Name <span className="text-red-500">*</span> </label>
                                <input
                                    type="text"
                                    value={branchData.name}
                                    onChange={(e) => setBranchData('name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                />
                                {branchErrors.name && <p className="mt-1 text-sm text-red-600">{branchErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch Code (Optional)</label>
                                <input
                                    type="text"
                                    value={branchData.code}
                                    onChange={(e) => setBranchData('code', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                />
                                {branchErrors.code && <p className="mt-1 text-sm text-red-600">{branchErrors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address <span className="text-red-500">*</span> </label>
                                <textarea
                                    value={branchData.address}
                                    onChange={(e) => setBranchData('address', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                    rows={3}
                                />
                                {branchErrors.address && <p className="mt-1 text-sm text-red-600">{branchErrors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Map URL (Optional)</label>
                                <input
                                    type="text"
                                    value={branchData.map_url}
                                    onChange={(e) => {
                                        setBranchData('map_url', e.target.value);
                                        clearBranchErrors('map_url');
                                    }}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                />
                                {branchErrors.map_url && <p className="mt-1 text-sm text-red-600">{branchErrors.map_url}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100 dark:border-gray-800">
                                <Button type="button" onClick={() => setShowEditBranchModal(false)} variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={branchProcessing} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all">
                                    {branchProcessing ? 'Saving...' : 'Update Branch'}
                                </Button>
                            </div>
                        </form>
                </div>
            </Modal>

            {/* Delete Branch Modal */}
            <Modal show={showDeleteBranchModal} onClose={() => setShowDeleteBranchModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">
                        Delete Branch
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete <strong>{branchToDelete?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteBranchModal(false)}
                            className="dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteBranch}
                            disabled={deleteProcessing}
                            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                        >
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
