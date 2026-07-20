import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { User, Role, Branch } from '@/types';
import { Pencil, Trash2, Plus, Key, Users as UsersIcon, UserCog, MapPin } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Modal from '@/Components/Modal';

interface ManageUsersProps {
    users: (User & { role: Role; branch?: Branch })[];
    roles: Role[];
    branches: Branch[];
}

export default function ManageUsers({ users, roles, branches }: ManageUsersProps) {
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data: addData, setData: setAddData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        branch_id: '',
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        name: '',
        email: '',
        role_id: '',
        branch_id: '',
    });



    const { data: resetData, setData: setResetData, post: postReset, processing: resetProcessing } = useForm({});

    const { delete: destroy, processing: deleteProcessing } = useForm();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

    const confirmDeleteUser = (user: User) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (userToDelete) {
            destroy(route('users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                }
            });
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



    const openResetModal = (user: User) => {
        setSelectedUser(user);
        setShowResetModal(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Pengguna" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg transition-colors duration-300">
                    {/* Page Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Pengguna</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola pengguna dan peran mereka</p>
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
                                Pengguna
                            </button>
                            <button
                                onClick={() => setActiveTab('roles')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'roles'
                                    ? 'border-[#ad2c90] text-[#ad2c90]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                <UserCog className="w-4 h-4" />
                                Peran
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'users' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Semua Pengguna</h3>
                                    <Button
                                        onClick={() => setShowAddModal(true)}
                                        className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4] hover:from-[#7a2ce0] hover:to-[#ad2c90]"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Pengguna
                                    </Button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-slate-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Peran</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cabang</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
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
                                                                title="Ubah Pengguna"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openResetModal(user)}
                                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                title="Atur Ulang Kata Sandi"
                                                            >
                                                                <Key className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => confirmDeleteUser(user)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                title="Hapus Pengguna"
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
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Semua Peran</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-slate-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Peran</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deskripsi</th>
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


                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            <Modal show={showAddModal} onClose={() => { setShowAddModal(false); reset(); }} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Tambah Pengguna Baru</h3>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kata Sandi</label>
                                <input
                                    type="password"
                                    value={addData.password}
                                    onChange={(e) => setAddData('password', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Konfirmasi Kata Sandi</label>
                                <input
                                    type="password"
                                    value={addData.password_confirmation}
                                    onChange={(e) => setAddData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peran</label>
                                <select
                                    value={addData.role_id}
                                    onChange={(e) => setAddData('role_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Pilih Peran</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                {errors.role_id && <p className="mt-1 text-sm text-red-600">{errors.role_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cabang (Opsional untuk Admin)</label>
                                <select
                                    value={addData.branch_id}
                                    onChange={(e) => setAddData('branch_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Pilih Cabang</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setShowAddModal(false)} variant="outline">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4]">
                                    Tambah Pengguna
                                </Button>
                            </div>
                        </form>
                </div>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Ubah Pengguna</h3>
                        <form onSubmit={handleEditUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peran</label>
                                <select
                                    value={editData.role_id}
                                    onChange={(e) => setEditData('role_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Pilih Peran</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                {editErrors.role_id && <p className="mt-1 text-sm text-red-600">{editErrors.role_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cabang (Opsional untuk Admin)</label>
                                <select
                                    value={editData.branch_id}
                                    onChange={(e) => setEditData('branch_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Pilih Cabang</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setShowEditModal(false)} variant="outline">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={editProcessing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4]">
                                    Perbarui Pengguna
                                </Button>
                            </div>
                        </form>
                </div>
            </Modal>



            {/* Send Password Reset Email Modal */}
            <Modal show={showResetModal} onClose={() => setShowResetModal(false)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Kirim Email Atur Ulang Kata Sandi</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Tautan atur ulang kata sandi akan dikirim ke <strong>{selectedUser?.email}</strong>. Pengguna akan menerima email yang berisi petunjuk untuk mengatur ulang kata sandi mereka.
                        </p>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => setShowResetModal(false)} variant="outline">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={resetProcessing} className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4]">
                                    Kirim Tautan Atur Ulang
                                </Button>
                            </div>
                        </form>
                </div>
            </Modal>

            {/* Delete User Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">
                        Hapus Pengguna
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Apakah Anda yakin ingin menghapus <strong>{userToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                            className="dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleDeleteUser}
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
