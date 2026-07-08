import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import { Trash2 } from "lucide-react";
import InputLabel from "@/Components/InputLabel";
import { PageProps, Branch, User, Patient, Therapist } from "@/types";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import SearchableSelect from "@/Components/SearchableSelect";
import MultiSelectSearch from "@/Components/MultiSelectSearch";
import InputError from "@/Components/InputError";

interface Attendance {
    id: number;
    check_in: string;
    check_out: string | null;
    branch: Branch;
    patient?: {
        name: string;
        card_number?: string;
    };
    complaint?: string;
    therapists?: { id: number; name: string }[];
    therapist?: {
        name: string;
    };
    is_manual?: boolean;
}

interface Props {
    patientAttendances: Attendance[];
    therapistAttendances: Attendance[];
    availableDates: string[];
    selectedDate?: string;
    branches?: Branch[];
    currentBranchId?: number;
    availablePatients?: Patient[];
    availableTherapists?: Therapist[];
    allTherapists?: Therapist[];
}

export default function AttendanceArchiveIndex({
    patientAttendances,
    therapistAttendances,
    availableDates,
    selectedDate,
    branches,
    currentBranchId,
    availablePatients,
    availableTherapists,
    allTherapists,
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const isSuperadmin = auth.user.role?.name === 'superadmin';

    const [branchId, setBranchId] = useState<string>(currentBranchId ? currentBranchId.toString() : "");
    const [date, setDate] = useState<string>(selectedDate || "");

    const [showLatePatientModal, setShowLatePatientModal] = useState(false);
    const [showLateTherapistModal, setShowLateTherapistModal] = useState(false);

    const {
        data: patientData,
        setData: setPatientData,
        post: postPatient,
        processing: processingPatient,
        errors: patientErrors,
        reset: resetPatient,
        clearErrors: clearPatientErrors,
    } = useForm({
        date: date,
        patient_id: null as number | null,
        branch_id: branchId,
        therapist_ids: [] as number[],
        check_in_time: "",
        check_out_time: "",
        complaint: "",
    });

    const {
        data: therapistData,
        setData: setTherapistData,
        post: postTherapist,
        processing: processingTherapist,
        errors: therapistErrors,
        reset: resetTherapist,
        clearErrors: clearTherapistErrors,
    } = useForm({
        date: date,
        therapist_id: null as number | null,
        branch_id: branchId,
        check_in_time: "",
        check_out_time: "",
    });

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBranchId = e.target.value;
        setBranchId(newBranchId);
        router.get(
            route("attendance.archives.index"),
            { branch_id: newBranchId, date },
            { preserveState: true }
        );
    };

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        router.get(
            route("attendance.archives.index"),
            { branch_id: branchId, date: newDate },
            { preserveState: true }
        );
    };

    const handleCheckOutPatient = (id: number) => {
        router.put(route("attendance.patients.update", id), {
            check_out_now: true,
        });
    };

    const handleCheckOutTherapist = (id: number) => {
        router.put(route("attendance.therapists.update", id), {
            check_out_now: true,
        });
    };

    useEffect(() => {
        setPatientData((prev) => ({ ...prev, date, branch_id: branchId }));
        setTherapistData((prev) => ({ ...prev, date, branch_id: branchId }));
    }, [date, branchId]);

    const submitLatePatient = (e: React.FormEvent) => {
        e.preventDefault();
        postPatient(route("attendance.archives.patients.store"), {
            onSuccess: () => {
                setShowLatePatientModal(false);
                resetPatient();
            },
        });
    };

    const submitLateTherapist = (e: React.FormEvent) => {
        e.preventDefault();
        postTherapist(route("attendance.archives.therapists.store"), {
            onSuccess: () => {
                setShowLateTherapistModal(false);
                resetTherapist();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Attendance Archives {!isSuperadmin && auth.user.branch ? `- ${auth.user.branch.name}` : ''}
                </h2>
            }
        >
            <Head title="Attendance Archives" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filters Section */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            {isSuperadmin && branches && (
                                <div className="flex-1">
                                    <InputLabel htmlFor="branch_id">Filter by Branch</InputLabel>
                                    <select
                                        id="branch_id"
                                        value={branchId}
                                        onChange={handleBranchChange}
                                        className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex-1">
                                <InputLabel htmlFor="available_dates">Select Date with Attendance</InputLabel>
                                <select
                                    id="available_dates"
                                    value={date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                >
                                    <option value="" disabled>Select Date</option>
                                    {availableDates.map((d) => (
                                        <option key={d} value={d}>
                                            {format(new Date(d), "PPP")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1">
                                <InputLabel htmlFor="custom_date">Or Pick Specific Date</InputLabel>
                                <input
                                    type="date"
                                    id="custom_date"
                                    value={date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Patient Attendance Section */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Patient Attendance for {date ? format(new Date(date), "PPP") : 'Select a date'}
                            </h3>
                            {date && branchId && (
                                <PrimaryButton onClick={() => setShowLatePatientModal(true)}>
                                    Add Late Patient Check-In
                                </PrimaryButton>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Complaint</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Therapists</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {patientAttendances.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                No patient records found for this date.
                                            </td>
                                        </tr>
                                    ) : (
                                        patientAttendances.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    <div>In: {format(new Date(record.check_in), "HH:mm")}</div>
                                                    {record.check_out && (
                                                        <div className="text-gray-550 dark:text-gray-400">
                                                            Out: {format(new Date(record.check_out), "HH:mm")}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">{record.patient?.name}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{record.complaint || "-"}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {record.therapists?.map((t) => t.name).join(", ")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-y-1">
                                                    <div>
                                                        {record.check_out ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">
                                                                Completed
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400">
                                                                Checked In
                                                            </span>
                                                        )}
                                                    </div>
                                                    {record.is_manual ? (
                                                        <div>
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400">
                                                                Late Check-in by Admin
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {!record.check_out && (
                                                        <Button variant="outline" size="sm" onClick={() => handleCheckOutPatient(record.id)} className="mr-2">
                                                            Check Out
                                                        </Button>
                                                    )}
                                                    <button onClick={() => router.delete(route("attendance.patients.destroy", record.id))} className="text-red-600 hover:text-red-900 ml-2" title="Delete Record">
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

                    {/* Therapist Attendance Section */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Therapist Attendance for {date ? format(new Date(date), "PPP") : 'Select a date'}
                            </h3>
                            {date && branchId && (
                                <PrimaryButton onClick={() => setShowLateTherapistModal(true)}>
                                    Add Late Therapist Check-In
                                </PrimaryButton>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Therapist</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {therapistAttendances.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                No therapist records found for this date.
                                            </td>
                                        </tr>
                                    ) : (
                                        therapistAttendances.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    <div>In: {format(new Date(record.check_in), "HH:mm")}</div>
                                                    {record.check_out && (
                                                        <div className="text-gray-550 dark:text-gray-400">
                                                            Out: {format(new Date(record.check_out), "HH:mm")}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">{record.therapist?.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-y-1">
                                                    <div>
                                                        {record.check_out ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">
                                                                Completed
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400">
                                                                Checked In
                                                            </span>
                                                        )}
                                                    </div>
                                                    {record.is_manual ? (
                                                        <div>
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400">
                                                                Late Check-in by Admin
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {!record.check_out && (
                                                        <Button variant="outline" size="sm" onClick={() => handleCheckOutTherapist(record.id)} className="mr-2">
                                                            Check Out
                                                        </Button>
                                                    )}
                                                    <button onClick={() => router.delete(route("attendance.therapists.destroy", record.id))} className="text-red-600 hover:text-red-900 ml-2" title="Delete Record">
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

            <Modal show={showLatePatientModal} onClose={() => setShowLatePatientModal(false)}>
                <form onSubmit={submitLatePatient} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Add Late Patient Check-In for {date && format(new Date(date), "PPP")}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="patient_id">Patient <span className="text-red-500">*</span></InputLabel>
                            <SearchableSelect
                                options={availablePatients?.map((p: Patient) => ({
                                    id: p.id.toString(),
                                    label: `${p.name} ${p.phone ? `(${p.phone})` : ''}`
                                })) || []}
                                value={patientData.patient_id?.toString() || ""}
                                onChange={(val) => {
                                    const selectedId = val ? Number(val) : null;
                                    const selectedPatient = val ? availablePatients?.find(p => p.id === selectedId) : null;
                                    setPatientData(prev => ({
                                        ...prev,
                                        patient_id: selectedId,
                                        complaint: selectedPatient ? (selectedPatient.current_complaint || selectedPatient.initial_complaint || "") : ""
                                    }));
                                    clearPatientErrors("patient_id");
                                    clearPatientErrors("complaint");
                                }}
                                placeholder="Select patient..."
                            />
                            <InputError message={patientErrors.patient_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel>Therapists <span className="text-red-500">*</span></InputLabel>
                            <MultiSelectSearch
                                options={allTherapists?.map((t: Therapist) => ({
                                    id: t.id.toString(),
                                    name: t.name
                                })) || []}
                                value={patientData.therapist_ids.map(String)}
                                onChange={(vals) => {
                                    setPatientData("therapist_ids", vals.map(Number));
                                    clearPatientErrors("therapist_ids");
                                }}
                                placeholder="Select therapists..."
                            />
                            <InputError message={patientErrors.therapist_ids} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="patient_check_in_time">Check-In Time <span className="text-red-500">*</span></InputLabel>
                                <TextInput
                                    id="patient_check_in_time"
                                    type="time"
                                    className="mt-1 block w-full"
                                    value={patientData.check_in_time}
                                    onChange={(e) => {
                                        setPatientData("check_in_time", e.target.value);
                                        clearPatientErrors("check_in_time");
                                    }}
                                />
                                <InputError message={patientErrors.check_in_time} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="patient_check_out_time">Check-Out Time <span className="text-red-500">*</span></InputLabel>
                                <TextInput
                                    id="patient_check_out_time"
                                    type="time"
                                    className="mt-1 block w-full"
                                    value={patientData.check_out_time}
                                    onChange={(e) => {
                                        setPatientData("check_out_time", e.target.value);
                                        clearPatientErrors("check_out_time");
                                    }}
                                />
                                <InputError message={patientErrors.check_out_time} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="complaint">Current Complaint <span className="text-red-500">*</span></InputLabel>
                            <TextInput
                                id="complaint"
                                type="text"
                                className="mt-1 block w-full"
                                value={patientData.complaint}
                                onChange={(e) => {
                                    setPatientData("complaint", e.target.value);
                                    clearPatientErrors("complaint");
                                }}
                            />
                            <InputError message={patientErrors.complaint} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowLatePatientModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit" className="ml-3" disabled={processingPatient}>
                            Add Record
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={showLateTherapistModal} onClose={() => setShowLateTherapistModal(false)}>
                <form onSubmit={submitLateTherapist} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Add Late Therapist Check-In for {date && format(new Date(date), "PPP")}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="therapist_id">Therapist <span className="text-red-500">*</span></InputLabel>
                            <SearchableSelect
                                options={availableTherapists?.map((t: Therapist) => ({
                                    id: t.id.toString(),
                                    label: t.name
                                })) || []}
                                value={therapistData.therapist_id?.toString() || ""}
                                onChange={(val) => {
                                    setTherapistData("therapist_id", val ? Number(val) : null);
                                    clearTherapistErrors("therapist_id");
                                }}
                                placeholder="Select therapist..."
                            />
                            <InputError message={therapistErrors.therapist_id} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="therapist_check_in_time">Check-In Time <span className="text-red-500">*</span></InputLabel>
                                <TextInput
                                    id="therapist_check_in_time"
                                    type="time"
                                    className="mt-1 block w-full"
                                    value={therapistData.check_in_time}
                                    onChange={(e) => {
                                        setTherapistData("check_in_time", e.target.value);
                                        clearTherapistErrors("check_in_time");
                                    }}
                                />
                                <InputError message={therapistErrors.check_in_time} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="therapist_check_out_time">Check-Out Time <span className="text-red-500">*</span></InputLabel>
                                <TextInput
                                    id="therapist_check_out_time"
                                    type="time"
                                    className="mt-1 block w-full"
                                    value={therapistData.check_out_time}
                                    onChange={(e) => {
                                        setTherapistData("check_out_time", e.target.value);
                                        clearTherapistErrors("check_out_time");
                                    }}
                                />
                                <InputError message={therapistErrors.check_out_time} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowLateTherapistModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit" className="ml-3" disabled={processingTherapist}>
                            Add Record
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
