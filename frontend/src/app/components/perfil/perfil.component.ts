import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Task } from '../../interfaces/task';
import { ProjectService } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  token: string | null = null;
  usuario: any = null;
  usuarioId: number = 0;
  tareas: Task[] = [];

  constructor(
    private perfilService: PerfilService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.perfilService.getProfile().subscribe({
        next: (response) => {
          this.usuario = response.data;
          this.usuarioId = this.usuario.id;
          this.cargarTareas(this.usuarioId);
        },
        error: (error) => {
          console.log('Perfil no encontrado', error);
        }
      });
    }
  }

  cargarTareas(id: number) {
    this.perfilService.obtenerTareasUsuario(id).subscribe({
      next: (response) => {
        this.tareas = response.tareas.map((tarea: Task) => ({
          ...tarea,
          anteriorStatus: tarea.status // este es el que vamos a comparar
        }));
      },
      error: (error) => console.error('Error al cargar tareas', error)
    });
  }

  actualizarTareaEstado(tarea: any) {
    const projectId = tarea.project_id;
    const taskId = tarea.id;
    const nuevoStatus = tarea.status;

    this.projectService.actualizarTarea(projectId, taskId, nuevoStatus).subscribe({
      next: (response) => {
        tarea.anteriorStatus = nuevoStatus;
        console.log('Tarea actualizada', response);
      },
      error: (error) => {
        console.error('Error al actualizar tarea', error);
      }
    });
  }

  get tareasPendientes(): Task[] {
    return this.tareas.filter(t => t.status === 'pending');
  }

  get tareasEnProceso(): Task[] {
    return this.tareas.filter(t => t.status === 'in_progress');
  }

  get tareasCompletadas(): Task[] {
    return this.tareas.filter(t => t.status === 'completed');
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    //console.log('Clase aplicada:', tipo === 'success' ? 'snackbar-success' : 'snackbar-error');
    this.snackBar.open(mensaje, 'X', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}
