<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SolicitudProyecto;
use App\Models\Project;

class NotificationController extends Controller
{
    //

    public function obtenerSolicitudesPendientes(){
        // 1. Obtenemos todos los proyectos donde el usuario autenticado es el propietario
        $proyectos = Project::where('owner_id', auth()->user()->id)->get();
    
        // 2. Si el usuario no es dueño de ningún proyecto, devolvemos un mensaje de error
        if ($proyectos->isEmpty()) {
            return response()->json(['message' => 'No eres dueño de ningún proyecto.'], 400);
        }
    
        // 3. Si hay proyectos, buscamos las solicitudes pendientes para esos proyectos
        $solicitudes = SolicitudProyecto::whereIn('project_id', $proyectos->pluck('id'))
                                        ->where('estado', 'pendiente')
                                        ->get();
    
        // Mapeamos las solicitudes para incluir los datos correctos que espera el frontend
        $notificaciones = $solicitudes->map(function ($solicitud) {

            $userName = $solicitud->user ? $solicitud->user->name : 'Usuario desconocido';
            $projectName = $solicitud->project ? $solicitud->project->name : 'Proyecto desconocido';

            return [
                'project_id' => $solicitud->project_id,
                'user_id' => $solicitud->user_id,
                'estado' => $solicitud->estado,
                //Pasamos el mensaje con los links a los usuarios y proyectos con sus nombres
                'mensaje' => 'El usuario <a href="/perfil/' . $solicitud->user_id . '">' . $userName . '</a> ha solicitado unirse a tu proyecto <a href="/proyecto/' . $solicitud->project_id . '">' . $projectName . '</a>'

            ];
        });
    
        return response()->json([
            'message' => 'Solicitudes obtenidas correctamente',
            'data' => $notificaciones
        ], 200);
    }
    
}
