<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Branch;
use App\Services\UserService;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private UserService $userService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $users = User::with(['role', 'branch'])->get();

        return Inertia::render('ManageUsers', [
            'users' => $users,
            'roles' => Role::all(),
            'branches' => Branch::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->userService->store(
            $request->validated(),
            $request->fullUrl(),
            $request->ip(),
            $request->userAgent()
        );

        return redirect()->back()->with('success', 'User created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->userService->update(
            $user,
            $request->validated(),
            $request->fullUrl(),
            $request->ip(),
            $request->userAgent()
        );

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        try {
            $this->userService->destroy(
                $user,
                $request->fullUrl(),
                $request->ip(),
                $request->userAgent()
            );
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    /**
     * Send password reset link to user.
     */
    public function sendResetLink(User $user): RedirectResponse
    {
        // Send password reset notification
        $user->notify(new \App\Notifications\ResetPasswordNotification());

        return redirect()->back()->with('success', 'Password reset link has been sent to ' . $user->email);
    }
}
