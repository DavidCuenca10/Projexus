<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id', 'assigned_to', 'title', 'description', 'status', 
        'priority', 'deadline'
    ];

    // Relación con el proyecto
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Relación con el usuario asignado
    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
