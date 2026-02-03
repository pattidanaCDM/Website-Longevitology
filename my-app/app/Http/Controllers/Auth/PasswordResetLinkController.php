<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        if ($user) {
            // Notify all superadmins
            $superadmins = \App\Models\User::whereHas('role', function ($q) {
                $q->where('name', \App\Models\Role::SUPERADMIN);
            })->get();

            foreach ($superadmins as $admin) {
                $admin->notify(new \App\Notifications\ForgotPasswordRequestNotification($user));
            }

            return back()->with('status', 'Permintaan reset password telah dikirim ke Admin. Silakan hubungi admin Anda.');
        }

        throw ValidationException::withMessages([
            'email' => ['Email tidak terdaftar dalam sistem kami.'],
        ]);
    }
}
