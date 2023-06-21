import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject} from 'rxjs';

import { Credentials, User } from './user.model';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario$!: Subject<User>;

  isLoggedIn: boolean = false;
  dataUsers$!: Subject<User[]>;
  arrayUsers: User[] = [];
  keepLogin: boolean = false;
  
  constructor(private http: HttpClient, private router: Router, private snackbar:MatSnackBar) {
    this.usuario$ = new Subject<User>();
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

  getUserByEmail(ema: string, passw:string ) : Observable<User>{
    return this.http.get<User>(`${environment.baseUrl}/api/exists-user?email=${ema}&password=${passw}`);
  }
  getUserById(id: number) : Observable<User>{
    return this.http.get<User>(`${environment.baseUrl}/api/users/${id}`);
  }

  ingresar(cred: Credentials): Observable<User> {

    for (let user of this.arrayUsers) {
      if (user.email == cred.email && user.password == cred.password) {

        this.isLoggedIn = true;
        this.usuario$.next(user);
        
        this.keepLogin = true;
        this.snackbar.open('Login correcto!', '', {
          duration: 2000,
        });
        this.router.navigate(['/home/', user.id]);
      }
    }

    return this.usuario$;
  }


}

