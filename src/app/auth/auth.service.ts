import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';

import { Credentials, CredentialsUser, Login, User } from './user.model';
import { environment } from 'src/environments/environment';
import { addToken } from './token-interceptor.interceptor';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  logged = new BehaviorSubject<boolean>(false);
  vacio!:CredentialsUser;
  user = new BehaviorSubject<CredentialsUser>(this.vacio);
  usuario!: Subject<User>;

  isLoggedIn: boolean = false;
  dataUsers$!:Subject<User[]>;
  arrayUsers:User[]=[];

  constructor(private http: HttpClient, private router: Router) {
    this.usuario = new Subject<User>();
    this.dataUsers$ = new Subject<User[]>();
  }

  public isLogged(): boolean {
    return this.isLoggedIn;
  }
  signup(user: User): Observable<User> {
    return this.http.post<User>(environment.baseUrl + '/api/users', user);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.baseUrl + '/api/users');
  }
  ingresar(cred:Credentials) : Observable<User>{

        for (let user of this.arrayUsers){
          if (user.email == cred.email && user.password == cred.password){
            this.logged.next(true);
            this.isLoggedIn = true;
            this.usuario.next(user);
            console.log(user);
            this.router.navigate(['/home']);
          }
        }
       
    return this.usuario;
  }

  login(credentials: Credentials): Observable<CredentialsUser> {
    return this.http
      .post<CredentialsUser>(
        environment.baseUrl + '/api/users', credentials
        , { context: addToken() }
      ).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.id,
            resData.password,
            resData.token

          );
        })
      );
  }

  getUser(id: any): Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/users/${id}`,
      this.getHttpHeaders());
  }

  getHttpHeaders() {
    const token = localStorage.getItem('userData');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
  private handleAuthentication(
    email: string,
    userId: number,
    password: string,
    token: string,
  ) {
    const user = new CredentialsUser(email, userId, password, token);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}