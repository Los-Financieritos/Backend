import { Injectable } from '@angular/core';
import { Client } from './client.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  client$!:Subject<Client>;

  constructor(private http: HttpClient) {
    this.client$ = new Subject<Client>();
  }
  getClients() :Observable<Client[]>{
    return this.http.get<Client[]>(`${environment.baseUrl}/api/clients`);
  }
  addClient(obj: Client) {
    return this.http.post<Client>(`${environment.baseUrl}/api/clients`,  obj);  
  }
  
  getClientById(id: string):Observable<Client>{
    return this.http.get<Client>(`${environment.baseUrl}/api/clients/${id}`);
  }

  updateClient(id: string, obj: Client) {
    return this.http.put<Client>(`${environment.baseUrl}/api/clients/${id}`, obj);
  }
}
