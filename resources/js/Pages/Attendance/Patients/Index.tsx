import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps, Branch, Therapist } from "@/types";
import { Button } from "@/Components/ui/button";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
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
    date: string;
    therapists: Therapist[];
}

export default function PatientAttendanceIndex({
    attendances,
    date,
    therapists,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_identifier: "",
        therapist_ids: [] as number[],
        complaint: "",
    });

    const [selectedDate, setSelectedDate] = useState(date);
    const [foundPatient, setFoundPatient] = useState<{
        name: string;
        current_complaint?: string;
    } | null>(null);

    // Edit Therapist State
    const [editingAttendance, setEditingAttendance] =
        useState<Attendance | null>(null);
    const [editTherapistIds, setEditTherapistIds] = useState<number[]>([]);

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("attendance.patients.store"), {
            onSuccess: () => {
                reset("patient_identifier", "therapist_ids", "complaint");
                setFoundPatient(null);
            },
        });
    };

    const handlePatientLookup = async () => {
        if (!data.patient_identifier || data.patient_identifier.length < 3)
            return;

        try {
            // Using existing verify route.
            // Note: In strict React+Inertia, using axios directly is fine for async fetches that don't change page state
            const response = await axios.post(route("patients.verify"), {
                search: data.patient_identifier,
            });
            const patient = response.data.patient;

            if (patient) {
                setFoundPatient(patient);
                // Pre-fill with current_complaint, falling back to initial_complaint
                setData(
                    "complaint",
                    patient.current_complaint ||
                        patient.initial_complaint ||
                        "",
                );
            } else {
                setFoundPatient(null);
                setData("complaint", "");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckOut = (id: number) => {
        router.put(route("attendance.patients.update", id), {
            check_out_now: true,
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get(
            route("attendance.patients.index"),
            { date: newDate },
            { preserveState: true },
        );
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
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Patient Attendance
                </h2>
            }
        >
            <Head title="Patient Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Check-in Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4">
                            Check In Patient
                        </h3>
                        <form onSubmit={handleCheckIn} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="patient_identifier">
                                    Card Number or Phone
                                </InputLabel>
                                <TextInput
                                    id="patient_identifier"
                                    value={data.patient_identifier}
                                    onChange={(e) =>
                                        setData(
                                            "patient_identifier",
                                            e.target.value,
                                        )
                                    }
                                    onBlur={handlePatientLookup}
                                    placeholder="Enter card number or phone..."
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.patient_identifier && (
                                    <span className="text-red-500 text-sm">
                                        {errors.patient_identifier}
                                    </span>
                                )}
                                {foundPatient && (
                                    <div className="mt-2 p-2 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-700">
                                        Found Patient:{" "}
                                        <strong>{foundPatient.name}</strong>
                                    </div>
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                            className={`p-2 border rounded cursor-pointer transition-colors ${data.therapist_ids.includes(therapist.id) ? "bg-indigo-100 border-indigo-500" : "hover:bg-gray-50"}`}
                                            onClick={() =>
                                                toggleTherapist(therapist.id)
                                            }
                                        >
                                            <div className="font-medium text-sm">
                                                {therapist.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
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
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                            <h3 className="text-lg font-medium">
                                Attendance for{" "}
                                {format(new Date(selectedDate), "PPP")}
                            </h3>

                            <div className="flex items-center space-x-2">
                                <a
                                    href={route(
                                        "attendance.patients.export.excel",
                                        { date: selectedDate },
                                    )}
                                    className="inline-flex items-center px-3 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-500 focus:bg-emerald-700 active:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Export Excel
                                </a>
                                <a
                                    href={route(
                                        "attendance.patients.export.pdf",
                                        { date: selectedDate },
                                    )}
                                    target="_blank"
                                    className="inline-flex items-center px-3 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Export PDF
                                </a>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Complaint
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Therapists
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendances.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                No records found for this date.
                                            </td>
                                        </tr>
                                    ) : (
                                        attendances.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                                                        <div className="text-gray-500">
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
                                                    <div className="font-medium text-gray-900">
                                                        {record.patient?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {record.patient
                                                            ?.card_number ||
                                                            "-"}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"
                                                    title={
                                                        record.complaint || ""
                                                    }
                                                >
                                                    {record.complaint || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {record.therapists
                                                        ?.map((t) => t.name)
                                                        .join(", ")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {record.check_out ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
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
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Edit Therapists for {editingAttendance?.patient.name}
                    </h2>

                    <div className="mb-4 text-sm text-gray-600">
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
                                className={`p-2 border rounded cursor-pointer transition-colors ${editTherapistIds.includes(therapist.id) ? "bg-indigo-100 border-indigo-500" : "hover:bg-gray-50"}`}
                                onClick={() =>
                                    toggleEditTherapist(therapist.id)
                                }
                            >
                                <div className="font-medium text-sm">
                                    {therapist.name}
                                </div>
                                <div className="text-xs text-gray-500">
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
