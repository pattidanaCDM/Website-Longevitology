<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\WelcomeController::class, 'index']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
    Route::post('/branches', [\App\Http\Controllers\BranchController::class, 'store'])->name('branches.store');
    Route::put('/branches/{branch}', [\App\Http\Controllers\BranchController::class, 'update'])->name('branches.update');
    Route::delete('/branches/{branch}', [\App\Http\Controllers\BranchController::class, 'destroy'])->name('branches.destroy');
});

// Schedule Management Routes (Admin and Superadmin)
Route::middleware(['auth', \App\Http\Middleware\CheckRole::class . ':admin,superadmin'])->group(function () {
    Route::get('/schedules', [\App\Http\Controllers\ScheduleController::class, 'index'])->name('schedules.index');
    Route::post('/schedules/{branch}/sync', [\App\Http\Controllers\ScheduleController::class, 'sync'])->name('schedules.sync');
});

// Notification Routes
Route::middleware('auth')->group(function () {
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});

require __DIR__ . '/auth.php';
