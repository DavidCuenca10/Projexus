<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\SolicitudProyecto;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function crearProyecto(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'max_members' => 'required|integer|min:1',
            'deadline' => 'nullable|date',
            'tags' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        // Guardar la imagen (si se ha enviado)
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('projects', 'public');
        }

        // Crear el proyecto asociado al usuario autenticado (owner_id)
        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'owner_id' => Auth::id(),  // Usamos el ID del usuario autenticado
            'max_members' => $request->max_members,
            'current_members' => 1,  // El propietario siempre cuenta como miembro
            'deadline' => $request->has('deadline') ? $request->deadline : null,
            'tags' => $request->has('tags') ? $request->tags : null,
            'image_url' => $imagePath ? 'storage/' . $imagePath : null,
        ]);

        if (!$project) {
            return response()->json(['message' => 'Error al crear el proyecto'], 500);
        }

        // Añadir al propietario como miembro automáticamente
        $project->members()->attach(Auth::id(), ['role' => 'owner', 'status' => 'accepted']);

        return response()->json([
            'message' => 'Proyecto creado con éxito',
            'project' => $project
        ], 201);  // Código de estado 201 indica que el proyecto fue creado
    }


    public function eliminarProyecto($projectId){
        $proyecto = Project::find($projectId);

        if (!$proyecto) {
            return response()->json([
                'message' => 'Proyecto no encontrado.'
            ], 404);
        }

        // Verificar si el usuario autenticado es el dueño
        if ($proyecto->owner_id !== Auth::id()) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar este proyecto.'
            ], 403);
        }

        // Eliminar imagen del proyecto si existe
        if ($proyecto->image_url) {
            // Eliminar el prefijo 'storage/' para que quede 'projects/xxxx...'
            $imagePath = str_replace('storage/', '', $proyecto->image_url);

            // Eliminar archivo usando disco 'public'
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        $proyecto->members()->detach();
        $proyecto->delete();

        return response()->json([
            'message' => 'Proyecto eliminado correctamente.'
        ], 200);
    }


    public function listarProyectosUsuario($userId){
        // Verificar que el usuario autenticado coincida con el usuario de la URL
        if (Auth::id() !== (int) $userId) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Obtener todos los proyectos asociados a un usuario
        $projects = Project::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        return response()->json([
            'projects' => $projects,
        ], 200);
    }


    public function enviarSolicitud($projectId){
        // Verifica si el proyecto existe
        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        // Verifica si el usuario ya tiene una solicitud pendiente para este proyecto
        $solicitudExistente = SolicitudProyecto::where('project_id', $projectId)
                                                ->where('user_id', auth()->user()->id)
                                                ->where('estado', 'pendiente')
                                                ->first();

        if ($solicitudExistente) {
            return response()->json(['message' => 'Ya tienes una solicitud pendiente para este proyecto'], 400);
        }

        // Crea la solicitud
        $solicitud = SolicitudProyecto::create([
            'project_id' => $projectId,
            'user_id' => auth()->user()->id,
            'estado' => 'pendiente', // Por defecto la solicitud estará pendiente
        ]);

        return response()->json(['message' => 'Solicitud enviada correctamente'], 200);
    }


    public function aceptarMiembro(Request $request, $projectId, $userId){

        $project = Project::findOrFail($projectId);
    
        if ($project->owner_id !== Auth::id()) {
            return response()->json(['message' => 'No tienes permiso para aceptar a este usuario'], 403);
        }
    
        // Buscar la solicitud pendiente
        $solicitud = SolicitudProyecto::where([
            'project_id' => $projectId,
            'user_id' => $userId,
            'estado' => 'pendiente'
        ])->first();
    
        if (!$solicitud) {
            return response()->json(['message' => 'Este usuario no tiene una solicitud pendiente'], 400);
        }
    
        // Verificar si el usuario ya es miembro del proyecto
        $alreadyMember = $project->members()->where('user_id', $userId)->exists();
    
        if ($alreadyMember) {
            return response()->json(['message' => 'Este usuario ya es miembro del proyecto'], 400);
        }
    
        // Verificar si el proyecto no ha alcanzado el número máximo de miembros
        if ($project->current_members >= $project->max_members) {
            return response()->json(['message' => 'El proyecto ya ha alcanzado el número máximo de miembros'], 400);
        }
    
        $solicitud->estado = 'aceptada';
        $solicitud->save();
    
        // Agregar el usuario a la tabla members con rol 'member'
        $project->members()->attach($userId, ['status' => 'accepted', 'role' => 'member']);
    
        $project->current_members += 1;
        $project->save();
    
        return response()->json(['message' => 'Usuario aceptado en el proyecto'], 200);
    }
    

    public function rechazarMiembro(Request $request, $projectId, $userId){

        $project = Project::findOrFail($projectId);

        if ($project->owner_id !== Auth::id()) {
            return response()->json(['message' => 'No tienes permiso para rechazar a este usuario'], 403);
        }

        // Buscar la solicitud pendiente
        $solicitud = SolicitudProyecto::where([
            'project_id' => $projectId,
            'user_id' => $userId,
            'estado' => 'pendiente'
        ])->first();

        if (!$solicitud) {
            return response()->json(['message' => 'Este usuario no tiene una solicitud pendiente'], 400);
        }

        // Rechazar la solicitud
        $solicitud->estado = 'rechazada';
        $solicitud->save();

        return response()->json(['message' => 'Solicitud rechazada'], 200);
    }


    public function eliminarUsuarioDeProyecto($projectId, $userId)
    {
        $project = Project::findOrFail($projectId);

        if (Auth::id() !== $project->owner_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Verificar que el usuario exista en el proyecto
        if (!$project->members()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'El usuario no pertenece al proyecto'], 400);
        }

        // Eliminar al usuario
        $project->members()->detach($userId);

        // Actualizar el contador de miembros del proyecto
        $project->current_members -= 1;
        $project->save();

        return response()->json(['message' => 'Usuario eliminado con éxito'], 200);
    }


    public function cambiarRol(Request $request, $projectId, $userId){

        $validated = $request->validate([
            'role' => 'required|in:admin,member'
        ]);

        // Buscar el proyecto
        $project = Project::findOrFail($projectId);

        // Verificar si el usuario autenticado es el Owner
        if ($project->owner_id !== Auth::id()) {
            return response()->json(['message' => 'No tienes permiso para cambiar el rol de este usuario'], 403);
        }

        // Verificar si el usuario es miembro del proyecto
        $member = $project->members()->where('user_id', $userId)->first();

        if (!$member) {
            return response()->json(['message' => 'El usuario no es miembro del proyecto'], 400);
        }

        // Cambiar el rol
        $member->pivot->role = $validated['role'];
        $member->pivot->save();

        return response()->json(['message' => 'Rol cambiado con éxito'], 200);
    }


    public function listarProyectosActivos(){

        // Obtener todos los proyectos activos con la relación 'owner' para cada proyecto
        $proyectos = Project::with('owner')->where('estado', 'activo')->get();

        return response()->json([
            'projects' => $proyectos,
        ], 200);
    }


    public function obtenerProyecto ($projectId) {
        
        $project = Project::with('members')->find($projectId);

        if (!$project) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        return response()->json(['project' => $project], 200);
    }


    public function obtenerUsuariosProyecto ($projectId){

        $project = Project::with('members')->find($projectId);

        if(!$project){
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        return response()->json(['members' => $project->members], 200);
    }


    public function salirDelProyecto ($projectId) {

        $user = Auth::user(); //Obtener el usuario autenticado
        $project = Project::findOrFail($projectId); //Obtener el proyecto que nos dan por parametro

        // Verificar si el usuario está en el proyecto
        $member = $project->members()->where('user_id', $user->id)->first();

        if(!$member) {
            return response()->json([
                'message' => 'El usuario no es miembro del proyecto'
            ], 400);
        }

        // Eliminar la relación entre el usuario y el proyecto
        $project->members()->detach($user->id);  // Aquí se elimina la relación en la tabla pivote

        $project->current_members -= 1;
        $project->save();

        return response()->json([
                'message' => 'Has salido del proyecto'
        ], 200);
    }
}
