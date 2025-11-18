import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  constructor(private http: HttpClient) { }

  // Función helper para extraer data de la respuesta
  private extractData(response: any): any {
    return response.data !== undefined ? response.data : response;
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}categorias`).pipe(
      map(this.extractData)
    );
  }

  getCategoriaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}categorias/${id}`).pipe(
      map(this.extractData)
    );
  }

  getSubcategorias(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}subcategorias`).pipe(
      map(this.extractData)
    );
  }

  getSubcategoriasPorCategoria(idCategoria: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}subcategorias/categoria/${idCategoria}`).pipe(
      map(this.extractData)
    );
  }

  addCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}categorias`, categoria).pipe(
      map(this.extractData)
    );
  }

  deleteCategoria(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}categorias/${id}`).pipe(
    map(response => response?.data || response)
  );
  }

  updateCategoria(id: string, categoria: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}categorias/${id}`, categoria).pipe(
      map(this.extractData)
    );
  }

  addSubcategoria(subcategoria: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}subcategorias`, subcategoria).pipe(
      map(this.extractData)
    );
  }

  updateSubcategoria(id: string, subcategoria: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}subcategorias/${id}`, subcategoria).pipe(
      map(this.extractData)
    );
  }

  deleteSubcategoria(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}subcategorias/${id}`).pipe(
    map(response => response?.data || response)
  );
  }

  desactivarCategoria(id: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}categorias/${id}/desactivar`, {}).pipe(
      map(this.extractData)
    );
  }

  activarCategoria(id: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}categorias/${id}/activar`, {}).pipe(
      map(this.extractData)
    );
  }

  cambiarEstadoSubcategoria(id: string, estado: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}subcategorias/${id}/estado`, { estado }).pipe(
      map(this.extractData)
    );
  }

  getTalleresFiltrados(filtros: {
    id_categoria?: string;
    id_subcategoria?: string;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }): Observable<any[]> {
    const params: any = {};

    if (filtros.id_categoria) params.id_categoria = filtros.id_categoria;
    if (filtros.id_subcategoria) params.id_subcategoria = filtros.id_subcategoria;
    if (filtros.estado) params.estado = filtros.estado;
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio;
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin;

    return this.http.get<any>(`${environment.apiUrl}talleres/filtrar/talleres`, { params }).pipe(
    map(response => {
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data || [];
    })
  );
  }

  addTaller(tallerData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}talleres`, tallerData).pipe(
      map(this.extractData)
    );
  }

  updateTaller(idTaller: string, tallerData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}talleres/${idTaller}`, tallerData).pipe(
      map(this.extractData)
    );
  }

deleteTaller(idTaller: string): Observable<any> {
  return this.http.delete<any>(`${environment.apiUrl}talleres/${idTaller}`).pipe(
    map(response => response?.data || response)
  );
}

  getInscripciones(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}inscripciones`).pipe(
      map(this.extractData)
    );
  }

  getDetalleInscripciones(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}detalle-inscripciones`).pipe(
      map(this.extractData)
    );
  }

  cambiarEstadoInscripcion(id: string, estado: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}inscripciones/${id}/estado`, { estado }).pipe(
      map(this.extractData)
    );
  }

  getTalleres(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}talleres`).pipe(
      map(this.extractData)
    );
  }

  createProfesor(profesorData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}profesor`, profesorData).pipe(
      map(this.extractData)
    );
  }

getProfesores(): Observable<any[]> {
  return this.http.get<any>(`${environment.apiUrl}profesor`).pipe(
    map(response => {
      // Extrae el array de profesores de la estructura anidada
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data || [];
    })
  );
}

  updateProfesor(idProfesor: string, profesorData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}profesor/${idProfesor}`, profesorData).pipe(
      map(this.extractData)
    );
  }

  deleteProfesor(idProfesor: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}profesor/${idProfesor}`).pipe(
      map(this.extractData)
    );
  }

  createActividad(actividadData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}actividades`, actividadData).pipe(
      map(this.extractData)
    );
  }

  getActividades(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}actividades`).pipe(
    map(response => {
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data || [];
    })
  );
  }

  updateActividad(idActividad: string, actividadData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}actividades/${idActividad}`, actividadData).pipe(
      map(this.extractData)
    );
  }

  deleteActividad(idActividad: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}actividades/${idActividad}`).pipe(
      map(this.extractData)
    );
  }

  createPremios(premioData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}premios`, premioData).pipe(
      map(this.extractData)
    );
  }

  getPremios(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}premios`).pipe(
    map(response => {
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data || [];
    })
  );
  }

  updatePremio(idPremio: string, premioData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}premios/${idPremio}`, premioData).pipe(
      map(this.extractData)
    );
  }

  deletePremio(idPremio: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}premios/${idPremio}`).pipe(
      map(this.extractData)
    );
  }

  createFestival(festivalData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}festivales`, festivalData).pipe(
      map(this.extractData)
    );
  }

  getFestivales(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}festivales`).pipe(
      map(this.extractData)
    );
  }

  getFstivalesActivos(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}festivales/estado/activos`).pipe(
      map(this.extractData)
    );
  }

  updateFestival(idFestival: string, festivalData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}festivales/${idFestival}`, festivalData).pipe(
      map(this.extractData)
    );
  }

  deleteFestival(idFestival: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}festivales/${idFestival}`).pipe(
      map(this.extractData)
    );
  }

  cambiarEstadoFestival(id: string, estado: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}festivales/${id}/estado`, { estado }).pipe(
      map(this.extractData)
    );
  }

  createServicio(servicioData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}servicios`, servicioData).pipe(
      map(this.extractData)
    );
  }

  getServicios(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}servicios`).pipe(
      map(this.extractData)
    );
  }

  updateServicio(idServicio: string, servicioData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}servicios/${idServicio}`, servicioData).pipe(
      map(this.extractData)
    );
  }

  deleteServicio(idServicio: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}servicios/${idServicio}`).pipe(
      map(this.extractData)
    );
  }

  inscribirseTaller(inscripcionData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}inscripciones`, inscripcionData).pipe(
      map(this.extractData)
    );
  }

  crearDetalleInscripcion(detalleData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}detalle-inscripciones`, detalleData).pipe(
      map(this.extractData)
    );
  }

  getUserSinContrasena(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}auth/usuarios-sin-password`).pipe(
      map(this.extractData)
    );
  }
}