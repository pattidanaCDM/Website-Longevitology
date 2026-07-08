<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\AuditTrail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserService
{
    /**
     * Store a new user in the database.
     *
     * @param array<string, mixed> $data
     * @param string $fullUrl
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return User
     */
    public function store(array $data, string $fullUrl, ?string $ipAddress, ?string $userAgent): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => $data['role_id'],
            'branch_id' => $data['branch_id'],
            'email_verified_at' => now(),
        ]);

        AuditTrail::create([
            'user_id' => Auth::id(),
            'event' => 'created',
            'description' => "Created User: {$user->name}",
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'new_values' => json_encode($user->toArray()),
            'url' => $fullUrl,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        return $user;
    }

    /**
     * Update an existing user.
     *
     * @param User $user
     * @param array<string, mixed> $data
     * @param string $fullUrl
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return void
     */
    public function update(User $user, array $data, string $fullUrl, ?string $ipAddress, ?string $userAgent): void
    {
        $oldValues = $user->getOriginal();

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'role_id' => $data['role_id'],
            'branch_id' => $data['branch_id'],
        ]);

        AuditTrail::create([
            'user_id' => Auth::id(),
            'event' => 'updated',
            'description' => "Updated User: {$user->name}",
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($user->getChanges()),
            'url' => $fullUrl,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    /**
     * Delete or remove a user.
     *
     * @param User $user
     * @param string $fullUrl
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return void
     * @throws \Exception
     */
    public function destroy(User $user, string $fullUrl, ?string $ipAddress, ?string $userAgent): void
    {
        if ($user->id === Auth::id()) {
            throw new \Exception('You cannot delete your own account.');
        }

        $oldValues = $user->toArray();
        $userName = $user->name;
        $userId = $user->id;

        $user->delete();

        AuditTrail::create([
            'user_id' => Auth::id(),
            'event' => 'deleted',
            'description' => "Deleted User: {$userName}",
            'auditable_type' => get_class($user),
            'auditable_id' => $userId,
            'old_values' => json_encode($oldValues),
            'url' => $fullUrl,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }
}
