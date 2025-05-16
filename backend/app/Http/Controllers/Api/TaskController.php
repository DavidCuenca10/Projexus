<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TaskController extends Controller
{

    //Funcion privada para verificar permisos de usuario en el proyecto para el backend
    private function verificarPermiso($project){
        $member = $project->members()->where('user_id', Auth::id())->first();

        if (!$member) {
            abort(response()->json(['message' => 'El usuario no es miembro del proyecto'], 400));
        }

        if (!in_array($member->pivot->role, ['owner', 'admin'])) {
            abort(response()->json(['message' => 'No tienes permisos para realizar esta acción'], 403));
        }

        return $member;
    }


    //Funcion publica para verificar permisos de usuario en el proyecto para manejarlo en el frontend
    public function verificarRol($projectId){
        // Obtener el proyecto
        $project = Project::findOrFail($projectId);
        
        // Verificar si el usuario está en el proyecto
        $member = $project->members()->where('user_id', Auth::id())->first();
        
        if (!$member) {
            return response()->json([
                'isMember' => false,
                'isAdmin' => false,
                'isOwner' => false,
            ]);
        }

        $role = $member->pivot->role;

        return response()->json([
            'isOwner' => $member && $member->pivot->role === 'owner',
            'isAdmin' => $member && $member->pivot->role === 'admin',
            'isMember' => $member !== null, // true si está en el proyecto, sea cual sea el rol
        ]);
    }

    //Crear un tarea en un proyecto
    public function crearTarea(Request $request, $projectId){

        $project = Project::findOrFail($projectId);

        //Llamo al metodo verificarPermiso
        $this->verificarPermiso($project);
    
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'assigned_to' => 'nullable|exists:users,id', // Asegura que el usuario asignado exista en la tabla users
            'deadline' => 'nullable|date', //String si quiero cambiar el formato de fechas para el backend
            'priority' => 'nullable|in:low,medium,high',
        ]);

        //Estado cuando se crea la tarea siempre será "pending" de primeras
        $status = 'pending';

        // Crear la tarea
        $task = Task::create([
            'project_id' => $project->id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $status,
            'assigned_to' => $request->assigned_to,
            'priority' => $request->priority,
            'deadline' => $request->deadline,
        ]);
    
        return response()->json([
            'message' => 'Tarea creada con éxito',
            'task' => $task,
        ], 201);
    }


    //Obtener las tareas de un proyecto
    public function obtenerTareas($projectId){

        $project = Project::findOrFail($projectId);
        $tasks = $project->tasks;

        return response()->json([
            'tasks'=>$tasks,
        ], 200);
    }


    //Actualizar las tareas
    public function actualizarTarea(Request $request, $projectId, $taskId){

        $project = Project::findOrFail($projectId);

        // Verificar si el usuario está en el proyecto
        $member = $project->members()->where('user_id', Auth::id())->first();
    
        if (!$member) {
            return response()->json(['message' => 'No eres miembro del proyecto para editar esta tarea'], 400);
        }

        $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        // Buscar la tarea
        $task = $project->tasks()->findOrFail($taskId);

        // Actualizar la tarea
        $task->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Estado de la tarea actualizado',
            'task' => $task,
        ], 200);
    }


    //Eliminar tareas
    public function eliminarTarea($projectId, $taskId){

        $project = Project::findOrFail($projectId);

        //Llamo al metodo verificarPermiso
        $member = $this->verificarPermiso($project);
    
        if (!$member) {
            return response()->json(['message' => 'El usuario no es miembro del proyecto'], 400);
        }
    
        // Verificar si el rol del usuario en la tabla project_members es admin o owner
        if (!in_array($member->pivot->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'El usuario no tiene permisos para crear tareas'], 400);
        }

        // Buscar el proyecto y la tarea
        $project = Project::findOrFail($projectId);
        $task = $project->tasks()->findOrFail($taskId);

        $task->delete();

        return response()->json([
            'message' => 'Tarea eliminada con éxito',
        ], 200);
    }


    //Listar todas las tareas que tiene el usuario
    public function listarTareasUsuario($userId){

        $tareas = Task::where('assigned_to', $userId)->get();

        return response()->json([
            'message'=>'Tareas obtenidas con éxito',
            'tareas'=>$tareas
        ], 200);
    }
}
