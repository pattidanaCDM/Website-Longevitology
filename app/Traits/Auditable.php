<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\AuditTrail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function (Model $model) {
            self::logAudit('created', $model);
        });

        static::updated(function (Model $model) {
            self::logAudit('updated', $model);
        });

        static::deleted(function (Model $model) {
            self::logAudit('deleted', $model);
        });
    }

    protected static function logAudit($event, Model $model)
    {
        $old = [];
        $new = [];

        if ($event === 'updated') {
            // Get changed attributes
            $changes = $model->getChanges();
            foreach ($changes as $key => $value) {
                $old[$key] = $model->getOriginal($key);
                $new[$key] = $value;
            }
        } elseif ($event === 'created') {
            $new = $model->getAttributes();
        } elseif ($event === 'deleted') {
            $old = $model->getAttributes();
        }

        $description = ucfirst($event) . " " . class_basename($model);
        if (isset($model->name)) {
            $description .= ": " . $model->name;
        } elseif (isset($model->title)) {
            $description .= ": " . $model->title;
        } else {
            $description .= " #" . $model->id;
        }

        AuditTrail::create([
            'user_id' => Auth::id(),
            'event' => $event,
            'description' => $description,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'old_values' => !empty($old) ? json_encode($old) : null,
            'new_values' => !empty($new) ? json_encode($new) : null,
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
