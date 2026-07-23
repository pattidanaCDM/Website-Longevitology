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
    search?: string;
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
    search: initialSearch,
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const isSuperadmin = auth.user.role?.name === 'superadmin';

    const [branchId, setBranchId] = useState<string>(currentBranchId ? currentBranchId.toString() : "");
    const [date, setDate] = useState<string>(selectedDate || "");
    const [search, setSearch] = useState<string>(initialSearch || "");

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

    const [tab, setTab] = useState<'date' | 'person'>(initialSearch ? 'person' : 'date');

    const handleFilterChange = (newBranchId: string, newDate: string, newSearch: string, currentTab: 'date' | 'person') => {
        // If we are in 'person' tab, we don't send the date filter.
        // If we are in 'date' tab, we don't send the search filter.
        router.get(
            route("attendance.archives.index"),
            { 
                branch_id: newBranchId, 
                date: currentTab === 'date' ? newDate : '', 
                search: currentTab === 'person' ? newSearch : '' 
            },
            { preserveState: true }
        );
    };

    const handleTabChange = (newTab: 'date' | 'person') => {
        setTab(newTab);
        // Clear conflicting filters when switching tabs
        if (newTab === 'date') {
            setSearch("");
            handleFilterChange(branchId, date, "", newTab);
        } else {
            setDate("");
            handleFilterChange(branchId, "", search, newTab);
        }
    };

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBranchId = e.target.value;
        setBranchId(newBranchId);
        handleFilterChange(newBranchId, date, search, tab);
    };

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        handleFilterChange(branchId, newDate, search, tab);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange(branchId, date, search, tab);
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
        setPatientData((prev: any) => ({ ...prev, date, branch_id: branchId }));
        setTherapistData((prev: any) => ({ ...prev, date, branch_id: branchId }));
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
                    Arsip Kehadiran {!isSuperadmin && auth.user.branch ? `- ${auth.user.branch.name}` : ''}
                </h2>
            }
        >
            <Head title="Arsip Kehadiran" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-200 dark:border-slate-800 mb-6 flex gap-4">
                        <button
                            onClick={() => handleTabChange('date')}
                            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                tab === 'date'
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                            }`}
                        >
                            Berdasarkan Tanggal
                        </button>
                        <button
                            onClick={() => handleTabChange('person')}
                            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                tab === 'person'
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                            }`}
                        >
                            Berdasarkan Orang
                        </button>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow">
                        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                            {tab === 'person' && (
                                <div className="flex-1">
                                    <InputLabel htmlFor="search">Cari Nama / No. HP</InputLabel>
                                    <div className="flex gap-2">
                                        <TextInput
                                            id="search"
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Ketik lalu Enter..."
                                        />
                                        <Button type="submit" className="mt-1" variant="outline">
                                            Cari
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {isSuperadmin && branches && (
                                <div className="flex-1">
                                    <InputLabel htmlFor="branch_id">Filter Cabang</InputLabel>
                                    <select
                                        id="branch_id"
                                        value={branchId}
                                        onChange={handleBranchChange}
                                        className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">Semua Cabang (Pilih untuk memfilter)</option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {tab === 'date' && (
                                <>
                                    <div className="flex-1">
                                        <InputLabel htmlFor="available_dates">Tanggal (Tersedia)</InputLabel>
                                        <select
                                            id="available_dates"
                                            value={date}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="">Pilih Tanggal</option>
                                            {availableDates.filter(d => d).map((d) => (
                                                <option key={d} value={d}>
                                                    {format(new Date(d), "PPP")}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-1">
                                        <InputLabel htmlFor="custom_date">Atau Tanggal Spesifik</InputLabel>
                                        <input
                                            type="date"
                                            id="custom_date"
                                            value={date}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                    </div>
                                </>
                            )}
                        </form>
                    </div>

                    {/* Patient Attendance Section */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Kehadiran Pasien {tab === 'date' ? (date ? `untuk ${format(new Date(date), "PPP")}` : '(Pilih tanggal)') : '(Berdasarkan Pencarian)'}
                            </h3>
                            {((date && branchId) || (tab === 'person' && search && (isSuperadmin ? branchId : true))) && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {
                                            window.location.href = route('attendance.archives.patients.export.excel', { branch_id: branchId, date: tab === 'date' ? date : '', search: tab === 'person' ? search : '' });
                                        }}
                                        variant="outline"
                                        className="flex items-center gap-2 dark:border-slate-800 dark:text-gray-200 dark:hover:bg-slate-800"
                                    >
                                        Ekspor Excel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            window.open(route('attendance.archives.patients.export.pdf', { branch_id: branchId, date: tab === 'date' ? date : '', search: tab === 'person' ? search : '' }), '_blank');
                                        }}
                                        variant="outline"
                                        className="flex items-center gap-2 dark:border-slate-800 dark:text-gray-200 dark:hover:bg-slate-800"
                                    >
                                        Ekspor PDF
                                    </Button>
                                    {tab === 'date' && date && branchId && (
                                        <PrimaryButton onClick={() => setShowLatePatientModal(true)}>
                                            Tambah Check-In Pasien Terlambat
                                        </PrimaryButton>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waktu</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pasien</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Keluhan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Terapis</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {patientAttendances.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                Tidak ada catatan pasien ditemukan untuk tanggal ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        patientAttendances.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    <div>Masuk: {format(new Date(record.check_in), "HH:mm")}</div>
                                                    {record.check_out && (
                                                        <div className="text-gray-550 dark:text-gray-400">
                                                            Keluar: {format(new Date(record.check_out), "HH:mm")}
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
                                                                Selesai
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400">
                                                                Sudah Check In
                                                            </span>
                                                        )}
                                                    </div>
                                                    {record.is_manual ? (
                                                        <div>
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400">
                                                                Check-in Terlambat oleh Admin
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
                                                    <button onClick={() => router.delete(route("attendance.patients.destroy", record.id))} className="text-red-600 hover:text-red-900 ml-2" title="Hapus Catatan">
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
                                Kehadiran Terapis {tab === 'date' ? (date ? `untuk ${format(new Date(date), "PPP")}` : '(Pilih tanggal)') : '(Berdasarkan Pencarian)'}
                            </h3>
                            {((date && branchId) || (tab === 'person' && search && (isSuperadmin ? branchId : true))) && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {
                                            window.location.href = route('attendance.archives.therapists.export.excel', { branch_id: branchId, date: tab === 'date' ? date : '', search: tab === 'person' ? search : '' });
                                        }}
                                        variant="outline"
                                        className="flex items-center gap-2 dark:border-slate-800 dark:text-gray-200 dark:hover:bg-slate-800"
                                    >
                                        Ekspor Excel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            window.open(route('attendance.archives.therapists.export.pdf', { branch_id: branchId, date: tab === 'date' ? date : '', search: tab === 'person' ? search : '' }), '_blank');
                                        }}
                                        variant="outline"
                                        className="flex items-center gap-2 dark:border-slate-800 dark:text-gray-200 dark:hover:bg-slate-800"
                                    >
                                        Ekspor PDF
                                    </Button>
                                    {tab === 'date' && date && branchId && (
                                        <PrimaryButton onClick={() => setShowLateTherapistModal(true)}>
                                            Tambah Check-In Terapis Terlambat
                                        </PrimaryButton>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waktu</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Terapis</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {therapistAttendances.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                Tidak ada catatan terapis ditemukan untuk tanggal ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        therapistAttendances.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    <div>Masuk: {format(new Date(record.check_in), "HH:mm")}</div>
                                                    {record.check_out && (
                                                        <div className="text-gray-550 dark:text-gray-400">
                                                            Keluar: {format(new Date(record.check_out), "HH:mm")}
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
                                                                Selesai
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400">
                                                                Sudah Check In
                                                            </span>
                                                        )}
                                                    </div>
                                                    {record.is_manual ? (
                                                        <div>
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400">
                                                                Check-in Terlambat oleh Admin
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
                                                    <button onClick={() => router.delete(route("attendance.therapists.destroy", record.id))} className="text-red-600 hover:text-red-900 ml-2" title="Hapus Catatan">
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
                        Tambah Check-In Pasien Terlambat untuk {date && format(new Date(date), "PPP")}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="patient_id">Pasien <span className="text-red-500">*</span></InputLabel>
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
                                placeholder="Pilih pasien..."
                            />
                            <InputError message={patientErrors.patient_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel>Terapis <span className="text-red-500">*</span></InputLabel>
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
                                placeholder="Pilih terapis..."
                            />
                            <InputError message={patientErrors.therapist_ids} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="patient_check_in_time">Waktu Check-In <span className="text-red-500">*</span></InputLabel>
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
                                <InputLabel htmlFor="patient_check_out_time">Waktu Check-Out <span className="text-red-500">*</span></InputLabel>
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
                            <InputLabel htmlFor="complaint">Keluhan Saat Ini <span className="text-red-500">*</span></InputLabel>
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
                        <SecondaryButton onClick={() => setShowLatePatientModal(false)}>Batal</SecondaryButton>
                        <PrimaryButton type="submit" className="ml-3" disabled={processingPatient}>
                            Tambah Catatan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={showLateTherapistModal} onClose={() => setShowLateTherapistModal(false)}>
                <form onSubmit={submitLateTherapist} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tambah Check-In Terapis Terlambat untuk {date && format(new Date(date), "PPP")}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="therapist_id">Terapis <span className="text-red-500">*</span></InputLabel>
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
                                placeholder="Pilih terapis..."
                            />
                            <InputError message={therapistErrors.therapist_id} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="therapist_check_in_time">Waktu Check-In <span className="text-red-500">*</span></InputLabel>
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
                                <InputLabel htmlFor="therapist_check_out_time">Waktu Check-Out <span className="text-red-500">*</span></InputLabel>
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
                        <SecondaryButton onClick={() => setShowLateTherapistModal(false)}>Batal</SecondaryButton>
                        <PrimaryButton type="submit" className="ml-3" disabled={processingTherapist}>
                            Tambah Catatan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
