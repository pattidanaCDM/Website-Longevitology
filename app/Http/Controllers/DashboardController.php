<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Patient;
use App\Models\PatientAttendance;
use App\Models\Therapist;
use App\Models\TherapistAttendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $branchId = $user->isSuperadmin() ? $request->input('branch_id') : $user->branch_id;

        // Base Query Helpers
        $attendanceQuery = PatientAttendance::query();
        $therapistAttendanceQuery = TherapistAttendance::query();
        $patientQuery = Patient::query();
        $therapistQuery = Therapist::query();

        if ($branchId) {
            $attendanceQuery->where('branch_id', $branchId);
            $therapistAttendanceQuery->where('branch_id', $branchId);
            // Patients: connected to branch via pivot
            $patientQuery->whereHas('branches', function ($q) use ($branchId) {
                $q->where('branches.id', $branchId);
            });
            // Therapists: connected to branch via pivot
            $therapistQuery->whereHas('branches', function ($q) use ($branchId) {
                $q->where('branches.id', $branchId);
            });
        }

        // --- Summary Cards ---
        // Daily
        $dailyAttendance = (clone $attendanceQuery)->whereDate('check_in', Carbon::today())->count();
        $dailyTherapistAttendance = (clone $therapistAttendanceQuery)->whereDate('check_in', Carbon::today())->count();

        // Weekly
        $weeklyAttendance = (clone $attendanceQuery)->whereBetween('check_in', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();
        $weeklyTherapistAttendance = (clone $therapistAttendanceQuery)->whereBetween('check_in', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();

        // Monthly
        $monthlyAttendance = (clone $attendanceQuery)->whereMonth('check_in', Carbon::now()->month)->whereYear('check_in', Carbon::now()->year)->count();
        $monthlyTherapistAttendance = (clone $therapistAttendanceQuery)->whereMonth('check_in', Carbon::now()->month)->whereYear('check_in', Carbon::now()->year)->count();

        // Total Counts
        $totalPatients = $patientQuery->count();
        $totalTherapists = $therapistQuery->count();


        // --- Chart Data: Attendance Trends (Last 7 Days) ---
        $dailyTrend = PatientAttendance::select(DB::raw('DATE(check_in) as date'), DB::raw('count(*) as count'))
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->where('check_in', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dailyTherapistTrend = TherapistAttendance::select(DB::raw('DATE(check_in) as date'), DB::raw('count(*) as count'))
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->where('check_in', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Merge Trends
        $mergedDailyTrend = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $displayDate = Carbon::now()->subDays($i)->format('d M');
            $mergedDailyTrend->push([
                'date' => $displayDate,
                'patients' => $dailyTrend[$date]->count ?? 0,
                'therapists' => $dailyTherapistTrend[$date]->count ?? 0,
            ]);
        }

        // --- Chart Data: Monthly Trends (Last 6 Months) ---
        $monthlyTrend = PatientAttendance::select(
            DB::raw('YEAR(check_in) as year'),
            DB::raw('MONTH(check_in) as month'),
            DB::raw('count(*) as count')
        )
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->where('check_in', '>=', Carbon::now()->subMonths(5)->startOfMonth())
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $monthlyTherapistTrend = TherapistAttendance::select(
            DB::raw('YEAR(check_in) as year'),
            DB::raw('MONTH(check_in) as month'),
            DB::raw('count(*) as count')
        )
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->where('check_in', '>=', Carbon::now()->subMonths(5)->startOfMonth())
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Merge Monthly Trends
        $mergedMonthlyTrend = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key = $date->format('Y-n'); // matches default DB month output roughly, or we manually match

            $pCount = $monthlyTrend->filter(function ($item) use ($date) {
                return $item->year == $date->year && $item->month == $date->month;
            })->first()->count ?? 0;

            $tCount = $monthlyTherapistTrend->filter(function ($item) use ($date) {
                return $item->year == $date->year && $item->month == $date->month;
            })->first()->count ?? 0;

            $mergedMonthlyTrend->push([
                'month' => $date->format('M Y'),
                'patients' => $pCount,
                'therapists' => $tCount,
            ]);
        }


        return Inertia::render('Dashboard', [
            'stats' => [
                'daily_attendance' => $dailyAttendance,
                'daily_therapist_attendance' => $dailyTherapistAttendance,
                'weekly_attendance' => $weeklyAttendance,
                'weekly_therapist_attendance' => $weeklyTherapistAttendance,
                'monthly_attendance' => $monthlyAttendance,
                'monthly_therapist_attendance' => $monthlyTherapistAttendance,
                'total_patients' => $totalPatients,
                'total_therapists' => $totalTherapists,
            ],
            'chart_data' => [
                'daily_trend' => $mergedDailyTrend,
                'monthly_trend' => $mergedMonthlyTrend,
            ],
            'filters' => [
                'branch_id' => $branchId,
                'all_branches' => $user->isSuperadmin() ? Branch::select('id', 'name')->get() : [],
            ]
        ]);
    }
}
