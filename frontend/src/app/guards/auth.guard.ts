import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isAuthenticated = this.loginService.isAuthenticated();
    const rutaIntentada = state.url; 
    
    // Rutas estáticas protegidas
    const protectedRoutes = ['/home', '/crear-proyecto'];

    // Expresión regular para cualquier ruta dinámica tipo '/algo/:id'
    const dynamicRouteRegex = /^\/\w+\/[\w-]+$/;

    if (isAuthenticated && (rutaIntentada === '/login' || rutaIntentada === '/register')) {
      // Si el usuario está autenticado y quiere entrar a login/register, lo manda a home
      this.router.navigate(['/home']);
      return false;
    }

    if (!isAuthenticated && (protectedRoutes.some(route => rutaIntentada.startsWith(route)) || dynamicRouteRegex.test(rutaIntentada))) {
      // Si el usuario NO está autenticado y quiere entrar a una ruta protegida o una ruta dinámica tipo '/algo/:id'
      this.router.navigate(['/login']);
      return false;
    }

    return true; // Si ninguna de las condiciones se cumple, permite el acceso
  }
}
