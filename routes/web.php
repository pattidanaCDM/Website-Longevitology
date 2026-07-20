<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Add DashboardController Import
use App\Http\Controllers\DashboardController;

Route::get('/', [\App\Http\Controllers\WelcomeController::class, 'index'])->name('home');

Route::get('/about', function () {
    return Inertia::render('AboutDetail');
})->name('about');

Route::get('/testimonials', function () {
    return Inertia::render('TestimonialDetail');
})->name('testimonials');

// Update Dashboard Route
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// User Management Routes (Superadmin only)
Route::middleware(['auth', \App\Http\Middleware\CheckRole::class . ':superadmin'])->group(function () {
    Route::get('/users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
    Route::post('/users', [\App\Http\Controllers\UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/send-reset-link', [\App\Http\Controllers\UserController::class, 'sendResetLink'])->name('users.send-reset-link');

    // Branch Management Routes
    Route::get('/branches', [\App\Http\Controllers\BranchController::class, 'index'])->name('branches.index');
    Route::post('/branches', [\App\Http\Controllers\BranchController::class, 'store'])->name('branches.store');
    Route::put('/branches/{branch}', [\App\Http\Controllers\BranchController::class, 'update'])->name('branches.update');
    Route::delete('/branches/{branch}', [\App\Http\Controllers\BranchController::class, 'destroy'])->name('branches.destroy');

    // FAQ Management Routes
    Route::get('/faqs', [\App\Http\Controllers\FaqController::class, 'index'])->name('faqs.index');
    Route::post('/faqs/categories', [\App\Http\Controllers\FaqController::class, 'storeCategory'])->name('faqs.categories.store');
    Route::put('/faqs/categories/{category}', [\App\Http\Controllers\FaqController::class, 'updateCategory'])->name('faqs.categories.update');
    Route::delete('/faqs/categories/{category}', [\App\Http\Controllers\FaqController::class, 'destroyCategory'])->name('faqs.categories.destroy');
    
    Route::post('/faqs', [\App\Http\Controllers\FaqController::class, 'storeFaq'])->name('faqs.store');
    Route::put('/faqs/{faq}', [\App\Http\Controllers\FaqController::class, 'updateFaq'])->name('faqs.update');
    Route::delete('/faqs/{faq}', [\App\Http\Controllers\FaqController::class, 'destroyFaq'])->name('faqs.destroy');

    // Audit Logs
    Route::get('/audit-logs', [\App\Http\Controllers\AuditTrailController::class, 'index'])->name('audit-logs.index');
});

// Schedule Management Routes (Superadmin only)
Route::middleware(['auth', \App\Http\Middleware\CheckRole::class . ':superadmin'])->group(function () {
    Route::get('/schedules', [\App\Http\Controllers\ScheduleController::class, 'index'])->name('schedules.index');
    Route::post('/schedules/{branch}/sync', [\App\Http\Controllers\ScheduleController::class, 'sync'])->name('schedules.sync');
});

// Notification Routes
Route::middleware('auth')->group(function () {
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    // Manage Schedule Exceptions
    Route::resource('schedule-exceptions', \App\Http\Controllers\ScheduleExceptionController::class)->except(['create', 'show', 'edit']);

    // Manage Announcements
    Route::resource('announcements', \App\Http\Controllers\AnnouncementController::class)->except(['create', 'show', 'edit']);

    // Manage Patients
    Route::post('/patients/verify', [\App\Http\Controllers\PatientController::class, 'verify'])->name('patients.verify');
    Route::post('/patients/extend', [\App\Http\Controllers\PatientController::class, 'extend'])->name('patients.extend');
    Route::resource('patients', \App\Http\Controllers\PatientController::class);

    // Manage Therapists
    Route::get('/therapists/export/excel', [\App\Http\Controllers\TherapistController::class, 'exportExcel'])->name('therapists.export.excel');
    Route::get('/therapists/export/pdf', [\App\Http\Controllers\TherapistController::class, 'exportPdf'])->name('therapists.export.pdf');
    Route::post('/therapists/verify', [\App\Http\Controllers\TherapistController::class, 'verify'])->name('therapists.verify');
    Route::post('/therapists/extend', [\App\Http\Controllers\TherapistController::class, 'extend'])->name('therapists.extend');
    Route::resource('therapists', \App\Http\Controllers\TherapistController::class);

    // Attendance
    Route::prefix('attendance')->group(function () {
        Route::get('/archives', [\App\Http\Controllers\AttendanceArchiveController::class, 'index'])->name('attendance.archives.index');
        Route::get('/archives/export-patients/excel', [\App\Http\Controllers\AttendanceArchiveController::class, 'exportPatientExcel'])->name('attendance.archives.patients.export.excel');
        Route::get('/archives/export-patients/pdf', [\App\Http\Controllers\AttendanceArchiveController::class, 'exportPatientPdf'])->name('attendance.archives.patients.export.pdf');
        Route::get('/archives/export-therapists/excel', [\App\Http\Controllers\AttendanceArchiveController::class, 'exportTherapistExcel'])->name('attendance.archives.therapists.export.excel');
        Route::get('/archives/export-therapists/pdf', [\App\Http\Controllers\AttendanceArchiveController::class, 'exportTherapistPdf'])->name('attendance.archives.therapists.export.pdf');
        Route::post('/archives/patients', [\App\Http\Controllers\AttendanceArchiveController::class, 'storePatient'])->name('attendance.archives.patients.store');
        Route::post('/archives/therapists', [\App\Http\Controllers\AttendanceArchiveController::class, 'storeTherapist'])->name('attendance.archives.therapists.store');
        
        Route::get('/patients/export/excel', [\App\Http\Controllers\PatientAttendanceController::class, 'exportExcel'])->name('attendance.patients.export.excel');
        Route::get('/patients/export/pdf', [\App\Http\Controllers\PatientAttendanceController::class, 'exportPdf'])->name('attendance.patients.export.pdf');

        Route::get('/patients', [\App\Http\Controllers\PatientAttendanceController::class, 'index'])->name('attendance.patients.index');
        Route::post('/patients/checkout-all', [\App\Http\Controllers\PatientAttendanceController::class, 'checkoutAll'])->name('attendance.patients.checkout-all');
        Route::post('/patients', [\App\Http\Controllers\PatientAttendanceController::class, 'store'])->name('attendance.patients.store');
        Route::put('/patients/{id}', [\App\Http\Controllers\PatientAttendanceController::class, 'update'])->name('attendance.patients.update');
        Route::delete('/patients/{id}', [\App\Http\Controllers\PatientAttendanceController::class, 'destroy'])->name('attendance.patients.destroy');

        Route::get('/therapists', [\App\Http\Controllers\TherapistAttendanceController::class, 'index'])->name('attendance.therapists.index');
        Route::post('/therapists/checkout-all', [\App\Http\Controllers\TherapistAttendanceController::class, 'checkoutAll'])->name('attendance.therapists.checkout-all');
        Route::post('/therapists', [\App\Http\Controllers\TherapistAttendanceController::class, 'store'])->name('attendance.therapists.store');
        Route::put('/therapists/{id}', [\App\Http\Controllers\TherapistAttendanceController::class, 'update'])->name('attendance.therapists.update');
        Route::delete('/therapists/{id}', [\App\Http\Controllers\TherapistAttendanceController::class, 'destroy'])->name('attendance.therapists.destroy');
    });
});

require __DIR__ . '/auth.php';
