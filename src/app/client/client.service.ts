import { Injectable } from '@angular/core';
import { Client } from './client.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {

  }
  getClients() :Observable<Client[]>{
    return this.http.get<Client[]>(`${environment.baseUrl}/api/clients`);
  }
  addClient(obj: Client) {
    return this.http.post<Client>(`${environment.baseUrl}/api/clients`,  obj);  
  }
  
  getClientById(id: number):Observable<Client>{
    return this.http.get<Client>(`${environment.baseUrl}/api/clients/${id}`);
  }
}
