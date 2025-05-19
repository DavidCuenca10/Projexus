import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Users } from '../../interfaces/users';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../interfaces/project';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  users: Users[] = [];
  projects: Project[] = [];
  showUsers: boolean = true;

  constructor(
    private perfilService: PerfilService,
    private snackBar: MatSnackBar,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.cargarProjects();
  }

  // Obtener todos los usuarios
  getAllUsers(): void {
    this.perfilService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (error) => {
        console.error('Error al cargar los usuarios', error);
      }
    });
  }

  // Eliminar un usuario
  deleteUser(id: number): void {
    this.perfilService.deleteUser(id).subscribe({
      next: (response) => {
        if (response.status) {
          this.mostrarToast('Usuario eliminado correctamente de la base de datos', 'success');
          this.getAllUsers(); // Actualizamos la lista de usuarios después de eliminar
        }
      },
      error: (error) => {
        this.mostrarToast('Ha habido un error al eliminar el usuario', 'error');
      }
    });
  }

  // Cargar proyectos
  cargarProjects(): void {
    this.projectService.listarTodosProyectos().subscribe({
      next: (response) => {
        console.log(response);
        if (response.projects) {
          this.projects = response.projects;
        } else {
          console.error('Formato de respuesta de proyectos incorrecto', response);
        }
      },
      error: (error) => {
        console.log('Error al cargar los proyectos', error);
      }
    });
  }

  // Eliminar proyecto
  deleteProject(projectId: number): void {
    this.projectService.eliminarProyecto(projectId).subscribe({
      next: (response) => {
        if (response.status) {
          this.mostrarToast('Proyecto eliminado correctamente', 'success');
          this.cargarProjects(); // Recargar la lista de proyectos después de eliminar
        }
      },
      error: (error) => {
        this.mostrarToast('Ha habido un error al eliminar el proyecto', 'error');
        console.log(error);
      }
    });
  }

  // Alternar entre vista de usuarios y proyectos
  toggleView(): void {
    this.showUsers = !this.showUsers;

    if (this.showUsers) {
      this.getAllUsers(); // Cargar usuarios si estamos en el modo de usuarios
    } else {
      this.cargarProjects(); // Cargar proyectos si estamos en el modo de proyectos
    }
  }

  // Mostrar toast de éxito o error
  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}
