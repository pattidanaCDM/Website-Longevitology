import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { Therapist, Branch, PageProps } from "@/types";
import {
    Pencil,
    Trash2,
    Plus,
    User,
    Search,
    UserCheck,
    Eye,
    X,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import SecondaryButton from "@/Components/SecondaryButton";
import MultiSelectSearch from "@/Components/MultiSelectSearch";
import axios from "axios";

interface Props {
    therapists: {
        data: Therapist[];
        links: any[];
    };
    branches: Branch[];
    filters?: {
        search?: string;
        branch_id?: string;
    };
}

export default function TherapistIndex({ therapists, branches, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const isSuperadmin = auth.user.role?.name === "superadmin";

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [assignToAll, setAssignToAll] = useState(false);
    const [selectedTherapist, setSelectedTherapist] =
        useState<Therapist | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState(filters?.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("therapists.index"),
            { 
                search: searchQuery, 
                branch_id: new URLSearchParams(window.location.search).get('branch_id') || "all" 
            },
            { preserveState: true }
        );
    };

    // Delete State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [therapistToDelete, setTherapistToDelete] =
        useState<Therapist | null>(null);
    const [deleteDetails, setDeleteDetails] = useState({
        type: "branch" as "branch" | "global",
        branch_id: "",
    });

    const openDelete = (therapist: Therapist) => {
        setTherapistToDelete(therapist);
        setDeleteDetails({ type: "branch", branch_id: "" });
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!therapistToDelete) return;

        router.delete(
            route("therapists.destroy", {
                therapist: therapistToDelete.id,
                type: deleteDetails.type,
                branch_id: deleteDetails.branch_id,
            }),
            {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setTherapistToDelete(null);
                },
            },
        );
    };

    // Verified Therapist State
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifySearch, setVerifySearch] = useState("");
    const [verifiedTherapist, setVerifiedTherapist] =
        useState<Therapist | null>(null);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verifyError, setVerifyError] = useState("");

    const verifyTherapist = async () => {
        setVerifyLoading(true);
        setVerifyError("");
        setVerifiedTherapist(null);
        try {
            const response = await axios.post(route("therapists.verify"), {
                search: verifySearch,
            });
            if (response.data.therapist) {
                setVerifiedTherapist(response.data.therapist);
            } else {
                setVerifyError(
                    "Therapist not found with that phone number or card number.",
                );
            }
        } catch (error) {
            setVerifyError("An error occurred while searching.");
            console.error(error);
        } finally {
            setVerifyLoading(false);
        }
    };

    const extendTherapist = () => {
        if (!verifiedTherapist) return;

        const branchId = new URLSearchParams(window.location.search).get('branch_id');
        const payload: any = { therapist_id: verifiedTherapist.id };

        if (isSuperadmin && branchId && branchId !== 'all') {
            payload.branch_id = branchId;
        }

        router.post(
            route("therapists.extend"),
            payload,
            {
                onSuccess: () => {
                    setShowVerifyModal(false);
                    setVerifiedTherapist(null);
                    setVerifySearch("");
                },
            },
        );
    };

    const bIdParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("branch_id") : null;
    const targetBranchId = isSuperadmin
        ? (bIdParam && bIdParam !== "all" ? Number(bIdParam) : null)
        : auth.user.branch_id;
    const isAlreadyInBranch = verifiedTherapist && targetBranchId
        ? verifiedTherapist.branches?.some((b: any) => b.id === targetBranchId)
        : false;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        gender: "",
        birth_date: "",
        phone: "",
        address: "",
        photo: null as File | null,
        branch_id: isSuperadmin ? ([] as string[]) : (auth.user.branch_id || ""),
        _method: undefined as string | undefined, // For method spoofing
    });

    const openEdit = (therapist: Therapist) => {
        setSelectedTherapist(therapist);
        // Ensure date is YYYY-MM-DD for input type="date"
        const formattedDate = therapist.birth_date
            ? new Date(therapist.birth_date).toISOString().split("T")[0]
            : "";

        setData({
            name: therapist.name,
            gender: therapist.gender,
            birth_date: formattedDate,
            phone: therapist.phone || "",
            address: therapist.address || "",
            photo: null,
            branch_id: isSuperadmin ? (therapist.branches?.map(b => b.id.toString()) || []) : "",
            _method: "put",
        });
        setAssignToAll(false);
        setShowEditModal(true);
    };

    const openView = async (therapist: Therapist) => {
        try {
            const response = await axios.get(
                route("therapists.show", therapist.id),
            );
            setSelectedTherapist(response.data);
            setShowViewModal(true);
        } catch (error) {
            console.error("Failed to fetch therapist details", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (showEditModal && selectedTherapist) {
            // Use POST with _method: put to handle file uploads
            post(route("therapists.update", selectedTherapist.id), {
                onSuccess: () => {
                    setShowEditModal(false);
                    reset();
                },
            });
        } else {
            post(route("therapists.store"), {
                onSuccess: () => {
                    setShowAddModal(false);
                    setAssignToAll(false);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Manage Therapists
                </h2>
            }
        >
            <Head title="Therapists" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Therapist List
                                </h3>
                                {isSuperadmin && (
                                    <select
                                        className="rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm shadow-sm dark:text-gray-200"
                                        value={new URLSearchParams(window.location.search).get('branch_id') || "all"}
                                        onChange={(e) => {
                                            router.get(route('therapists.index'), { branch_id: e.target.value }, { preserveState: true });
                                        }}
                                    >
                                        <option value="all">Semua Cabang</option>
                                        {branches.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                )}
                                <form onSubmit={handleSearch} className="flex gap-2 relative">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search name/phone..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                if (e.target.value === "") {
                                                    router.get(
                                                        route("therapists.index"),
                                                        { 
                                                            search: "", 
                                                            branch_id: new URLSearchParams(window.location.search).get('branch_id') || "all" 
                                                        },
                                                        { preserveState: true }
                                                    );
                                                }
                                            }}
                                            className="rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm shadow-sm dark:text-gray-200 pr-8"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    router.get(
                                                        route("therapists.index"),
                                                        { 
                                                            search: "", 
                                                            branch_id: new URLSearchParams(window.location.search).get('branch_id') || "all" 
                                                        },
                                                        { preserveState: true }
                                                    );
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <Button type="submit" variant="secondary" className="px-3 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600">
                                        <Search className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                            <div className="flex gap-2">
                                {(!isSuperadmin || (new URLSearchParams(window.location.search).get('branch_id') && new URLSearchParams(window.location.search).get('branch_id') !== 'all')) && (
                                    <Button
                                        onClick={() => setShowVerifyModal(true)}
                                        variant="outline"
                                        className="flex items-center gap-2 dark:border-slate-800 dark:text-gray-200 dark:hover:bg-slate-800"
                                    >
                                        <UserCheck className="w-4 h-4" /> Verify / Add Existing
                                    </Button>
                                )}
                                <Button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add New
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Branch
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {therapists.data.map((therapist) => (
                                        <tr key={therapist.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {therapist.photo ? (
                                                    <img
                                                        src={`/storage/${therapist.photo}`}
                                                        alt={therapist.name}
                                                        className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80"
                                                        onClick={() =>
                                                            setSelectedPhoto(
                                                                `/storage/${therapist.photo}`,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                        <User className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-0">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                            {therapist.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {therapist.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-500 dark:text-gray-400">
                                                {therapist.gender}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {therapist.phone}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate"
                                                title={therapist.branches?.map((b) => b.name).join(", ")}
                                            >
                                                {therapist.branches
                                                    ?.map((b) => b.name)
                                                    .join(", ")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openView(therapist)
                                                        }
                                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openEdit(therapist)
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openDelete(
                                                                therapist,
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        title="Delete"
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
                </div>
            </div>
            {/* Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto relative">
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => {
                                setShowAddModal(false);
                                setShowEditModal(false);
                                reset();
                            }}
                        >
                            ✖
                        </div>
                        <h2 className="text-lg font-bold mb-4 dark:text-white">
                            {showEditModal
                                ? "Edit Therapist"
                                : "Add New Therapist"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData("name", e.target.value);
                                        clearErrors("name");
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Gender <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.gender || ""}
                                        onChange={(e) => {
                                            setData("gender", e.target.value);
                                            clearErrors("gender");
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.gender}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Birth Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => {
                                            setData("birth_date", e.target.value);
                                            clearErrors("birth_date");
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.birth_date && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.birth_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => {
                                        setData("phone", e.target.value);
                                        clearErrors("phone");
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => {
                                        setData("address", e.target.value);
                                        clearErrors("address");
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Photo
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        setData(
                                            "photo",
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        );
                                        clearErrors("photo");
                                    }}
                                    className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                                />
                                {errors.photo && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.photo}
                                    </p>
                                )}

                                {/* Photo Preview inside Form */}
                                {(data.photo ||
                                    (showEditModal &&
                                        selectedTherapist?.photo)) && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Preview:
                                            </p>
                                            <div className="relative inline-block group">
                                                <img
                                                    src={
                                                        data.photo
                                                            ? URL.createObjectURL(
                                                                data.photo,
                                                            )
                                                            : selectedTherapist?.photo
                                                                ? `/storage/${selectedTherapist.photo}`
                                                                : ""
                                                    }
                                                    alt="Preview"
                                                    className="h-20 w-20 rounded-full object-cover border border-gray-200 dark:border-slate-800"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => {
                                                        const src = data.photo
                                                            ? URL.createObjectURL(
                                                                data.photo,
                                                            )
                                                            : selectedTherapist?.photo
                                                                ? `/storage/${selectedTherapist.photo}`
                                                                : "";
                                                        setSelectedPhoto(src);
                                                    }}
                                                >
                                                    <span className="text-white text-xs font-bold">
                                                        View
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* Show branch assignment for Superadmin (Create and Edit) */}
                            {isSuperadmin && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Assign to Branch <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm dark:text-gray-300">
                                            <input
                                                type="radio"
                                                checked={!assignToAll}
                                                onChange={() => {
                                                    setAssignToAll(false);
                                                    setData("branch_id", []);
                                                }}
                                            />
                                            Specific Branches
                                        </label>
                                        <label className="flex items-center gap-2 text-sm dark:text-gray-300">
                                            <input
                                                type="radio"
                                                checked={assignToAll}
                                                onChange={() => {
                                                    setAssignToAll(true);
                                                    setData("branch_id", branches.map(b => b.id.toString()));
                                                }}
                                            />
                                            All Branches
                                        </label>
                                    </div>
                                    {!assignToAll && (
                                        <div>
                                            <MultiSelectSearch
                                                options={branches}
                                                value={data.branch_id as any}
                                                onChange={(val) => {
                                                    setData("branch_id", val as string[]);
                                                }}
                                                placeholder="Search branches..."
                                            />
                                        </div>
                                    )}
                                    {errors.branch_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.branch_id}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {showEditModal ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* View Modal */}
            {showViewModal && selectedTherapist && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => {
                                setShowViewModal(false);
                                setSelectedTherapist(null);
                            }}
                        >
                            ✖
                        </div>
                        <h2 className="text-lg font-bold mb-6 border-b pb-2">
                            Therapist Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center">
                                {selectedTherapist.photo ? (
                                    <img
                                        src={`/storage/${selectedTherapist.photo}`}
                                        alt={selectedTherapist.name}
                                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 shadow-sm cursor-pointer hover:opacity-90"
                                        onClick={() =>
                                            setSelectedPhoto(
                                                `/storage/${selectedTherapist.photo}`,
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <User className="h-16 w-16" />
                                    </div>
                                )}
                                <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
                                    {selectedTherapist.name}
                                </h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize mt-2">
                                    {selectedTherapist.gender}
                                </span>
                            </div>

                            <div className="col-span-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">
                                            Phone
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {selectedTherapist.phone || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">
                                            Birth Date
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {selectedTherapist.birth_date
                                                ? new Date(
                                                    selectedTherapist.birth_date,
                                                ).toLocaleDateString()
                                                : "-"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">
                                        Address
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                        {selectedTherapist.address || "-"}
                                    </p>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Branch Information
                                    </h4>
                                    <div className="bg-gray-50 rounded-md p-4 max-h-40 overflow-y-auto">
                                        {selectedTherapist.branches &&
                                            selectedTherapist.branches.length >
                                            0 ? (
                                            <ul className="space-y-2">
                                                {selectedTherapist.branches.map(
                                                    (branch: any) => (
                                                        <li
                                                            key={branch.id}
                                                            className="flex justify-between items-center text-sm"
                                                        >
                                                            <span className="font-medium text-gray-700">
                                                                {branch.name}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">
                                                No assigned branches.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Attendance History
                                    </h4>
                                    <div className="bg-white rounded-md border border-gray-200 shadow-sm max-h-60 overflow-y-auto">
                                        {(selectedTherapist as any)
                                            .attendances &&
                                            (selectedTherapist as any).attendances
                                                .length > 0 ? (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Date
                                                        </th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Branch
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {(
                                                        selectedTherapist as any
                                                    ).attendances.map(
                                                        (att: any) => (
                                                            <tr key={att.id}>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                                    {new Date(
                                                                        att.check_in,
                                                                    ).toLocaleDateString()}{" "}
                                                                    <span className="text-gray-500 text-xs">
                                                                        (
                                                                        {new Date(
                                                                            att.check_in,
                                                                        ).toLocaleTimeString(
                                                                            [],
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            },
                                                                        )}
                                                                        )
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                    {
                                                                        att
                                                                            .branch
                                                                            ?.name
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="p-4 text-sm text-gray-500 italic text-center">
                                                No attendance records found.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button onClick={() => setShowViewModal(false)} className="dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Verify Modal */}
            {showVerifyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 relative text-gray-900 dark:text-gray-100">
                        <div
                            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => {
                                setShowVerifyModal(false);
                                setVerifiedTherapist(null);
                                setVerifySearch("");
                                setVerifyError("");
                            }}
                        >
                            ✖
                        </div>
                        <h2 className="text-lg font-bold mb-4">
                            Verify / Add Existing Therapist
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Search by Phone
                                </label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={verifySearch}
                                        onChange={(e) =>
                                            setVerifySearch(e.target.value)
                                        }
                                        placeholder="Enter phone number..."
                                        className="block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            verifyTherapist()
                                        }
                                    />
                                    <Button
                                        onClick={verifyTherapist}
                                        disabled={
                                            verifyLoading || !verifySearch
                                        }
                                    >
                                        {verifyLoading ? (
                                            "Searching..."
                                        ) : (
                                            <Search className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                                {verifyError && (
                                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                                        {verifyError}
                                    </p>
                                )}
                            </div>

                            {verifiedTherapist && (
                                <div className="border dark:border-slate-700 rounded-md p-4 bg-gray-50 dark:bg-slate-700/50 flex items-center gap-4">
                                    {verifiedTherapist.photo ? (
                                        <img
                                            src={`/storage/${verifiedTherapist.photo}`}
                                            alt={verifiedTherapist.name}
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-400 dark:text-gray-300">
                                            <User className="h-8 w-8" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                            {verifiedTherapist.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {verifiedTherapist.phone}
                                        </p>
                                        <div className="text-xs text-gray-400 mt-1">
                                            Found in{" "}
                                            {verifiedTherapist.branches
                                                ?.length || 0}{" "}
                                            branches
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isAlreadyInBranch && (
                                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-md">
                                    This therapist is already registered in the selected branch.
                                </p>
                            )}

                            {verifiedTherapist && (
                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t dark:border-slate-700">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setShowVerifyModal(false);
                                            setVerifiedTherapist(null);
                                            setVerifySearch("");
                                        }}
                                        className="dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={extendTherapist} disabled={isAlreadyInBranch} className="dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700">
                                        Add to My Branch
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Photo Preview Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 cursor-pointer"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img
                            src={selectedPhoto}
                            alt="Full size"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                        <button
                            className="absolute top-[-40px] right-0 text-white hover:text-gray-300 text-xl font-bold p-2"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal for Super Admin */}
            {showDeleteModal && therapistToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-sm p-6 relative text-gray-900 dark:text-gray-100">
                        <h2 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">
                            Delete Therapist
                        </h2>

                        {isSuperadmin ? (
                            <div className="space-y-4">
                                <p>
                                    How do you want to delete{" "}
                                    <strong>{therapistToDelete.name}</strong>?
                                </p>

                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="deleteType"
                                            value="branch"
                                            checked={
                                                deleteDetails.type === "branch"
                                            }
                                            onChange={() =>
                                                setDeleteDetails((prev) => ({
                                                    ...prev,
                                                    type: "branch",
                                                }))
                                            }
                                        />
                                        Remove from a Branch
                                    </label>

                                    {deleteDetails.type === "branch" && (
                                        <select
                                            className="ml-6 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={deleteDetails.branch_id}
                                            onChange={(e) =>
                                                setDeleteDetails((prev) => ({
                                                    ...prev,
                                                    branch_id: e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="">
                                                Select Branch
                                            </option>
                                            {therapistToDelete.branches?.map(
                                                (branch) => (
                                                    <option
                                                        key={branch.id}
                                                        value={branch.id}
                                                    >
                                                        {branch.name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    )}

                                    <label className="flex items-center gap-2 mt-2">
                                        <input
                                            type="radio"
                                            name="deleteType"
                                            value="global"
                                            checked={
                                                deleteDetails.type === "global"
                                            }
                                            onChange={() =>
                                                setDeleteDetails((prev) => ({
                                                    ...prev,
                                                    type: "global",
                                                    branch_id: "",
                                                }))
                                            }
                                        />
                                        Delete Globally (All Branches)
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <p>
                                Are you sure you want to remove{" "}
                                <strong>{therapistToDelete.name}</strong> from
                                your branch? This action cannot be undone.
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                                className="dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => handleDelete()}
                                className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                                disabled={
                                    isSuperadmin &&
                                    deleteDetails.type === "branch" &&
                                    !deleteDetails.branch_id
                                }
                            >
                                Confirm Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}{" "}
        </AuthenticatedLayout>
    );
}
