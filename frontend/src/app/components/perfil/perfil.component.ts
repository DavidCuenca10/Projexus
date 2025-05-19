import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Task } from '../../interfaces/task';
import { ProjectService } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  public environment = environment;
  token: string | null = null;
  usuario: any = null;
  usuarioId: number = 0;
  tareas: Task[] = [];
  proyectosActivosUsuario: number = 0;
  anteriorEstado: string = '';

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
          this.cargarProyectosActivos(this.usuarioId);
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
        this.tareas = response.tareas

        this.tareas.forEach(task => {
          this.anteriorEstado = task.status
        })
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
        this.mostrarToast('Tarea editada correctamente', 'success');
      },
      error: (error) => {
        this.mostrarToast('Error al editar la tarea', 'error');
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
    this.snackBar.open(mensaje, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  cargarProyectosActivos(userId: number) {
    this.projectService.obtenerProyectosDeUsuario(userId).subscribe({
      next: (response) => {
        this.proyectosActivosUsuario = response.projects.length      
      },
      error: (error) => {
        console.error('Error al cargar proyectos', error);
      }
    });
  }
}
