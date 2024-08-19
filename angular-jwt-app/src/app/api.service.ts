import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5050';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { responseType: 'json' });
  }

  generateToken(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-token`, credentials);
  }

  validateToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-token`, { token });
  }

  getAllUsers(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-all-users`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  getUserDetails(id: number, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-user-details/${id}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  getAllFruits(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-fruits`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }
}
