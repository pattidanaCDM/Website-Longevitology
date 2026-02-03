import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { User, Role, Branch } from '@/types';
import { Pencil, Trash2, Plus, Key, Users as UsersIcon, UserCog, MapPin } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface ManageUsersProps {
    users: (User & { role: Role; branch?: Branch })[];
    roles: Role[];
    branches: Branch[];
}

export default function ManageUsers({ users, roles, branches }: ManageUsersProps) {
    const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'branches'>('users');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    // Branch Modals
    const [showAddBranchModal, setShowAddBranchModal] = useState(false);
    const [showEditBranchModal, setShowEditBranchModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data: addData, setData: setAddData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
        branch_id: '',
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        name: '',
        email: '',
        role_id: '',
        branch_id: '',
    });

    const { data: branchData, setData: setBranchData, post: postBranch, put: putBranch, processing: branchProcessing, errors: branchErrors, reset: resetBranch } = useForm({
        name: '',
        address: '',
        map_url: '',
    });

    const { data: resetData, setData: setResetData, post: postReset, processing: resetProcessing } = useForm({});

    const { delete: destroy } = useForm();

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };

    const handleEditUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            put(route('users.update', selectedUser.id), {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                },
            });
        }
    };

    const handleDeleteUser = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            destroy(route('users.destroy', user.id));
        }
    };

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

    const handleDeleteBranch = (branch: Branch) => {
        if (confirm(`Are you sure you want to delete ${branch.name}?`)) {
            destroy(route('branches.destroy', branch.id));
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            postReset(route('users.send-reset-link', selectedUser.id), {
                onSuccess: () => {
                    setShowResetModal(false);
                    setSelectedUser(null);
                },
            });
        }
    };

    const openEditModal = (user: User & { role: Role }) => {
        setSelectedUser(user);
        setEditData({
            name: user.name,
            email: user.email,
            role_id: user.role_id?.toString() || '',
            branch_id: user.branch_id?.toString() || '',
        });
        setShowEditModal(true);
    };

    const openEditBranchModal = (branch: Branch) => {
        setSelectedBranch(branch);
        setBranchData({
            name: branch.name,
            address: branch.address,
            map_url: branch.map_url || '',
        });
        setShowEditBranchModal(true);
    };

    const openResetModal = (user: User) => {
        setSelectedUser(user);
        setShowResetModal(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg transition-colors duration-300">
                    {/* Page Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage users and their roles</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users'
                                    ? 'border-[#ad2c90] text-[#ad2c90]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                <UsersIcon className="w-4 h-4" />
                                Users
                            </button>
                            <button
                                onClick={() => setActiveTab('roles')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'roles'
                                    ? 'border-[#ad2c90] text-[#ad2c90]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                <UserCog className="w-4 h-4" />
                                Roles
                            </button>
                            <button
                                onClick={() => setActiveTab('branches')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'branches'
                                    ? 'border-[#ad2c90] text-[#ad2c90]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                <MapPin className="w-4 h-4" />
                                Branches
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'users' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Users</h3>
                                    <Button
                                        onClick={() => setShowAddModal(true)}
                                        className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:from-[#7a2ce0] hover:to-[#ad2c90]"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add User
                                    </Button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-slate-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                            {user.role?.name || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {user.branch?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(user)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                title="Edit User"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openResetModal(user)}
                                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                title="Reset Password"
                                                            >
                                                                <Key className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'roles' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">All Roles</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-slate-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            {roles.map((role) => (
                                                <tr key={role.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                            {role.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{role.description || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'branches' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Branches</h3>
                                    <Button
                                        onClick={() => setShowAddBranchModal(true)}
                                        className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:from-[#7a2ce0] hover:to-[#ad2c90]"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Branch
                                    </Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-slate-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            {branches.map((branch) => (
                                                <tr key={branch.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {branch.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{branch.address}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditBranchModal(branch)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBranch(branch)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New User</h3>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    value={addData.name}
                                    onChange={(e) => setAddData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    value={addData.email}
                                    onChange={(e) => setAddData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <input
                                    type="password"
                                    value={addData.password}
                                    onChange={(e) => setAddData('password', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                <select
                                    value={addData.role_id}
                                    onChange={(e) => setAddData('role_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                {errors.role_id && <p className="mt-1 text-sm text-red-600">{errors.role_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch (Optional for Admins)</label>
                                <select
                                    value={addData.branch_id}
                                    onChange={(e) => setAddData('branch_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setShowAddModal(false)} variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4]">
                                    Add User
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit User</h3>
                        <form onSubmit={handleEditUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {editErrors.name && <p className="mt-1 text-sm text-red-600">{editErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {editErrors.email && <p className="mt-1 text-sm text-red-600">{editErrors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                <select
                                    value={editData.role_id}
                                    onChange={(e) => setEditData('role_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                {editErrors.role_id && <p className="mt-1 text-sm text-red-600">{editErrors.role_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch (Optional for Admins)</label>
                                <select
                                    value={editData.branch_id}
                                    onChange={(e) => setEditData('branch_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setShowEditModal(false)} variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editProcessing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4]">
                                    Update User
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Branch Modal */}
            {showAddBranchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Branch</h3>
                        <form onSubmit={handleAddBranch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name</label>
                                <input
                                    type="text"
                                    value={branchData.name}
                                    onChange={(e) => setBranchData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {branchErrors.name && <p className="mt-1 text-sm text-red-600">{branchErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                <textarea
                                    value={branchData.address}
                                    onChange={(e) => setBranchData('address', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    rows={3}
                                />
                                {branchErrors.address && <p className="mt-1 text-sm text-red-600">{branchErrors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Map URL (Optional)</label>
                                <input
                                    type="text"
                                    value={branchData.map_url}
                                    onChange={(e) => setBranchData('map_url', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setShowAddBranchModal(false)} variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={branchProcessing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4]">
                                    Add Branch
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Branch Modal */}
            {showEditBranchModal && selectedBranch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Branch</h3>
                        <form onSubmit={handleEditBranch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name</label>
                                <input
                                    type="text"
                                    value={branchData.name}
                                    onChange={(e) => setBranchData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {branchErrors.name && <p className="mt-1 text-sm text-red-600">{branchErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                <textarea
                                    value={branchData.address}
                                    onChange={(e) => setBranchData('address', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    rows={3}
                                />
                                {branchErrors.address && <p className="mt-1 text-sm text-red-600">{branchErrors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Map URL (Optional)</label>
                                <input
                                    type="text"
                                    value={branchData.map_url}
                                    onChange={(e) => setBranchData('map_url', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setShowEditBranchModal(false)} variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={branchProcessing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4]">
                                    Update Branch
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Send Password Reset Email Modal */}
            {showResetModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Send Password Reset Email</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            A password reset link will be sent to <strong>{selectedUser.email}</strong>. The user will receive an email with instructions to reset their password.
                        </p>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setShowResetModal(false)} variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={resetProcessing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4]">
                                    Send Reset Link
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
