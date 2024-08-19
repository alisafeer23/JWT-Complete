import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('token');
    const authReq = authToken ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${authToken}`) }) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or unauthorized
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              if (response && response.token) {
                localStorage.setItem('token', response.token);
                const newAuthReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${response.token}`) });
                return next.handle(newAuthReq);
              } else {
                this.authService.logout();
                this.router.navigate(['/login']);
                return throwError(error);
              }
            }),
            catchError((err) => {
              this.authService.logout();
              this.router.navigate(['/login']);
              return throwError(err);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
