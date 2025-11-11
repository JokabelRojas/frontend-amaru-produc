// src/app/features/cliente/services/servicios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Servicio } from '../models/servicio.model';
import { Categoria } from '../models/categoria.model';
import { Subcategoria } from '../models/subcategoria.model';
import { environment } from '../../../../environments/environment';

interface FiltrosServicios {
  id_categoria?: string;
  id_subcategoria?: string;
  estado?: 'activo' | 'inactivo';
}

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private readonly apiUrl = `${environment.apiUrl}servicios`;
  private readonly categoriasUrl = `${environment.apiUrl}categorias`;
  private readonly subcategoriasUrl = `${environment.apiUrl}subcategorias`;

  constructor(private http: HttpClient) {}

  // ==========================
  // SERVICIOS
  // ==========================

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl).pipe(
      map(servicios => servicios.map(s => this.mapServicio(s)))
    );
  }

  obtenerServiciosActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/activos`).pipe(
      map(servicios => servicios.map(s => this.mapServicio(s)))
    );
  }

  filtrarServicios(filtros: FiltrosServicios): Observable<Servicio[]> {
    let params = new HttpParams();
    if (filtros.id_categoria) params = params.set('id_categoria', filtros.id_categoria);
    if (filtros.id_subcategoria) params = params.set('id_subcategoria', filtros.id_subcategoria);
    if (filtros.estado) params = params.set('estado', filtros.estado);

    return this.http.get<Servicio[]>(`${this.apiUrl}/filtrar/servicios`, { params }).pipe(
      map(servicios => servicios.map(s => this.mapServicio(s)))
    );
  }

  obtenerServiciosPorCategoria(id_categoria: string): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/categoria/${id_categoria}`).pipe(
      map(servicios => servicios.map(s => this.mapServicio(s)))
    );
  }

  obtenerServiciosPorSubcategoria(id_subcategoria: string): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/subcategoria/${id_subcategoria}`).pipe(
      map(servicios => servicios.map(s => this.mapServicio(s)))
    );
  }

  crearServicio(servicio: Partial<Omit<Servicio, 'estado'> & { estado?: 'activo' | 'inactivo' }>): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, servicio).pipe(
      map(s => this.mapServicio(s))
    );
  }

  actualizarServicio(
    id: string,
    servicio: Partial<Omit<Servicio, 'estado'> & { estado?: 'activo' | 'inactivo' }>
  ): Observable<Servicio> {
    return this.http.patch<Servicio>(`${this.apiUrl}/${id}`, servicio).pipe(
      map(s => this.mapServicio(s))
    );
  }

  cambiarEstadoServicio(id: string, estado: 'activo' | 'inactivo'): Observable<Servicio> {
    return this.http.patch<Servicio>(`${this.apiUrl}/${id}/estado`, { estado }).pipe(
      map(s => this.mapServicio(s))
    );
  }

  eliminarServicio(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerServicioPorId(id: string): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`).pipe(map(s => this.mapServicio(s)));
  }

  // ==========================
  // CATEGORÍAS Y SUBCATEGORÍAS
  // ==========================

  getCategoriasServicio(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.categoriasUrl}/tipo/servicio`);
  }

  obtenerTodasCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriasUrl);
  }

  obtenerCategoriaPorId(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.categoriasUrl}/${id}`);
  }

  getSubcategoriasPorCategoria(id_categoria: string): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.subcategoriasUrl}/categoria/${id_categoria}`);
  }

  obtenerTodasSubcategorias(): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(this.subcategoriasUrl);
  }

  obtenerSubcategoriaPorId(id: string): Observable<Subcategoria> {
    return this.http.get<Subcategoria>(`${this.subcategoriasUrl}/${id}`);
  }

  // ==========================
  // UTILIDADES
  // ==========================

  /**
   * Mapea el servicio para asegurar que id_categoria y id_subcategoria
   * siempre tengan la propiedad 'nombre', útil para mostrar en templates
   */
  private mapServicio(servicio: Servicio): Servicio & { id_categoria_nombre: string; id_subcategoria_nombre: string } {
    const id_categoria_nombre = typeof servicio.id_categoria === 'string'
      ? 'Sin categoría'
      : servicio.id_categoria?.nombre || 'Sin categoría';

    const id_subcategoria_nombre = typeof servicio.id_subcategoria === 'string'
      ? 'Sin subcategoría'
      : servicio.id_subcategoria?.nombre || 'Sin subcategoría';

    return { ...servicio, id_categoria_nombre, id_subcategoria_nombre };
  }
}
