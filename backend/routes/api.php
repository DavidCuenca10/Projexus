<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ChatController;

Route::post("register", [ApiController::class, "register"]);
Route::post("login", [ApiController::class, "login"]);

Route::group(["middleware" => ["auth:sanctum"]], function(){
    
    Route::get("profile", [ApiController::class, "profile"]);

    //Proyectos
    Route::post("proyectos", [ProjectController::class, 'crearProyecto']); //Crear proyecto
    Route::get("proyectos/usuario/{userId}", [ProjectController::class, 'listarProyectosUsuario']); //Listar proyectos de usuario
    Route::get("proyectos", [ProjectController::class, 'listarProyectosActivos']); //Listar todos los proyectos activos
    Route::delete('proyectos/{projectId}', [ProjectController::class, 'eliminarProyecto']); //Eliminar proyecto
    Route::get('proyectos/{id}', [ProjectController::class, 'obtenerProyecto']); //Buscar proyecto por id


    // Gestión de usuarios en proyectos
    Route::post("proyectos/{projectId}/usuarios", [ProjectController::class, 'agregarUsuarioAProyecto']); //Agregar usuario a proyecto
    Route::put("proyectos/{projectId}/usuarios/{userId}/rol", [ProjectController::class, 'cambiarRol']); //Asignar rol
    Route::delete("proyectos/{projectId}/usuarios/{userId}", [ProjectController::class, 'eliminarUsuarioDeProyecto']); //Eliminar usuario de proyecto
    Route::get('proyectos/{projectId}/miembros', [ProjectController::class, 'obtenerUsuariosProyecto']); //Listar usuarios de un proyecto
    Route::delete('proyectos/{projectId}/salir', [ProjectController::class, 'salirDelProyecto']);

    //Verificacion
    Route::get('proyectos/{projectId}/verificar-rol', [TaskController::class, 'verificarRol']); //Verificar rol del usuario en el proyecto

    
    //Solicitudes
    Route::post('/proyectos/{projectId}/solicitar', [ProjectController::class, 'enviarSolicitud']); //Enviar solicitud de union
    Route::put("proyectos/{projectId}/miembro/{userId}/aceptar", [ProjectController::class, 'aceptarMiembro']); //Aceptar solicitud
    Route::put("proyectos/{projectId}/miembro/{userId}/rechazar", [ProjectController::class, 'rechazarMiembro']); //Rechazar solicitud
    Route::get('/solicitudes', [NotificationController::class, 'obtenerSolicitudesPendientes']); //Obtener solicitudeds pendiendes del usuario autenticado


    //Tareas
    Route::post("proyectos/{projectId}/tareas", [TaskController::class, 'crearTarea']); //Crear una tarea
    Route::get("proyectos/{projectId}/tareas", [TaskController::class, 'obtenerTareas']);//Obtener las tareas de un proyecto dado
    Route::put("proyectos/{projectId}/tareas/{taskId}", [TaskController::class, 'actualizarTarea']); //Actualizar tarea
    Route::delete("proyectos/{projectId}/tarea/{taskId}", [TaskController::class, 'eliminarTarea']); //Eliminar tarea
    Route::get("profile/usuario/{userId}", [TaskController::class, 'listarTareasUsuario']); //Listar todas las tareas que tiene el usuario

    Route::post('messages', [ChatController::class, 'message']);
});

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');
