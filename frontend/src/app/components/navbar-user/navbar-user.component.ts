// En navbar-user.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Router } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes.service';
import { ProjectService } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-navbar-user',
  standalone: false,
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit {
  public environment = environment;
  name: string = '';
  token: string | null = null;
  userId: number | null = null;
  notificaciones: any[] = [];
  loading: boolean = false;
  imagenCargada: boolean = false;

  isDropdownOpen = false; // Para manejar si el dropdown está abierto o no
  userImage: string | null = null;
  intervalId: any;

  constructor(
    private perfilService: PerfilService,
    private router: Router,
    private solicitudesService: SolicitudesService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.perfilService.getProfile().subscribe(
        (response: any) => {
          if (response.status) {
            this.name = response.data.name;
            this.userId = response.data.id;

            if (response.data.image_url) {
              this.userImage = response.data.image_url;
              this.imagenCargada = true;
            }

            this.obtenerSolicitudes();
            
            this.intervalId = setInterval(() => {
              this.obtenerSolicitudes();
            }, 20000);
          }
        },
        error => {
          console.error('Error al cargar el perfil', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
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
        this.ocultarNotificacionLocal(projectId, userId);
        this.mostrarToast('Has aceptado la solicitud', 'success');
      },
      error => {
        console.error('Error al aceptar al miembro', error);
        this.mostrarToast('Ha habido un error con la solicitud', 'error');
      }
    );
  }

  // Método para rechazar miembro
  rechazarMiembro(projectId: number, userId: number) {
    this.projectService.rechazarMiembro(projectId, userId).subscribe(
      response => {
        console.log('Solicitud rechazada', response);
        this.ocultarNotificacionLocal(projectId, userId);
        this.mostrarToast('Has rechazado la solicitud', 'error');
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
  //Simplemente es para la aniumacion de la flechita
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

  //Metodo para eliminar la notificacion cuando se le da el click
  ocultarNotificacionLocal(projectId: number, userId: number) {
    //Crea un nuevo array con las notificaciones que no son las que acabamos de procesas, filtramos la que acabamos de procesar y mostramos el nuevo array sin ella
    this.notificaciones = this.notificaciones.filter(
      noti => !(noti.project_id === projectId && noti.user_id === userId)
    );
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
