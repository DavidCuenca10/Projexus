import { Component, OnInit } from '@angular/core';
import { Project } from '../../interfaces/project';
import { ProjectService } from '../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Members } from '../../interfaces/members';
import { Task } from '../../interfaces/task';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfilService } from '../../services/perfil.service';
import Pusher from 'pusher-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-proyecto-detalles',
  standalone: false,
  templateUrl: './proyecto-detalles.component.html',
  styleUrl: './proyecto-detalles.component.css'
})
export class ProyectoDetallesComponent implements OnInit {
  public environment = environment;
  project: Project | undefined;
  members: Members[] = [];
  tasks: Task[] = [];

  // Nuevos filtros
  filtroEstado: string = 'all';
  filtroPrioridad: string = 'all';

  //Variable para controlar la solicitud
  mensajeSolicitud: string = '';

  // Variables para controlar los permisos
  isMember: boolean = false;
  isAdmin: boolean = false;
  isOwner: boolean = false;

  // ProjectId se asignará en el ngOnInit
  projectId!: number; // Aquí usamos la opción del modificador "!"

  //Variables para los modales
  usuarioSeleccionado: Members | null = null;
  // Tarea seleccionada para eliminar
  tareaSeleccionada: any = null;
  tipoModal: 'eliminarProyecto' | 'eliminarTarea' | 'usuario' | 'crearTarea' | null = null;
  minDate: string = new Date().toISOString().split('T')[0]; // formato 'YYYY-MM-DD'
  
  nuevaTarea = {
    title: '',
    description: '',
    assigned_to: null,
    priority: 'low',
    deadline: ''
  };
  rolCargado: boolean = false;
  nombreUsuario:string = '';
  token: string | null = null;
  messages: any[] = [];
  message = '';

  //Usamos un mapa para el chat, de maner que guardadmos el usuario y su imagen para no tener que pedirlas constantemente
  userImage = new Map<string, string>();
  
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private snackBar: MatSnackBar,
    private perfilService: PerfilService,
    private http: HttpClient
  ) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id')); //Obtenemos la id de la url que será el projectId
    this.token = localStorage.getItem('token');

    Pusher.logToConsole = true;

    const pusher = new Pusher('af5d3d381fa66787c245', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe(`chat.${this.projectId}`);

    channel.bind('message', (data: any) => {
      this.messages.push(data);
    });


    if (this.token) {
      this.perfilService.getProfile().subscribe({
        next: (response) => {
          // Solo asignas el nombre del usuario
          this.nombreUsuario = response.data.name;
        },
        error: (error) => {
          console.log('Perfil no encontrado', error);
        }
      });
    }

    // Obtener detalles del proyecto
    this.projectService.obtenerProyecto(this.projectId).subscribe(
      (response) => {
        if (response && response.project) {
          this.project = response.project;
          //console.log('Proyecto recibido:', response.project);
        } else {
          console.error('El proyecto no existe o no se ha encontrado.');
        }
      },
      (error) => {
        console.error('Error al obtener los detalles del proyecto', error);
      }
    );

    // Obtener miembros del proyecto
    this.projectService.obtenerUsuariosProyecto(this.projectId).subscribe({
      next: (data) => {
        // map(): recorre cada elemento de la lista y crea una nueva lista transformada.
        // miembro: es cada usuario dentro del array mientras lo recorremos en map.
        // ...miembro: spread, copia todas las propiedades del miembro original a un nuevo objeto.
        // originalRole: añadimos esta propiedad nueva al objeto, con el valor que viene de miembro.pivot.role (rol en el proyecto).
        // Hacemos una copia del miembro y le añadimos un campo extra (originalRole) que contiene el rol, para poder acceder a ese dato fácilmente sin meternos dentro de propiedades anidadas.
        this.members = data.members.map((miembro: Members) => ({
          ...miembro,
          originalRole: miembro.pivot.role // copiamos el rol original
        }));

        // Aquí llenamos el mapa con las imagenes de cada usuario para el chat
        this.members.forEach(member => {
          //Rellenamos con key nombre y imagen value, de manera que ya tenemos todas las imagenes de los miembros
          this.userImage.set(member.name, member.image_url);
        });
      },
      error: (error) => {
        console.error('Error cargando miembros:', error);
      }
    });

    // Obtener tareas del proyecto
    this.projectService.obtenerTareasProyecto(this.projectId).subscribe({
      next: (data) => {
        this.tasks = data.tasks;
      },
      error: (error) => {
        console.error('Error cargando las tareas:', error);
      }
    });

    // Verificar el rol del usuario en el proyecto
    this.projectService.verificarRolProyecto(this.projectId).subscribe({
      next: (response) => {
        this.isOwner = response.isOwner;
        this.isAdmin = response.isAdmin;
        this.isMember = response.isMember;
        //console.log('Mostrarndo botones');

        this.rolCargado = true;
      },
      error: (error) => {
        console.error('Error al verificar el rol del usuario', error);
        // Restablece todas las variables de control
        this.isOwner = false;
        this.isAdmin = false;
        this.isMember = false;
        console.log('Error al mostrar botones');

        this.rolCargado = true;
      }
    });
  }

  submit(): void {
    if (!this.token) {
      return;
    }

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    this.http.post('http://127.0.0.1:8000/api/messages', {
      username: this.nombreUsuario,
      message: this.message,
      project_id: this.projectId
    }, { headers }).subscribe(() => {
      this.message = '';
    }, error => {
      console.error('Error enviando mensaje:', error);
    });
  }

  // Método para filtrar tareas
  get tareasFiltradas() {
    return this.tasks.filter(tarea =>
      (this.filtroEstado === 'all' || tarea.status === this.filtroEstado) &&
      (this.filtroPrioridad === 'all' || tarea.priority === this.filtroPrioridad)
    );
  }

  // Método para seleccionar una tarea para mostrar su modal
  seleccionarTarea(tarea: any) {
    this.tareaSeleccionada = tarea;
    this.tipoModal = 'eliminarTarea';
  }

  seleccionarUsuario(usuario: Members) {
    this.usuarioSeleccionado = usuario;
    this.tipoModal = 'usuario';
  }

  abrirModalCrearTarea() {
    // Cambiar el tipo de modal a 'crearTarea'
    this.tipoModal = 'crearTarea';
  }
  
  seleccionarProyectoParaEliminar() {
    this.tipoModal = 'eliminarProyecto';
  }

  // Método de eliminación
  confirmarEliminacion() {
    //Eliminar tarea
    if (this.tipoModal === 'eliminarTarea' && this.tareaSeleccionada) {
      const taskId = this.tareaSeleccionada.id;
      this.projectService.eliminarTarea(this.projectId, taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== taskId);
          this.mostrarToast('Tarea eliminada correctamente', 'success');
          this.tipoModal = null; //Vaciamos el valor del modal
        },
        error: (error) => {
          if (error.status === 403) {
            this.mostrarToast('No tienes permisos para eliminar esta tarea', 'error');
          } else {
            this.mostrarToast('Error al eliminar la tarea', 'error');
          }
        }
      });
    //Eliminar usuario
    } else if (this.tipoModal === 'usuario' && this.usuarioSeleccionado) {
      const userId = this.usuarioSeleccionado.id;
      this.projectService.eliminarUsuario(this.projectId, userId).subscribe({
        next: () => {
          this.members = this.members.filter(m => m.id !== userId);
          this.mostrarToast('Miembro eliminado correctamente', 'success');
          this.tipoModal = null;
        },
        error: (error) => {
          if (error.status === 403) {
            this.mostrarToast('No tienes permisos para eliminar miembros', 'error');
          } else {
            this.mostrarToast('Error al eliminar el miembro', 'error');
          }
        }
      });
    } else if (this.tipoModal === 'eliminarProyecto') {
      this.projectService.eliminarProyecto(this.projectId).subscribe({
        next: () => {
          this.mostrarToast('Miembro eliminado correctamente', 'success');;
          this.router.navigate(['/home']);
          this.tipoModal = null;
        },
        error: (error) => {
          this.mostrarToast('Error al eliminar el proyecto', 'error');
        }
      })
    }
  
    // Reset
    this.tareaSeleccionada = null;
    this.usuarioSeleccionado = null;
    this.tipoModal = null;
  }
  

  // Accionar el boton de "Solicitar acceso"
  solicitarAcceso() {
    this.projectService.solicitarAccesoProyecto(this.projectId).subscribe({
      next: (response) => {
        console.log('Solicitud enviada', response.message);
        this.mensajeSolicitud = response.message;
      },
      error: (error) => {
        console.log('Error al enviar solicitud');
        this.mensajeSolicitud = error.error.message;
      }
    });
  }

  //Guardar los datos del desplegable de cambio de rol para el owner
  guardarCambioRol(miembro: Members) {
    const nuevoRol = miembro.pivot.role;
    const userId = miembro.id;
  
    this.projectService.cambiarRol(this.projectId, userId, nuevoRol).subscribe({
      next: (res) => {
        console.log('Rol actualizado correctamente');
        miembro.originalRole = nuevoRol;
        this.mostrarToast('Rol cambiado correctamente', 'success');
      },
      error: (error) => {
        if (error.status === 403) {
          this.mostrarToast('No tienes permisos para cambiar roles', 'error');
        } else {
          this.mostrarToast('Error al cambiar rol', 'error');
        }
      }
    });
  }

  //Crear tarea a partir del formulario (modal)
  crearTarea() {
    const tareaFormateada = {
      title: this.nuevaTarea.title,
      description: this.nuevaTarea.description,
      assigned_to: this.nuevaTarea.assigned_to,
      priority: this.nuevaTarea.priority,
      deadline: this.nuevaTarea.deadline,
    };
  
    this.projectService.crearTarea(this.projectId, tareaFormateada).subscribe({
      next: (response) => {
        console.log('Tarea creada');
  
        // Añadir la nueva tarea al array local
        this.tasks.push(response.task);
  
        // Cerrar modal
        const modalCheckbox = document.getElementById('btn-modal') as HTMLInputElement;
        if (modalCheckbox) {
          modalCheckbox.checked = false;
        }
  
        // Reset del formulario
        this.nuevaTarea = {
          title: '',
          description: '',
          assigned_to: null,
          priority: 'low',
          deadline: ''
        };
        this.mostrarToast('Tarea creada correctamente', 'success');
        this.tipoModal = null; //Vaciamos el valor del modal
      },
      error: (error) => {
        if (error.status === 403) {
          this.mostrarToast('No tienes permisos para crear tareas', 'error');
        } else {
          this.mostrarToast('Error al crear tarea', 'error');
        }
      }
    });
  }

  //Eliminar proyecto
  eliminarProyecto() {
      this.projectService.eliminarProyecto(this.projectId).subscribe(
        (response) => {
          console.log('Proyecto eliminado con éxito');
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error al eliminar el proyecto:', error);
        }
      );
  }

  //Funcion para mostar los toast
  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    //console.log('Clase aplicada:', tipo === 'success' ? 'snackbar-success' : 'snackbar-error');
    this.snackBar.open(mensaje, 'X', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  //Getter que devuelve string (nombre) para acceder al nombre del owner en el html con el nombre del getter {{ nombreOwner }}
  get nombreOwner(): string{
    // Hacemos find para encontrar la primera coincidencia que tenga, la m representa el miembro, accedemos al 
    // id del miembro (m.id) y compararmos esa id con el owner de proyecto, si existe se guarda en la variable 
    // owner con los atributos de miembro con lo cual podemos acceder a su nombre a traves de owner(variable).name(atributo del miembro).
    const owner = this.members.find(m => m.id === this.project?.owner_id);
    return owner ? owner.name : 'Cargando...';
  }

  get imageOwner(): string{
    const owner = this.members.find(m => m.id === this.project?.owner_id);
    return owner ? owner.image_url : 'Cargando...';
  }

  getImagePorUsuario(username: string): string {
    //Si imagenPath es null metemos la ruta local. Si la izquierda es null devuelve la derecha basicamente
    const imagePath = this.userImage.get(username) ?? 'perfiles/pordefecto.png';
    //Si existe una iamgenPath empezando con perfiles/, me devuelves directamente imagenPath, sino concatenas el env con la imagenPath que nos da el map
    return imagePath.startsWith('perfiles/') ? imagePath : `${environment.apiUrl}/${imagePath}`;
  }

  //Funcion para que se haga scroll automatico en el chat
  scrollToBottom() {
    try {
      const container = document.getElementById('chatMensajesContainer');
      if(container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (error) {
      console.error('Error haciend scroll')
    }
  }
}