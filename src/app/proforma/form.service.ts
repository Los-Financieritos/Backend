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

  entidades$!: Subject<Entidad[]>;
  proforms$!: Subject<Form[]>;
  proform$!: Subject<Form>;
  proform!: Form;
  
  constructor(private http: HttpClient) {
    this.entidades$ = new Subject<Entidad[]>();
    this.proforms$ = new Subject<Form[]>();
    this.proform$ = new Subject<Form>();
  }

  getEntidades(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(`${environment.baseUrl}/api/entidades`);
  }

  getProforms(): Observable<Form[]> {
    return this.http.get<Form[]>(`${environment.baseUrl}/api/forms`);
  }
  getProformById(id: number):Observable<Form>{
    return this.http.get<Form>(`${environment.baseUrl}/api/forms/${id}`);
  }

  addForm(obj: Form) {
    return this.http.post<Form>(`${environment.baseUrl}/api/forms`, obj);
  }

  getEntidadById(id: number): Observable<Entidad> {
    return this.http.get<Entidad>(`${environment.baseUrl}/api/entidades/${id}`);
  }
  
}

