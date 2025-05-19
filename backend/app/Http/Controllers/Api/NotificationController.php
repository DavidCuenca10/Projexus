<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SolicitudProyecto;
use App\Models\Project;

class NotificationController extends Controller
{
    public function obtenerSolicitudesPendientes()
    {
        $projectIds = Project::where('owner_id', auth()->id())->pluck('id');

        if ($projectIds->isEmpty()) {
            return response()->json(['message' => 'No eres dueño de ningún proyecto.'], 200);
        }

        $solicitudes = SolicitudProyecto::with(['user', 'project'])
            ->whereIn('project_id', $projectIds)
            ->where('estado', 'pendiente')
            ->get();

        $notificaciones = $solicitudes->map(function ($solicitud) {
            $userName = $solicitud->user->name ?? 'Usuario desconocido';
            $projectName = $solicitud->project->name ?? 'Proyecto desconocido';

            return [
                'project_id' => $solicitud->project_id,
                'user_id' => $solicitud->user_id,
                'estado' => $solicitud->estado,
                'mensaje' => "El usuario <strong>$userName</strong> ha solicitado unirse a tu proyecto <strong>$projectName</strong>"
            ];
        });

        return response()->json([
            'message' => 'Solicitudes obtenidas correctamente',
            'data' => $notificaciones
        ]);
    }
}
