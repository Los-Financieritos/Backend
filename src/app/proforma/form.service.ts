import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entidad } from './entidad.interface';
import { Form } from './form.interface';

@Injectable({
  providedIn: 'root'
})
export class FormService {

    entidades$!:Subject<Entidad[]>;

  constructor(private http: HttpClient) {
    this.entidades$ = new Subject<Entidad[]>();

   }

  getEntidades(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(`${environment.baseUrl}/api/entidades`);
  }
  addForm(obj: Form) {
    return this.http.post<Form>(`${environment.baseUrl}/api/forms`, obj);
  }

  getEntidadById(id: number): Observable<Entidad> {
    return this.http.get<Entidad>(`${environment.baseUrl}/api/entidades/${id}`);
  }
}

