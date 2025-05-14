<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'biography',   // Agregar biography
        'preferences',
        'image_url'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relación con los proyectos que un usuario posee (uno a muchos)
    public function ownedProjects()
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    // Relación con los proyectos en los que un usuario es miembro (muchos a muchos)
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_members')
                    ->withPivot('role', 'status') // Incluye los campos adicionales en la tabla intermedia
                    ->withTimestamps();
    }

    // Relación con las tareas que están asignadas a un usuario
    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    // Relación con SolicitudProyecto
    public function solicitudes()
    {
        return $this->hasMany(SolicitudProyecto::class);
    }
}
