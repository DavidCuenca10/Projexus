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
  errorMensaje: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  completeInicio() {
    // Validación simple antes de enviar
    if (!this.email || !this.password) {
      return;
    }

    const inicioDatos = {
      email: this.email,
      password: this.password
    };

    this.loginService.login(inicioDatos).subscribe(
      (response) => {
        if (response.status) {
          this.loginService.setToken(response.token);
          this.resetForm();
          this.router.navigate(['/home']);
        } else {
          this.errorMensaje = response.message || 'Error en el inicio de sesión.';
        }
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        if (this.email && this.password) {
          this.errorMensaje = error.error.message || 'Error en el inicio de sesión.';
        }
      }
    );
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.errorMensaje = '';
  }
}
