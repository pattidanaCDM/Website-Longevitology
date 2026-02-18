import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Branch, PageProps } from '@/types';
import { Plus, Trash2, Save, Clock, Pencil } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface ScheduleItem {
    id?: number;
    day: string;
    time_start: string;
    time_end: string;
}

interface ManageSchedulesProps {
    branches: (Branch & { schedules: ScheduleItem[] })[];
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function ManageSchedules({ branches }: ManageSchedulesProps) {
    const { auth } = usePage<PageProps>().props;
    const [selectedBranchId, setSelectedBranchId] = useState<number | ''>(
        branches.length > 0 ? branches[0].id : ''
    );

    const [isEditing, setIsEditing] = useState(false);
    const activeBranch = branches.find(b => b.id === selectedBranchId);

    const { data, setData, post, processing, reset: resetForm } = useForm({
        schedules: [] as ScheduleItem[]
    });

    // Update form when branch changes or entering edit mode
    const handleBranchChange = (id: number) => {
        setSelectedBranchId(id);
        setIsEditing(false);
    };

    const startEditing = () => {
        if (activeBranch) {
            setData('schedules', activeBranch.schedules.map(s => ({
                day: s.day,
                time_start: s.time_start.substring(0, 5),
                time_end: s.time_end.substring(0, 5),
            })));
            setIsEditing(true);
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
        resetForm();
    };

    const addScheduleRow = () => {
        setData('schedules', [
            ...data.schedules,
            { day: 'Senin', time_start: '09:00', time_end: '17:00' }
        ]);
    };

    const removeScheduleRow = (index: number) => {
        const newSchedules = [...data.schedules];
        newSchedules.splice(index, 1);
        setData('schedules', newSchedules);
    };

    const updateScheduleRow = (index: number, field: keyof ScheduleItem, value: string) => {
        const newSchedules = [...data.schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setData('schedules', newSchedules);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedBranchId) {
            post(route('schedules.sync', selectedBranchId), {
                onSuccess: () => setIsEditing(false),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Schedules" />

            <div className="max-w-7xl mx-auto pb-12">
                <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-[#ad2c90]" />
                                    Branch Schedule Management
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Set open days and hours for Longevitology branches
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {auth.user.role?.name === 'superadmin' && (
                            <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Select Branch to Manage
                                </label>
                                <select
                                    value={selectedBranchId}
                                    onChange={(e) => handleBranchChange(Number(e.target.value))}
                                    className="w-full max-w-md rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                >
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {!selectedBranchId ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                {auth.user.role?.name === 'admin'
                                    ? "You are not assigned to any branch yet. Please contact a Superadmin."
                                    : "Please select a branch above to manage its schedule."}
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6 flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Schedule for <span className="text-[#ad2c90]">{activeBranch?.name}</span>
                                    </h3>
                                    {!isEditing && (
                                        <Button
                                            onClick={startEditing}
                                            className="bg-[#ad2c90] hover:bg-[#9c2782]"
                                        >
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit Schedule
                                        </Button>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <div className="bg-gray-50 dark:bg-slate-800/30 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-sm uppercase">
                                                    <th className="px-6 py-3 font-semibold">Day</th>
                                                    <th className="px-6 py-3 font-semibold">Timing</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {activeBranch?.schedules.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                                                            No schedules set for this branch. Click Edit to add.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    activeBranch?.schedules.map((sched, idx) => (
                                                        <tr key={idx} className="hover:bg-white dark:hover:bg-slate-800/50 transition-colors">
                                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{sched.day}</td>
                                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                                {sched.time_start.substring(0, 5)} - {sched.time_end.substring(0, 5)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4 flex justify-between items-center">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                You are currently editing schedules. Add or remove rows as needed.
                                            </p>
                                            <Button
                                                type="button"
                                                onClick={addScheduleRow}
                                                variant="outline"
                                                className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800"
                                            >
                                                <Plus className="w-4 h-4 mr-1" /> Add Day
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {data.schedules.map((row, index) => (
                                                <div key={index} className="flex flex-wrap items-end gap-4 p-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="flex-1 min-w-[150px]">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Day</label>
                                                        <select
                                                            value={row.day}
                                                            onChange={(e) => updateScheduleRow(index, 'day', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-white text-sm"
                                                        >
                                                            {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex-1 min-w-[120px]">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Opens at</label>
                                                        <input
                                                            type="time"
                                                            value={row.time_start}
                                                            onChange={(e) => updateScheduleRow(index, 'time_start', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-white text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[120px]">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Closes at</label>
                                                        <input
                                                            type="time"
                                                            value={row.time_end}
                                                            onChange={(e) => updateScheduleRow(index, 'time_end', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-white text-sm"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeScheduleRow(index)}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                                            <Button
                                                type="button"
                                                onClick={cancelEditing}
                                                variant="outline"
                                                className="px-6"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-gradient-to-r from-[#ad2c90] to-[#5400d4] px-8"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
