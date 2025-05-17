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
    const url = state.url;

    const publicPaths = ['/login', '/register'];
    // Rutas protegidas que incluyen rutas con IDs (dinámicas)
    const protectedPrefixes = ['/profile', '/proyectos', '/solicitudes', '/messages', '/home'];

    if (!isAuthenticated) {
      // Si la URL empieza por alguna de las rutas protegidas, manda a login
      if (protectedPrefixes.some(prefix => url.startsWith(prefix))) {
        this.router.navigate(['/login']);
        return false;
      }
      // Permite acceso a rutas públicas (login, register)
      if (publicPaths.includes(url)) {
        return true;
      }
      // Por defecto, si no está autenticado y no es ruta pública, manda login
      this.router.navigate(['/login']);
      return false;
    } else {
      // Si está autenticado, no deja ir a login ni register
      if (publicPaths.includes(url)) {
        this.router.navigate(['/home']);
        return false;
      }
      return true; // Usuario autenticado puede acceder a cualquier otra ruta
    }
  }
}
