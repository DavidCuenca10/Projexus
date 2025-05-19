import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
import { environment } from '../../../environments/environment.development';
declare var AOS: any;

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  public environment = environment;
  proyectosActivos: Project[] = [];
  public page!: number; //Variable para la paginacion
  
  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getProyectosActivos();
    AOS.init(); //Animaciones
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
}