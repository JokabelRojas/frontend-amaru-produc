// src/app/features/cliente/services/categoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Categoria } from '../models/categoria.model';
import { Subcategoria } from '../models/subcategoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}categorias`;
  private apiSubUrl = `${environment.apiUrl}subcategorias`;

  constructor(private http: HttpClient) {}

  // =======================
  // CATEGORIAS
  // =======================
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoriasActivas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/activos`);
  }

  getCategoriaPorId(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  crearCategoria(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  actualizarCategoria(id: string, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  eliminarCategoria(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  activarCategoria(id: string): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/activar/${id}`, {});
  }

  desactivarCategoria(id: string): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/desactivar/${id}`, {});
  }

  /**
   * NUEVO: Obtener solo categorías de tipo "servicio"
   */
  getCategoriasServicio(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/tipo/servicio`);
  }

  // =======================
  // SUBCATEGORIAS
  // =======================
  getSubcategorias(): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(this.apiSubUrl);
  }

  getSubcategoriasPorCategoria(idCategoria: string): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.apiSubUrl}/categoria/${idCategoria}`);
  }

  crearSubcategoria(subcategoria: Partial<Subcategoria>): Observable<Subcategoria> {
    return this.http.post<Subcategoria>(this.apiSubUrl, subcategoria);
  }

  actualizarSubcategoria(id: string, subcategoria: Partial<Subcategoria>): Observable<Subcategoria> {
    return this.http.put<Subcategoria>(`${this.apiSubUrl}/${id}`, subcategoria);
  }

  eliminarSubcategoria(id: string): Observable<Subcategoria> {
    return this.http.delete<Subcategoria>(`${this.apiSubUrl}/${id}`);
  }

  cambiarEstadoSubcategoria(id: string, estado: 'activo' | 'inactivo'): Observable<Subcategoria> {
    return this.http.patch<Subcategoria>(`${this.apiSubUrl}/estado/${id}`, { estado });
  }
}
