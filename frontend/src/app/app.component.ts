import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Projexus';
  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
    if (this.loginService.isAuthenticated()) {
      this.router.navigate(['/home']); // Si hay sesión, va directo a home
    }
  }
}
