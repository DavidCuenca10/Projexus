import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private loginService: LoginService, private router: Router) {}

  completeInicio() {
    const inicioDatos = {
      email: this.email,
      password: this.password
    };

    this.loginService.login(inicioDatos).subscribe(
      (response) => {
        if (response.status) { // Verifica que el backend devuelva status = true
          console.log('Inicio exitoso:');
          
          // Usar LoginService para guardar el token en lugar de localStorage directamente
          this.loginService.setToken(response.token); // Usamos el método de LoginService
          this.resetForm();
          this.router.navigate(['/home']);
        } else {
          alert(response.message || 'Error en el inicio de sesión.');
        }
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        alert(error.error.message || 'Hubo un problema con iniciar sesión.');
        this.resetForm();
      }
    );
  }

  resetForm() {
    this.email = '';
    this.password = '';
  }
}
