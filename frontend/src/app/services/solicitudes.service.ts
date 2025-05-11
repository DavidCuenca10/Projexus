import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private apiUrl = 'http://127.0.0.1:8000/api/solicitudes';

  constructor(private http: HttpClient) { }

  // Método para obtener las solicitudes pendientes del usuario
  obtenerSolicitudesPendientes(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
