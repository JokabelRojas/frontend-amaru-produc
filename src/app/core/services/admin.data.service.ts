import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AdminDataService {

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}categorias`);
  }

  getCategoriaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}categorias/${id}`);
  }
  getSubcategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}subcategorias`)
  }
    getSubcategoriasPorCategoria(idCategoria: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}subcategorias/categoria/${idCategoria}`);
  }
  addCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}categorias`, categoria);
  }
  deleteCategoria(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}categorias/${id}`);
  }
  updateCategoria(id: string, categoria: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}categorias/${id}`, categoria);
  }
  addSubcategoria(subcategoria: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}subcategorias`, subcategoria);
  }
  updateSubcategoria(id: string, subcategoria: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}subcategorias/${id}`, subcategoria);
  }
  deleteSubcategoria(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}subcategorias/${id}`);
  }

  desactivarCategoria(id: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}categorias/${id}/desactivar`, {});
  }
  activarCategoria(id: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}categorias/${id}/activar`, {});
  }

  cambiarEstadoSubcategoria(id: string, estado: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}subcategorias/${id}/estado`, { estado });
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

  return this.http.get<any[]>(`${environment.apiUrl}talleres/filtrar/talleres`, { params });
}

  
  addTaller(tallerData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}talleres`, tallerData);
  }
  updateTaller(idTaller: string, tallerData: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}talleres/${idTaller}`, tallerData);
  }

  deleteTaller(idTaller: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}talleres/${idTaller}`);
  }

    getInscripciones(): Observable<any[]> {
      return this.http.get<any[]>(`${environment.apiUrl}inscripciones`);
    }

    getDetalleInscripciones(): Observable<any[]> {
      return this.http.get<any[]>(`${environment.apiUrl}detalle-inscripciones`);
    }

  cambiarEstadoInscripcion(id: string, estado: string): Observable<any> {
  return this.http.patch<any>(`${environment.apiUrl}inscripciones/${id}/estado`, { estado });
}
getTalleres(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}talleres`);
  }

createProfesor(profesorData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}profesor`, profesorData);
  }
getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}profesor`);
  }

  updateProfesor(idProfesor: string, profesorData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}profesor/${idProfesor}`, profesorData);
  }
  deleteProfesor(idProfesor: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}profesor/${idProfesor}`);
  }


  createActividad(actividadData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}actividades`, actividadData);
  }
  getActividades(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}actividades`);
  }
  updateActividad(idActividad: string, actividadData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}actividades/${idActividad}`, actividadData);
  }
  deleteActividad(idActividad: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}actividades/${idActividad}`);
  }


  createPremios(premioData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}premios`, premioData);
  }
  getPremios(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}premios`);
  }
  updatePremio(idPremio: string, premioData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}premios/${idPremio}`, premioData);
  }
  deletePremio(idPremio: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}premios/${idPremio}`);
  }
  

  createFestival(festivalData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}festivales`, festivalData);
  }
  getFestivales(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}festivales`);
  }
  getFstivalesActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}festivales/estado/activos`);
  }
  updateFestival(idFestival: string, festivalData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}festivales/${idFestival}`, festivalData);
  }
  deleteFestival(idFestival: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}festivales/${idFestival}`);
  }
  cambiarEstadoFestival(id: string, estado: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}festivales/${id}/estado`, { estado });
  }


  createServicio(servicioData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}servicios`, servicioData);
  }
  getServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}servicios`);
  }
  updateServicio(idServicio: string, servicioData: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}servicios/${idServicio}`, servicioData);
  }
  deleteServicio(idServicio: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}servicios/${idServicio}`);
  }

  inscribirseTaller(inscripcionData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}inscripciones`, inscripcionData);
  }
  crearDetalleInscripcion(detalleData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}detalle-inscripciones`, detalleData);
  }
  getUserSinContrasena(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}auth/usuarios-sin-password`);
  }

}
