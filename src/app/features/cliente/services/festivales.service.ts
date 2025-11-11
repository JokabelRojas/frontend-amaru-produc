import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Festival } from '../models/festival.model';
import { Premio } from '../models/premio.model';

@Injectable({
  providedIn: 'root'
})
export class FestivalesService {

  private baseUrl = 'http://localhost:3000/api'; // Cambia al endpoint de tu backend

  constructor(private http: HttpClient) {}

  // FESTIVALES
  getFestivales(): Observable<Festival[]> {
    return this.http.get<Festival[]>(`${this.baseUrl}/festivales`);
  }

  createFestival(festival: Festival): Observable<Festival> {
    return this.http.post<Festival>(`${this.baseUrl}/festivales`, festival);
  }

  updateFestival(id: string, festival: Festival): Observable<Festival> {
    return this.http.put<Festival>(`${this.baseUrl}/festivales/${id}`, festival);
  }

  deleteFestival(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/festivales/${id}`);
  }

  // PREMIOS
  getPremios(): Observable<Premio[]> {
    return this.http.get<Premio[]>(`${this.baseUrl}/premios`);
  }

  createPremio(premio: Premio): Observable<Premio> {
    return this.http.post<Premio>(`${this.baseUrl}/premios`, premio);
  }

  updatePremio(id: string, premio: Premio): Observable<Premio> {
    return this.http.put<Premio>(`${this.baseUrl}/premios/${id}`, premio);
  }

  deletePremio(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/premios/${id}`);
  }
}
