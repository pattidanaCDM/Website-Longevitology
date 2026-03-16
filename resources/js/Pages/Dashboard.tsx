import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import {
    CalendarDays,
    Users,
    Activity,
    TrendingUp,
    BarChart2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

interface DashboardProps extends PageProps {
    stats: {
        daily_attendance: number;
        daily_therapist_attendance: number;
        weekly_attendance: number;
        weekly_therapist_attendance: number;
        monthly_attendance: number;
        monthly_therapist_attendance: number;
        total_patients: number;
        total_therapists: number;
    };
    chart_data: {
        daily_trend: Array<{
            date: string;
            patients: number;
            therapists: number;
        }>;
        monthly_trend: Array<{
            month: string;
            patients: number;
            therapists: number;
        }>;
    };
    filters: {
        branch_id: number | null;
        all_branches: Array<{ id: number; name: string }>;
    };
}

export default function Dashboard({
    auth,
    stats,
    chart_data,
    filters,
}: DashboardProps) {
    const isSuperadmin = auth.user.role?.name === "superadmin";

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            route("dashboard"),
            { branch_id: e.target.value },
            { preserveState: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard
                    </h2>
                    {isSuperadmin && filters.all_branches && (
                        <select
                            className="bg-white border text-sm rounded-lg p-2.5"
                            onChange={handleBranchChange}
                            defaultValue={filters.branch_id || ""}
                        >
                            <option value="">All Branches</option>
                            {filters.all_branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Patient Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Daily Patients
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.daily_attendance}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Checked in today
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Weekly Patients
                                </CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.weekly_attendance}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Check-ins this week
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Monthly Patients
                                </CardTitle>
                                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.monthly_attendance}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Check-ins this month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Active Patients
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total_patients}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Registered in system
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Therapist Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Daily Therapists
                                </CardTitle>
                                <Activity className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.daily_therapist_attendance}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Checked in today
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Weekly Therapists
                                </CardTitle>
                                <CalendarDays className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.weekly_therapist_attendance}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Check-ins this week
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Monthly Therapists
                                </CardTitle>
                                <BarChart2 className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.monthly_therapist_attendance}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Check-ins this month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Active Therapists
                                </CardTitle>
                                <Users className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total_therapists}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Registered in system
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>
                                    Daily Trends (Last 7 Days)
                                </CardTitle>
                                <CardDescription>
                                    Attendance volume over the past week.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chart_data.daily_trend}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            fontSize={12}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            fontSize={12}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: "transparent" }}
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            }}
                                        />
                                        <Bar
                                            dataKey="patients"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            barSize={20}
                                            name="Patients"
                                        />
                                        <Bar
                                            dataKey="therapists"
                                            fill="#f97316"
                                            radius={[4, 4, 0, 0]}
                                            barSize={20}
                                            name="Therapists"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>
                                    Monthly Trends (Last 6 Months)
                                </CardTitle>
                                <CardDescription>
                                    Long-term attendance growth.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chart_data.monthly_trend}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            fontSize={12}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            fontSize={12}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="patients"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                            dot={{ r: 4, strokeWidth: 2 }}
                                            activeDot={{ r: 6 }}
                                            name="Patients"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="therapists"
                                            stroke="#f97316"
                                            strokeWidth={2}
                                            dot={{ r: 4, strokeWidth: 2 }}
                                            activeDot={{ r: 6 }}
                                            name="Therapists"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
