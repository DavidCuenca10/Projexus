import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-perfil-proyectos',
  standalone: false,
  templateUrl: './perfil-proyectos.component.html',
  styleUrl: './perfil-proyectos.component.css'
})
export class PerfilProyectosComponent implements OnInit {
  public environment = environment;
  proyectosUsuario: Project[] = [];
  public page!: number;
  rolCargado: boolean = false; //Para gestionar tema de cargas de botones

  // Objeto para guardar roles por proyecto
  rolesPorProyecto: { [id: number]: { isOwner: boolean, isAdmin: boolean, isMember: boolean } } = {};
  //rolesPorProyecto = {
  //1: { isOwner: true, isAdmin: false, isMember: true },};
  totalProyectos: number = 0;
  tipoModal: 'eliminarProyecto' | null = null;
  anteriorEstado: string = '';
  proyectoSeleccionado: any = null;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id')); // ID del usuario desde la URL

    if (userId) {
      // Obtienes los proyectos del usuario
      this.projectService.obtenerProyectosDeUsuario(userId).subscribe({
        next: (response) => {
          this.proyectosUsuario = response.projects;
          this.totalProyectos = this.proyectosUsuario.length
          // Verifica el rol de cada proyecto (recorremos los proyectos del usuario y comprobamos el rol de cada 1)
          this.proyectosUsuario.forEach((proyecto) => {
            this.verificarRol(proyecto.id); // Llama a la función de verificación para cada proyecto
            this.anteriorEstado = proyecto.estado // Guardamos el valor del estado del proyecto
          });
        },
        error: (error) => {
          console.error('Error al obtener proyectos del usuario:', error);
        }
      });
    } else {
      console.warn('No se encontró un ID válido en la URL.');
    }
  }

  // Método que verifica el rol de un proyecto
  verificarRol(projectId: number): void {
    this.projectService.verificarRolProyecto(projectId).subscribe({
      next: (response) => {
        // Almacena la respuesta por proyecto
        this.rolesPorProyecto[projectId] = {
          isOwner: response.isOwner,
          isAdmin: response.isAdmin,
          isMember: response.isMember,
        };
        this.rolCargado = true
      },
      error: (error) => {
        console.error('Error verificando rol para el proyecto', error);
        // Por defecto, en caso de error, se asigna false a todos los roles
        this.rolesPorProyecto[projectId] = {
          isOwner: false,
          isAdmin: false,
          isMember: false
        };
        this.rolCargado = true
      }
    });
  }

  //Salir del proyecto
  salirDelProyecto(projectId:number){
    this.projectService.salirDelProyecto(projectId).subscribe({
      next: (response) => {
        this.proyectosUsuario = this.proyectosUsuario.filter(proyecto => proyecto.id !== projectId);
        this.totalProyectos = this.proyectosUsuario.length
        this.mostrarToast('Te has salido del proyecto', 'success');
      },
      error: (error) => {
        this.mostrarToast('No te has podido salir', 'error');
      }
    })
  }

  seleccionarProyectoParaEliminar(project: any) {
    // Cambiar el tipo de modal a 'eliminarProyecto'
    this.proyectoSeleccionado = project;
    this.tipoModal = 'eliminarProyecto';
  }

  //Eliminar proyecto
  eliminarProyecto(projectId:number) {
    this.projectService.eliminarProyecto(projectId).subscribe({
      next: (response) => {
      // Eliminar el proyecto del array local
      this.proyectosUsuario = this.proyectosUsuario.filter(proyecto => proyecto.id !== projectId);
      this.totalProyectos = this.proyectosUsuario.length;

      this.mostrarToast('Proyecto eliminado correctamente', 'success');
      this.tipoModal = null; //Vaciamos el valor del modal
      },
      error: (error) => {
        this.mostrarToast('No se he podido eliminar el proyecto', 'error');
      }
    });
  }

  actualizarEstado(project: any) {
    const projectId = project.id;
    const nuevoEstado = project.estado;

    this.projectService.actualizarEstadoProyecto(projectId, nuevoEstado).subscribe({
      next: (response) => {
        project.anteriorEstado = nuevoEstado;
        this.mostrarToast('Proyecto actualizado correctamente', 'success');
      },
      error: (error) => {
        this.mostrarToast('No se he podido actaulizar el proyecto', 'error');
      }
    });
  }

  // Comprobar si el usuario es Owner, sino false
  esOwner(id: number): boolean {
    return this.rolesPorProyecto[id]?.isOwner ?? false;
  }

  // Comprobar si el usuario no es Owner (para ocultar el botón "Eliminar proyecto")
  noEsOwner(id: number): boolean {
    return !this.esOwner(id);
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.snackBar.open(mensaje, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}
