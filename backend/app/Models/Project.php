<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'category', 'owner_id', 'max_members', 
        'current_members', 'deadline', 'tags', 'image_url', 'estado'
    ];

    // Relación con el propietario (un solo usuario)
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Relación con los miembros del proyecto (muchos a muchos)
    public function members()
    {
        return $this->belongsToMany(User::class, 'project_members')
                    ->withPivot('role', 'status')
                    ->withTimestamps();
    }

    // Relación con las tareas del proyecto
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Relación con SolicitudProyecto
    public function solicitudes()
    {
        return $this->hasMany(SolicitudProyecto::class);
    }
}
