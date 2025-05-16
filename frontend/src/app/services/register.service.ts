import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = `${environment.apiUrl}/api/register`;

  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
