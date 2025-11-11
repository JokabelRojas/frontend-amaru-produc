import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface Taller {
  _id?: string;
  nombre: string;
  descripcion?: string;
  fecha_inicio: string; // ISO string
  fecha_fin: string;    // ISO string
  horario: string;
  modalidad: 'presencial' | 'virtual' | 'hibrido';
  duracion: number;     // en horas
  precio: number;
  cupo_total: number;
  cupo_disponible?: number;
  id_categoria: string;
  id_subcategoria: string;
  estado?: 'activo' | 'inactivo';
  imagen_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TalleresService {
  private apiUrl = `${environment.apiUrl}talleres`;

  constructor(private http: HttpClient) {}

  /** Obtener todos los talleres */
  getTalleres(): Observable<Taller[]> {
    return this.http.get<Taller[]>(this.apiUrl);
  }

  /** Obtener talleres activos */
  getTalleresActivos(): Observable<Taller[]> {
    return this.http.get<Taller[]>(`${this.apiUrl}/activos`);
  }

  /** Obtener taller por ID */
  getTallerPorId(id: string): Observable<Taller> {
    return this.http.get<Taller>(`${this.apiUrl}/${id}`);
  }

  /** Crear un nuevo taller */
  crearTaller(taller: Taller): Observable<Taller> {
    return this.http.post<Taller>(this.apiUrl, taller);
  }

  /** Actualizar un taller existente */
  actualizarTaller(id: string, taller: Taller): Observable<Taller> {
    return this.http.put<Taller>(`${this.apiUrl}/${id}`, taller);
  }

  /** Eliminar un taller */
  eliminarTaller(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** Cambiar estado de un taller (activo/inactivo) */
  cambiarEstadoTaller(id: string, estado: 'activo' | 'inactivo'): Observable<Taller> {
    return this.http.patch<Taller>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
