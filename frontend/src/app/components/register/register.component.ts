import { Component } from '@angular/core';
import { RegisterService } from '../../services/register.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  step: number = 1;
  name = '';
  email = '';
  password = '';
  password_confirmation= '';
  selectedOptions: any = {
    salud: false,
    viajes: false,
    deporte: false,
    tecnologia: false,
    musica: false,
    arte: false
  };
  biography = '';
  preferences: string = '';

  areas = [
    { key: 'salud', label: 'Salud', icon: '🍎' },
    { key: 'viajes', label: 'Viajes', icon: '🏖️' },
    { key: 'deporte', label: 'Deporte', icon: '⚽' },
    { key: 'tecnologias', label: 'Tecnología', icon: '💻' },
    { key: 'musica', label: 'Música', icon: '🎵' },
    { key: 'arte', label: 'Arte', icon: '🎨' }
  ];

  constructor(private registerService: RegisterService, private router:Router) {}

  nextStep() {
  // Validación para el paso 1
  if (this.step === 1) {
    // Verifica si todos los campos están completos y las contraseñas coinciden
    if (this.name && this.email && this.password && this.password === this.password_confirmation) {
      this.step = 2; // Avanza al paso 2
    } else {
      console.log("Las contraseñas no coinciden o faltan campos");
    }
  }

  // Validación para el paso 2
  else if (this.step === 2) {
    // Verifica si al menos una opción está seleccionada en las áreas de interés
    if (Object.values(this.selectedOptions).includes(true)) {
      this.step = 3; // Avanza al paso 3
    } else {
      // Si no se selecciona ninguna opción, puedes mostrar un error o hacer algo
      console.log("Por favor selecciona al menos una opción");
    }
  }
}

  prevStep() {
    if (this.step === 2) {
      this.step = 1;
    } else if (this.step === 3) {
      this.step = 2;
    }
  }

  completeRegistration() {

    if(!this.biography) {
      this.biography = 'Hola soy';
    }

    this.preferences = Object.keys(this.selectedOptions)
                      .filter(key => this.selectedOptions[key])
                      .join(', ');

    const registrationData = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      selectedOptions: this.selectedOptions,
      biography: this.biography,
      preferences: this.preferences
    };

    this.registerService.register(registrationData).subscribe(
      (response) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']);
        this.resetForm();
      },
      (error) => {
        console.error('Error en el registro:', error);
        alert(error.error.message || 'Hubo un problema con el registro.');
        this.resetForm();
      }
    );
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.password_confirmation = '';
    this.selectedOptions = {
      option1: false,
      option2: false,
      option3: false,
      option4: false,
      option5: false,
      option6: false
    };
    this.biography = '';
    this.preferences = '';
    this.step = 1;
  }

  //Validar el correo
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }
}