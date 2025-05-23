import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crear-proyecto',
  standalone: false,
  templateUrl: './crear-proyecto.component.html',
  styleUrl: './crear-proyecto.component.css'
})
export class CrearProyectoComponent {

  tags: string[] = [];  // Array que contiene las etiquetas añadidas
  tagInput: string = '';  // Variable que guarda el valor del campo de entrada
  imagePreview: string | null = null; // Variable que almacena la URL base64 de la imagen cargada (para la vista previa)

  // Inputs del formulario
  projectName: string = '';
  description: string = '';
  category: string = '';
  maxMembers: number = 1;
  deadline?: string;
  imageFile?: File; // Esta es la variable para la imagen seleccionada

  //Variable para pillar la fehca de hoy para el formulario y no permitir poner menos que la de hoy
  //declaramos objeto de tipo Date al minDate, lo pasamos a ISOString -> "2025-05-11T09:23:45.123Z" y spliteamos por la T para quedarnos con la fehca
  //luego tenemos la fecha actual en el html [min]
  minDate: string = new Date().toISOString().split('T')[0]; // formato 'YYYY-MM-DD'

  constructor(private projectService: ProjectService, private router: Router, private snackBar: MatSnackBar) {}
  
  //Etiquetas (chips)
  addTag(): void {
    const tag = this.tagInput.trim();  // Limpiamos espacios innecesarios alrededor del texto
    if (tag && !this.tags.includes(tag)) {  // Solo añadimos si no está vacío y no existe aún
      this.tags.push(tag);  // Añadimos la nueva etiqueta al array
    }
    this.tagInput = '';  // Limpiamos el campo de entrada después de añadir la etiqueta
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);  // Eliminamos la etiqueta en la posición 'index'
  }

  // Imagen previsual del proyecto
  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imageFile = file; // Asignamos el archivo a la variable imageFile

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Función que elimina la imagen cargada y limpia tanto la vista previa como el input de archivo
  removeImage(): void {
    this.imagePreview = null;
    this.imageFile = undefined; // Limpiamos también la variable imageFile

    const imageInput = document.getElementById('image') as HTMLInputElement;
    if (imageInput) {
      imageInput.value = '';
    }
  }

  crearProyecto(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const formData = new FormData();
  
    // Añadir campos al FormData ya que existe un archivo y se tiene que usar FormData no un simple json
    formData.append('name', this.projectName);
    formData.append('description', this.description);
    formData.append('category', this.category);
    formData.append('max_members', this.maxMembers.toString());
    formData.append('deadline', this.deadline || '');
    formData.append('tags', this.tags.join(',')); // Cadena separada por comas

    // Verificar que hay una imagen y agregarla al FormData
    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    }
  
    // Llamar al servicio
    this.projectService.crearProyecto(formData).subscribe(response => {
      console.log('Proyecto creado', response);
      this.mostrarToast('Proyecto creado correctamente', 'success');
      this.router.navigate(['/home']);
    }, error => {
      this.mostrarToast(error, 'error');
      console.error('Error al crear el proyecto', error);
    });
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