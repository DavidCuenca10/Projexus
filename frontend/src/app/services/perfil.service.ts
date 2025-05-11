import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = 'http://127.0.0.1:8000/api/profile';

  constructor(private http:HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  obtenerTareasUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}