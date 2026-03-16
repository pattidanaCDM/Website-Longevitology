<?php

namespace App\Http\Controllers;

use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditTrailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AuditTrail::with('user');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('event', 'like', "%{$search}%")
                    ->orWhere('auditable_type', 'like', "%{$search}%")
                    ->orWhere('old_values', 'like', "%{$search}%")
                    ->orWhere('new_values', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('event') && $request->event) {
            $query->where('event', $request->event);
        }

        if ($request->has('auditable_type') && $request->auditable_type) {
            $query->where('auditable_type', $request->auditable_type);
        }

        $logs = $query->latest()
            ->paginate(50)
            ->withQueryString();

        // Get filter options
        $users = \App\Models\User::select('id', 'name')->get();
        $events = AuditTrail::select('event')->distinct()->pluck('event');
        $types = AuditTrail::select('auditable_type')->distinct()->pluck('auditable_type');

        return Inertia::render('ManageAuditLogs', [
            'logs' => $logs,
            'filters' => [
                'search' => $request->search,
                'user_id' => $request->user_id,
                'event' => $request->event,
                'auditable_type' => $request->auditable_type,
            ],
            'users' => $users,
            'events' => $events,
            'types' => $types,
        ]);
    }
}
