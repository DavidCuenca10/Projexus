import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private apiUrl = `${environment.apiUrl}/api/solicitudes`;

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
