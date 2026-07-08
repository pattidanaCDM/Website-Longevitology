import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { PageProps, Therapist, Branch } from "@/types";
import { Button } from "@/Components/ui/button";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import SearchableSelect from "@/Components/SearchableSelect";
import { format } from "date-fns";
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle,
    Trash2,
} from "lucide-react";

interface Attendance {
    id: number;
    therapist: Therapist;
    check_in: string;
    check_out: string | null;
    branch: Branch;
}

interface Props {
    attendances: Attendance[];
    branches?: Branch[];
    availableTherapists?: Therapist[];
    currentBranchId?: number;
}

export default function TherapistAttendanceIndex({ attendances, branches, availableTherapists = [], currentBranchId }: Props) {
    const { auth } = usePage<PageProps>().props;
    const isSuperadmin = auth.user.role?.name === 'superadmin';

    const { data, setData, post, processing, errors, reset } = useForm({
        therapist_id: null as number | null,
        branch_id: currentBranchId ? currentBranchId.toString() : "",
    });



    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("attendance.therapists.store"), {
            onSuccess: () => reset("therapist_id"),
        });
    };

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBranchId = e.target.value;
        setData("branch_id", newBranchId);
        setData("therapist_id", null);
        router.get(
            route("attendance.therapists.index"),
            { branch_id: newBranchId },
            { preserveState: true, only: ["availableTherapists", "currentBranchId"] }
        );
    };

    const handleTherapistChange = (therapistId: number | string | null) => {
        setData("therapist_id", therapistId as number | null);
    };

    const handleCheckOut = (id: number) => {
        router.put(route("attendance.therapists.update", id), {
            check_out_now: true,
        });
    };



    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Therapist Attendance
                </h2>
            }
        >
            <Head title="Therapist Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Check-in Section */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                            Check In Therapist {!isSuperadmin && auth.user.branch ? `- ${auth.user.branch.name}` : ''}
                        </h3>
                        <form
                            onSubmit={handleCheckIn}
                            className="flex gap-4 items-end"
                        >
                            {isSuperadmin && branches && (
                                <div className="flex-1">
                                    <InputLabel htmlFor="branch_id">Branch</InputLabel>
                                    <select
                                        id="branch_id"
                                        value={data.branch_id}
                                        onChange={handleBranchChange}
                                        className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.branch_id && (
                                        <span className="text-red-500 text-sm">{errors.branch_id}</span>
                                    )}
                                </div>
                            )}

                            <div className="flex-1">
                                <InputLabel htmlFor="therapist_id">
                                    Therapist
                                </InputLabel>
                                <SearchableSelect
                                    options={availableTherapists.map(t => ({
                                        id: t.id,
                                        label: t.name,
                                        description: `Phone: ${t.phone}`
                                    }))}
                                    value={data.therapist_id}
                                    onChange={handleTherapistChange}
                                    placeholder={!isSuperadmin || data.branch_id ? "Select a therapist..." : "Please select a branch first"}
                                />
                                {errors.therapist_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors.therapist_id}
                                    </span>
                                )}
                            </div>

                            <Button type="submit" disabled={processing}>
                                Check In
                            </Button>
                        </form>
                    </div>

                    {/* Report / List Section */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Attendance for{" "}
                                {format(new Date(), "PPP")}
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Therapist
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Branch
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {attendances.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                No records found for this date.
                                            </td>
                                        </tr>
                                    ) : (
                                        attendances.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    <div>
                                                        In:{" "}
                                                        {format(
                                                            new Date(
                                                                record.check_in,
                                                            ),
                                                            "HH:mm",
                                                        )}
                                                    </div>
                                                    {record.check_out && (
                                                        <div className="text-gray-550 dark:text-gray-400">
                                                            Out:{" "}
                                                            {format(
                                                                new Date(
                                                                    record.check_out,
                                                                ),
                                                                "HH:mm",
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                                        {record.therapist?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {
                                                            record.therapist
                                                                ?.phone
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {record.branch?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {record.check_out ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400">
                                                            Checked In
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {!record.check_out && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleCheckOut(
                                                                    record.id,
                                                                )
                                                            }
                                                            className="mr-2"
                                                        >
                                                            Check Out
                                                        </Button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            router.delete(
                                                                route(
                                                                    "attendance.therapists.destroy",
                                                                    record.id,
                                                                ),
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 ml-2"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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
        </AuthenticatedLayout>
    );
}
