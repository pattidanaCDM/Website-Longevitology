import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { PageProps, Branch, Therapist } from "@/types";
import { Button } from "@/Components/ui/button";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SearchableSelect from "@/Components/SearchableSelect";
import { format } from "date-fns";
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle,
    Trash2,
    Edit,
    UserPlus,
} from "lucide-react";
import axios from "axios";

interface Patient {
    id: number;
    name: string;
    phone?: string;
    card_number?: string; // Add optional card_number
    initial_complaint?: string;
    current_complaint?: string;
}

interface Attendance {
    id: number;
    patient: Patient;
    complaint?: string;
    check_in: string;
    check_out: string | null;
    therapists: Therapist[];
    branch: Branch;
}

interface Props {
    attendances: Attendance[];
    therapists: Therapist[];
    branches?: Branch[];
    availablePatients?: Patient[];
    currentBranchId?: number;
}

export default function PatientAttendanceIndex({
    attendances,
    therapists,
    branches,
    availablePatients = [],
    currentBranchId,
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const isSuperadmin = auth.user.role?.name === 'superadmin';

    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: null as number | null,
        therapist_ids: [] as number[],
        complaint: "",
        branch_id: currentBranchId ? currentBranchId.toString() : "",
    });



    // Edit Therapist State
    const [editingAttendance, setEditingAttendance] =
        useState<Attendance | null>(null);
    const [editTherapistIds, setEditTherapistIds] = useState<number[]>([]);

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("attendance.patients.store"), {
            onSuccess: () => {
                reset("patient_id", "therapist_ids", "complaint");
            },
        });
    };

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBranchId = e.target.value;
        setData("branch_id", newBranchId);
        setData("patient_id", null);
        setData("complaint", "");
        router.get(
            route("attendance.patients.index"),
            { branch_id: newBranchId },
            { preserveState: true, only: ["availablePatients", "currentBranchId"] }
        );
    };

    const handlePatientChange = (patientId: number | string | null) => {
        setData("patient_id", patientId as number | null);
        if (patientId) {
            const patient = availablePatients.find(p => p.id === patientId);
            if (patient) {
                setData("complaint", patient.current_complaint || patient.initial_complaint || "");
            }
        } else {
            setData("complaint", "");
        }
    };

    const handleCheckOut = (id: number) => {
        router.put(route("attendance.patients.update", id), {
            check_out_now: true,
        });
    };


    const toggleTherapist = (id: number) => {
        if (data.therapist_ids.includes(id)) {
            setData(
                "therapist_ids",
                data.therapist_ids.filter((tid) => tid !== id),
            );
        } else {
            setData("therapist_ids", [...data.therapist_ids, id]);
        }
    };

    // Edit Modal Functions
    const openEditModal = (attendance: Attendance) => {
        setEditingAttendance(attendance);
        setEditTherapistIds(attendance.therapists.map((t) => t.id));
    };

    const closeEditModal = () => {
        setEditingAttendance(null);
        setEditTherapistIds([]);
    };

    const toggleEditTherapist = (id: number) => {
        if (editTherapistIds.includes(id)) {
            setEditTherapistIds((prev) => prev.filter((tid) => tid !== id));
        } else {
            setEditTherapistIds((prev) => [...prev, id]);
        }
    };

    const saveTherapists = () => {
        if (!editingAttendance) return;

        router.put(
            route("attendance.patients.update", editingAttendance.id),
            {
                therapist_ids: editTherapistIds,
            },
            {
                onSuccess: () => closeEditModal(),
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Patient Attendance
                </h2>
            }
        >
            <Head title="Patient Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Check-in Section */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                            Check In Patient {!isSuperadmin && auth.user.branch ? `- ${auth.user.branch.name}` : ''}
                        </h3>
                        <form onSubmit={handleCheckIn} className="space-y-4">
                            {isSuperadmin && branches && (
                                <div>
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

                            <div>
                                <InputLabel htmlFor="patient_id">
                                    Patient
                                </InputLabel>
                                <SearchableSelect
                                    options={availablePatients.map(p => ({
                                        id: p.id,
                                        label: p.name,
                                        description: p.card_number ? `Card: ${p.card_number} | Phone: ${p.phone}` : `Phone: ${p.phone}`
                                    }))}
                                    value={data.patient_id}
                                    onChange={handlePatientChange}
                                    placeholder={!isSuperadmin || data.branch_id ? "Select a patient..." : "Please select a branch first"}
                                />
                                {errors.patient_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors.patient_id}
                                    </span>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="complaint">
                                    Current Complaint (Optional)
                                </InputLabel>
                                <textarea
                                    id="complaint"
                                    value={data.complaint}
                                    onChange={(e) =>
                                        setData("complaint", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={2}
                                    placeholder="Update complaint if changed..."
                                />
                                {errors.complaint && (
                                    <span className="text-red-500 text-sm">
                                        {errors.complaint}
                                    </span>
                                )}
                            </div>

                            <div>
                                <InputLabel className="mb-2 block">
                                    Select Therapists (Optional)
                                </InputLabel>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {therapists.map((therapist) => (
                                        <div
                                            key={therapist.id}
                                            className={`p-2 border rounded cursor-pointer transition-colors border-gray-200 dark:border-slate-800 ${data.therapist_ids.includes(therapist.id) ? "bg-indigo-100 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100" : "text-gray-750 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`}
                                            onClick={() =>
                                                toggleTherapist(therapist.id)
                                            }
                                        >
                                            <div className="font-medium text-sm">
                                                {therapist.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {therapist.phone}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.therapist_ids && (
                                    <span className="text-red-500 text-sm">
                                        {errors.therapist_ids}
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
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Attendance for{" "}
                                {format(new Date(), "PPP")}
                            </h3>

                            <div className="flex items-center space-x-2">
                                <a
                                    href={route(
                                        "attendance.patients.export.excel",
                                        { date: format(new Date(), "yyyy-MM-dd") },
                                    )}
                                    className="inline-flex items-center px-3 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-500 focus:bg-emerald-700 active:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Export Excel
                                </a>
                                <a
                                    href={route(
                                        "attendance.patients.export.pdf",
                                        { date: format(new Date(), "yyyy-MM-dd") },
                                    )}
                                    target="_blank"
                                    className="inline-flex items-center px-3 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Export PDF
                                </a>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Complaint
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Therapists
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
                                                colSpan={7}
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
                                                        {record.patient?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {record.patient
                                                            ?.card_number ||
                                                            "-"}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate"
                                                    title={
                                                        record.complaint || ""
                                                    }
                                                >
                                                    {record.complaint || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {record.therapists
                                                        ?.map((t) => t.name)
                                                        .join(", ")}
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
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEditModal(
                                                                record,
                                                            )
                                                        }
                                                        className="mr-2"
                                                        title="Edit Therapists"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                    </Button>
                                                    <button
                                                        onClick={() =>
                                                            router.delete(
                                                                route(
                                                                    "attendance.patients.destroy",
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

            <Modal
                show={!!editingAttendance}
                onClose={closeEditModal}
                maxWidth="2xl"
            >
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Edit Therapists for {editingAttendance?.patient.name}
                    </h2>

                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Check-in Time:{" "}
                        {editingAttendance &&
                            format(
                                new Date(editingAttendance.check_in),
                                "PPP p",
                            )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-1">
                        {therapists.map((therapist) => (
                            <div
                                key={therapist.id}
                                className={`p-2 border rounded cursor-pointer transition-colors border-gray-200 dark:border-slate-800 ${editTherapistIds.includes(therapist.id) ? "bg-indigo-100 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`}
                                onClick={() =>
                                    toggleEditTherapist(therapist.id)
                                }
                            >
                                <div className="font-medium text-sm">
                                    {therapist.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {therapist.phone}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <SecondaryButton onClick={closeEditModal}>
                            Cancel
                        </SecondaryButton>
                        <Button onClick={saveTherapists}>Save Changes</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
