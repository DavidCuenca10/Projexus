import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = `${environment.apiUrl}/api/proyectos`;

  constructor(private http: HttpClient) { }

  // Método para aceptar un miembro
  aceptarMiembro(projectId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${projectId}/miembro/${userId}/aceptar`;
    return this.http.put(url, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  rechazarMiembro(projectId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${projectId}/miembro/${userId}/rechazar`;
    return this.http.put(url, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  listarProyectosActivos(): Observable<any>{
    return this.http.get(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  listarTodosProyectos(): Observable<any>{
    return this.http.get(`${this.apiUrl}/todos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }


  obtenerProyecto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  obtenerProyectosDeUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }


  obtenerUsuariosProyecto(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${projectId}/miembros`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  obtenerTareasProyecto(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${projectId}/tareas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

//Verificar el rol de un usuario en el proyecto dado para mostrar opciones debidas
  verificarRolProyecto(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${projectId}/verificar-rol`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  eliminarTarea(projectId: number, taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/tarea/${taskId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  //Enviar solicitud de unión al proyecto
  solicitarAccesoProyecto(projectId: number): Observable<any> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
    return this.http.post(`${this.apiUrl}/${projectId}/solicitar`, {}, { headers });
  }
  

  //Cambiar rol de un miembro solo con el owner
  cambiarRol(projectId: number, userId: number, nuevoRol: string): Observable<any> {
    const url = `${this.apiUrl}/${projectId}/usuarios/${userId}/rol`;
    return this.http.put(url, { role: nuevoRol }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }


  //Eliminar miembro del proyecto
  eliminarUsuario(projectId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }


  crearTarea(projectId: number, tarea: any): Observable<any> {
    const url = `${this.apiUrl}/${projectId}/tareas`;
    return this.http.post(url, tarea, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }


  //Eliminar proyecto si es owner
  eliminarProyecto(projectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  crearProyecto(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    return this.http.post(this.apiUrl, formData, { headers });
  }

  //Salir del proyecto
  salirDelProyecto(projectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/salir`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  //Cambiar estado de la tarea
  actualizarTarea(projectId:number, taskId: number, newStatus: string): Observable<any> {
    const url = `${this.apiUrl}/${projectId}/tareas/${taskId}/`;
    return this.http.put(url, { status: newStatus }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  actualizarEstadoProyecto(projectId:number, newStatus: string): Observable<any> {
    const url = `${this.apiUrl}/${projectId}`;
    return this.http.put(url, { estado: newStatus }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}