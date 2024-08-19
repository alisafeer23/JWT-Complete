import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { decodeToken } from './token-utils'; // Import the decodeToken function

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5050';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-token`, credentials);
  }

  refreshToken(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(null);
    }
    return this.http.post(`${this.apiUrl}/refresh-token`, { token }).pipe(
      catchError(error => {
        this.logout();
        return of(null);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const expiryDate = this.getTokenExpiry(token);
    if (expiryDate && new Date() > expiryDate) {
      this.refreshToken().subscribe(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      });
      return false;
    }

    return true;
  }

  getTokenExpiry(token: string): Date | null {
    try {
      const decodedToken: any = decodeToken(token);
      if (decodedToken && decodedToken.exp) {
        return new Date(decodedToken.exp * 1000);
      }
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
