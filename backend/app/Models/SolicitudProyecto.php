<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudProyecto extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_proyecto';

    protected $fillable = [
        'project_id',
        'user_id',
        'estado',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
