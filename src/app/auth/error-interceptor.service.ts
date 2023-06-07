import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
  
          if (error.status === 401)
            return throwError('No posee permisos suficientes.');
          else if (error.status === 403)
            return throwError('Acceso prohibido.');
          else if (error.status === 404)
            return throwError('Registro no encontrado.');
          else
            return throwError('Ha ocurrido un error inesperado.');
  
        }),
      );
  }
}
