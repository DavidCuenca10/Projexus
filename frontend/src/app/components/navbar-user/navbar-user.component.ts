// En navbar-user.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Router } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-navbar-user',
  standalone: false,
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit {
  name: string = '';
  token: string | null = null;
  userId: number | null = null;
  notificaciones: any[] = [];
  loading: boolean = false;

  isDropdownOpen = false; // Para manejar si el dropdown está abierto o no
  userImage: string = 'perfiles/pordefecto.png'

  constructor(
    private perfilService: PerfilService,
    private router: Router,
    private solicitudesService: SolicitudesService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    this.obtenerSolicitudes(); // primera carga
      /*setInterval(() => {
        this.obtenerSolicitudes(); // actualiza cada 10 segundos
      }, 10000);
    */
    if (this.token) {
      this.perfilService.getProfile().subscribe(
        (response: any) => {
          if (response.status) {
            this.name = response.data.name;  // Aquí guardamos el nombre del usuario
            this.userId = response.data.id; //Sacamos el id del usuario para utilizarlo

            //Pillamos la imagen de perfil del usuario
            if(response.data.image_url) {
              this.userImage = response.data.image_url;
            }
          }
        },
        error => {
          console.error('Error al cargar el perfil', error);
        }
      );
    }
  }

  obtenerSolicitudes(): void {
    this.loading = true; // Iniciamos la carga
    this.solicitudesService.obtenerSolicitudesPendientes().subscribe(
      (response) => {
        this.loading = false; // Desactivamos la carga
        if (response.data) {
          this.notificaciones = response.data; // Asignamos las solicitudes al array
        }
      },
      (error) => {
        this.loading = false; // Desactivamos la carga
        console.error('Error al obtener las solicitudes:', error); // Mostramos el error si lo hay
      }
    );
  }

  // Método para aceptar miembro
  aceptarMiembro(projectId: number, userId: number) {
    this.projectService.aceptarMiembro(projectId, userId).subscribe(
      response => {
        console.log('Usuario aceptado', response);
      },
      error => {
        console.error('Error al aceptar al miembro', error);
      }
    );
  }

  // Método para rechazar miembro
  rechazarMiembro(projectId: number, userId: number) {
    this.projectService.rechazarMiembro(projectId, userId).subscribe(
      response => {
        console.log('Solicitud rechazada', response);
        // Aquí puedes manejar el cambio en la interfaz o lo que necesites
      },
      error => {
        console.error('Error al rechazar al miembro', error);
      }
    );
  }

  irAPerfil(){
    this.router.navigate(['/perfil']);
  }

  proyectosUsuario(){
    //proyectos/usuario/:id

    if(this.userId !== null){
      this.router.navigate([`/proyectos/usuario/${this.userId}`]);
    } else {
      console.log('Usuario no disponible');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token = null;
    this.router.navigate(['/']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Método para alternar el estado del dropdown, si está abierto se cierra si esta cerrado se abre
  toggleDropdown() {
    // Cambia el valor de `isDropdownOpen`. Si es `false` lo pone a `true` (abre el dropdown),
    // si es `true` lo pone a `false` (cierra el dropdown)
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  

  // Detecta clics fuera del área del dropdown y cierra el dropdown
  @HostListener('document:click', ['$event']) //Todos los clicks en el documento
  closeDropdown(event: MouseEvent) {
    // `event.target` es el objeto que recibió el clic.
    const target = event.target as HTMLElement; // Aseguramos que `event.target` es un elemento HTML
    
    // `closest('.btn')` busca el elemento más cercano al que se hizo clic que tenga la clase `.btn`.
    // Esto nos permite saber si el clic fue dentro del botón del dropdown.

    // .closest('.btn') busca el ancestro más cercano (incluyéndose a sí mismo) que tenga la clase 'btn'
    const dropdownButton = target.closest('.btn');  // Verifica si el clic fue en el botón del dropdown

    // Si el dropdown está abierto (`this.isDropdownOpen` es `true`) y el clic fue fuera del botón (`!dropdownButton`)
    // entonces cerramos el dropdown.
    if (this.isDropdownOpen && !dropdownButton) {
      this.isDropdownOpen = false;  // Cierra el dropdown si el clic es fuera del área del botón o del dropdown
    }
  }
}
