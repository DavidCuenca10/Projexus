import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://127.0.0.1:8000/api/login';

  constructor(private http: HttpClient) { }

  // Método para hacer login
  login(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Verifica si el token existe en localStorage
  }

  // Método para guardar el token en el localStorage
  // login.service.ts
  setToken(token: string): void {
    localStorage.setItem('token', token);
    console.log('Token guardado en localStorage:', token); // Verifica que el token se guarda
  }
}
