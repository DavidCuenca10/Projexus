import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
declare var AOS: any;

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  proyectosActivos: Project[] = [];
  proyectoDetalle: Project | null = null; // Variable para almacenar el proyecto con más detalles
  public page!: number;
  
  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getProyectosActivos();
    AOS.init();
  }

  getProyectosActivos(): void {
    this.projectService.listarProyectosActivos().subscribe(
      (response: any) => {
        this.proyectosActivos = response.projects; // Aquí guardamos los proyectos activos
      },
      (error) => {
        console.error('Error al obtener los proyectos activos', error);
      }
    );
  }

  //Metodo que se activará cuando el usuario haga
  verDetallesProyecto(id: number): void {
    this.projectService.obtenerProyecto(id).subscribe(
      (response: any) => {
        this.proyectoDetalle = response.project; // Aquí guardamos el proyecto detallado
      },
      (error) => {
        console.error('Error al obtener los detalles del proyecto', error);
      }
    );
  }
}
