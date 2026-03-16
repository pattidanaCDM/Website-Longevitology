<?php

namespace App\Http\Controllers;

use App\Models\AuditTrail;
use App\Models\Role;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['role', 'branch'])->paginate(10);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => Role::all(),
            'branches' => Branch::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'branch_id' => $request->branch_id,
            'email_verified_at' => now(),
        ]);

        // Log Audit Trail
        AuditTrail::create([
            'user_id' => Auth::id(),
            'event' => 'created',
            'description' => "Created User: {$user->name}",
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'new_values' => json_encode($user->toArray()),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $oldValues = $user->getOriginal();

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'branch_id' => $request->branch_id,
        ]);

        // Log Audit Trail
        AuditTrail::create([
            'user_id' => Auth::id(),
            'event' => 'updated',
            'description' => "Updated User: {$user->name}",
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($user->getChanges()),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $oldValues = $user->toArray();
        $userName = $user->name;
        $userId = $user->id;

        $user->delete();

        // Log Audit Trail
        AuditTrail::create([
            'user_id' => Auth::id(),
            'event' => 'deleted',
            'description' => "Deleted User: {$userName}",
            'auditable_type' => User::class,
            'auditable_id' => $userId,
            'old_values' => json_encode($oldValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    /**
     * Send password reset link to user.
     */
    public function sendResetLink(User $user)
    {
        // Send password reset notification
        $user->notify(new \App\Notifications\ResetPasswordNotification());

        return redirect()->back()->with('success', 'Password reset link has been sent to ' . $user->email);
    }
}
