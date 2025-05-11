<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id', 'user_id', 'role', 'status'
    ];

    // Relación con el proyecto
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
