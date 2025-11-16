import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderCliente } from '../../../../shared/components/header-cliente/header-cliente';
import { FooterCliente } from '../../../../shared/components/footer-cliente/footer-cliente';

// Interfaces para tipado fuerte
interface Categoria {
  _id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Subcategoria {
  _id: string;
  nombre: string;
  descripcion: string;
  id_categoria: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

interface Profesor {
  _id: string;
  nombre: string;
  descripcion: string;
  especialidad: string;
  imagen_url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Taller {
  _id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  horario: string;
  modalidad: string;
  precio: number;
  cupo_total: number;
  cupo_disponible: number;
  id_categoria: Categoria;
  id_subcategoria: Subcategoria;
  id_profesor: Profesor;
  estado: string;
  imagen_url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-talleres',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderCliente,FooterCliente],
  templateUrl: './talleres.html',
  styleUrls: ['./talleres.css']
})
export class Talleres implements OnInit {
  // Estado del componente
  talleres: Taller[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarTalleres();
  }

  /**
   * Carga los talleres desde la API
   */
  cargarTalleres(): void {
    this.cargando = true;
    this.error = '';

    this.getTalleres().pipe(
      finalize(() => {
        this.cargando = false;
      })
    ).subscribe({
      next: (talleres) => {
        this.talleres = talleres;
      },
      error: (error) => {
        console.error('Error al cargar talleres:', error);
        this.error = 'No se pudieron cargar los talleres. Por favor, intenta más tarde.';
        this.talleres = [];
      }
    });
  }

  /**
   * Obtiene los talleres desde la API
   */
  getTalleres(): Observable<Taller[]> {
    return this.http.get<Taller[]>(`${environment.apiUrl}talleres/activos`).pipe(
      catchError(error => {
        console.error('Error en la petición de talleres:', error);
        return of([]);
      })
    );
  }

  /**
   * Maneja la inscripción a un taller
   */
  inscribirse(taller: Taller): void {
    if (taller.cupo_disponible <= 0) {
      alert('Lo sentimos, no hay cupos disponibles para este taller.');
      return;
    }

    // Aquí puedes implementar la lógica de inscripción
    console.log('Inscribiendo al taller:', taller.nombre);
    
    // Ejemplo de confirmación
    const confirmacion = confirm(`¿Estás seguro de que quieres inscribirte en "${taller.nombre}" por S/ ${taller.precio}?`);
    
    if (confirmacion) {
      // Aquí iría la llamada a la API para inscribirse
      alert('¡Inscripción exitosa! Te hemos enviado un correo con los detalles.');
      
      // Actualizar cupos disponibles (esto sería en una implementación real con la API)
      // taller.cupo_disponible--;
    }
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Verifica si un taller está próximo a comenzar
   */
  esTallerProximo(taller: Taller): boolean {
    const fechaInicio = new Date(taller.fecha_inicio);
    const hoy = new Date();
    const diferencia = fechaInicio.getTime() - hoy.getTime();
    const diasDiferencia = diferencia / (1000 * 3600 * 24);
    
    return diasDiferencia <= 7 && diasDiferencia >= 0; // Próximos 7 días
  }

  /**
   * Verifica si un taller tiene pocos cupos disponibles
   */
  tienePocosCupos(taller: Taller): boolean {
    return taller.cupo_disponible > 0 && taller.cupo_disponible <= 3;
  }

  /**
   * Filtra talleres por modalidad
   */
  filtrarPorModalidad(modalidad: string): Taller[] {
    return this.talleres.filter(taller => taller.modalidad === modalidad);
  }

  /**
   * Obtiene talleres únicos por profesor (para evitar duplicados en la sección de profesores)
   */
  getTalleresUnicosPorProfesor(): Taller[] {
    const profesoresVistos = new Set();
    return this.talleres.filter(taller => {
      if (profesoresVistos.has(taller.id_profesor._id)) {
        return false;
      }
      profesoresVistos.add(taller.id_profesor._id);
      return true;
    });
  }
}