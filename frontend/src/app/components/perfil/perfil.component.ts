import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Task } from '../../interfaces/task';

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
  tareasPendientes: Task[] = [];  // Aseguramos que la propiedad existe para almacenar las tareas

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.perfilService.getProfile().subscribe({
        next: (response) => {
          // El perfil viene en response.data
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
        this.tareasPendientes = response.tareas;
      },
      error: (error) => console.error('Error al cargar tareas', error)
    });
  }
}
