import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderCliente } from '../../../../shared/components/header-cliente/header-cliente';
import { FooterCliente } from '../../../../shared/components/footer-cliente/footer-cliente';

// Interfaces para tipado fuerte
interface Actividad {
  _id: string;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Festival {
  _id: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  lugar: string;
  organizador: string;
  tipo: string;
  id_actividad: Actividad;
  estado: string;
  imagen_url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ActividadConCantidad {
  _id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
}

// Interface para la respuesta de la API
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

@Component({
  selector: 'app-festivales',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderCliente, FooterCliente],
  templateUrl: './festivales.html',
  styleUrls: ['./festivales.css']
})
export class Festivales implements OnInit {

  festivales: Festival[] = [];
  cargando: boolean = true;
  error: string = '';
  festivalSeleccionado: Festival | null = null;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.cargarFestivales();
    } else {
      this.cargando = true;
    }
  }

  /**
   * Carga los festivales desde la API
   */
  cargarFestivales(): void {
    this.cargando = true;
    this.error = '';

    this.getFestivalesActivos().pipe(
      finalize(() => {
        this.cargando = false;
      })
    ).subscribe({
      next: (festivales) => {
        this.festivales = festivales || [];
        console.log('Festivales cargados:', this.festivales);
      },
      error: (error) => {
        console.error('Error al cargar festivales:', error);
        this.error = 'No se pudieron cargar los festivales. Por favor, intenta más tarde.';
        this.festivales = [];
      }
    });
  }

  /**
   * Obtiene los festivales activos desde la API
   */
  getFestivalesActivos(): Observable<Festival[]> {
    return this.http.get<ApiResponse<Festival[]>>(`${environment.apiUrl}festivales/estado/activos`).pipe(
      map(response => {
        console.log('Respuesta completa de API:', response);
        // Extrae el array de festivales de response.data
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error en la petición de festivales:', error);
        return of([]);
      })
    );
  }

  /**
   * Abre el modal con los detalles del festival
   */
  abrirModal(festival: Festival): void {
    if (!this.isBrowser) return;
    this.festivalSeleccionado = festival;
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }

  /**
   * Cierra el modal
   */
  cerrarModal(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.festivalSeleccionado = null;
    document.body.style.overflow = ''; // Restaurar scroll del body
  }

  /**
   * Maneja la participación en un festival
   */
  participar(festival: Festival): void {
    if (!this.isBrowser) return;

    const confirmacion = confirm(`¿Estás seguro de que quieres participar en "${festival.titulo}"?`);
    
    if (confirmacion) {
      // Aquí iría la llamada a la API para participar
      console.log('Participando en el festival:', festival.titulo);
      alert('¡Te has registrado exitosamente! Recibirás más información por correo.');
      this.cerrarModal();
    }
  }

  /**
   * Formatea una fecha para mostrar (corta)
   */
  formatearFechaCorta(fecha: string): string {
    if (!this.isBrowser) return fecha;
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  /**
   * Formatea una fecha para mostrar (larga)
   */
  formatearFechaLarga(fecha: string): string {
    if (!this.isBrowser) return fecha;
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Verifica si un festival está próximo a comenzar
   */
  esFestivalProximo(festival: Festival): boolean {
    if (!this.isBrowser) return false;

    const fechaInicio = new Date(festival.fecha_inicio);
    const hoy = new Date();
    const diferencia = fechaInicio.getTime() - hoy.getTime();
    const diasDiferencia = diferencia / (1000 * 3600 * 24);
    
    return diasDiferencia <= 7 && diasDiferencia >= 0;
  }

  /**
   * Obtiene los días restantes para un festival
   */
  obtenerDiasRestantes(festival: Festival): string {
    if (!this.isBrowser) return 'Próximamente';

    const fechaInicio = new Date(festival.fecha_inicio);
    const hoy = new Date();
    const diferencia = fechaInicio.getTime() - hoy.getTime();
    const diasDiferencia = Math.ceil(diferencia / (1000 * 3600 * 24));

    if (diasDiferencia < 0) {
      return 'En curso';
    } else if (diasDiferencia === 0) {
      return '¡Hoy!';
    } else if (diasDiferencia === 1) {
      return 'Mañana';
    } else {
      return `En ${diasDiferencia} días`;
    }
  }

  /**
   * Obtiene actividades únicas con contador
   */
  get actividadesUnicas(): ActividadConCantidad[] {
    const actividadesMap = new Map<string, ActividadConCantidad>();

    this.festivales.forEach(festival => {
      const actividad = festival.id_actividad;
      if (actividad && actividad._id) {
        if (actividadesMap.has(actividad._id)) {
          actividadesMap.get(actividad._id)!.cantidad++;
        } else {
          actividadesMap.set(actividad._id, {
            ...actividad,
            cantidad: 1
          });
        }
      }
    });

    return Array.from(actividadesMap.values());
  }

  /**
   * Obtiene festivales por actividad
   */
  obtenerFestivalesPorActividad(actividadId: string): Festival[] {
    return this.festivales.filter(festival => 
      festival.id_actividad && festival.id_actividad._id === actividadId
    );
  }

  /**
   * Listener para cerrar modal con ESC
   */
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: Event): void {
    if (this.festivalSeleccionado) {
      this.cerrarModal();
    }
  }

  /**
   * Verifica si estamos en el cliente
   */
  get enCliente(): boolean {
    return this.isBrowser;
  }
}