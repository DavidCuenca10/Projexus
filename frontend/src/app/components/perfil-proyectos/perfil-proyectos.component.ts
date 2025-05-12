import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-proyectos',
  standalone: false,
  templateUrl: './perfil-proyectos.component.html',
  styleUrl: './perfil-proyectos.component.css'
})
export class PerfilProyectosComponent implements OnInit {
  proyectosUsuario: Project[] = [];
  public page!: number;

  // Objeto para guardar roles por proyecto
  rolesPorProyecto: { [id: number]: { isOwner: boolean, isAdmin: boolean, isMember: boolean } } = {};
  totalProyectos: number = 0;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
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
          isMember: response.isMember
        };
      },
      error: (error) => {
        console.error('Error verificando rol para el proyecto', error);
        // Por defecto, en caso de error, se asigna false a todos los roles
        this.rolesPorProyecto[projectId] = {
          isOwner: false,
          isAdmin: false,
          isMember: false
        };
      }
    });
  }

  //Salir del proyecto
  salirDelProyecto(projectId:number){
    this.projectService.salirDelProyecto(projectId).subscribe({
      next: (response) => {
        // Aquí puedes realizar alguna acción como recargar la lista de proyectos o notificar al usuario
        this.proyectosUsuario = this.proyectosUsuario.filter(proyecto => proyecto.id !== projectId);
        this.totalProyectos = this.proyectosUsuario.length
      },
      error: (error) => {
        console.error('Error al salir del proyecto:', error);
      }
    })
  }

  // Comprobar si el usuario es Owner
  esOwner(id: number): boolean {
    return this.rolesPorProyecto[id]?.isOwner ?? false;
  }

  // Comprobar si el usuario no es Owner (para ocultar el botón "Eliminar proyecto")
  noEsOwner(id: number): boolean {
    return !this.esOwner(id);
  }
}
