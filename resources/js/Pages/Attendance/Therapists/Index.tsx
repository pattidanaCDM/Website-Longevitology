import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps, Therapist, Branch } from "@/types";
import { Button } from "@/Components/ui/button";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
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
    date: string;
}

export default function TherapistAttendanceIndex({ attendances, date }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        therapist_identifier: "",
    });

    const [selectedDate, setSelectedDate] = useState(date);

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("attendance.therapists.store"), {
            onSuccess: () => reset("therapist_identifier"),
        });
    };

    const handleCheckOut = (id: number) => {
        router.put(route("attendance.therapists.update", id), {
            check_out_now: true,
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get(
            route("attendance.therapists.index"),
            { date: newDate },
            { preserveState: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Therapist Attendance
                </h2>
            }
        >
            <Head title="Therapist Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Check-in Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4">
                            Check In Therapist
                        </h3>
                        <form
                            onSubmit={handleCheckIn}
                            className="flex gap-4 items-end"
                        >
                            <div className="flex-1">
                                <InputLabel htmlFor="therapist_identifier">
                                    Card Number or Phone
                                </InputLabel>
                                <TextInput
                                    id="therapist_identifier"
                                    value={data.therapist_identifier}
                                    onChange={(e) =>
                                        setData(
                                            "therapist_identifier",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter card number or phone..."
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.therapist_identifier && (
                                    <span className="text-red-500 text-sm">
                                        {errors.therapist_identifier}
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                Attendance for{" "}
                                {format(new Date(selectedDate), "PPP")}
                            </h3>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Therapist
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Branch
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
                                                colSpan={5}
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
                                                        {record.therapist?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {
                                                            record.therapist
                                                                ?.phone
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {record.branch?.name}
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
