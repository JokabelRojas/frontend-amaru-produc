import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderCliente } from '../../../../shared/components/header-cliente/header-cliente';

// Interfaces para tipado fuerte
interface Premio {
  _id: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  url_imagen: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [CommonModule, HttpClientModule,HeaderCliente],
  templateUrl: './premios.html',
  styleUrls: ['./premios.css']
})
export class Premios implements OnInit {
  premios: Premio[] = [];
  cargando: boolean = true;
  error: string = '';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.cargarPremios();
    } else {
      this.cargando = true;
    }
  }

  /**
   * Carga los premios desde la API
   */
  cargarPremios(): void {
    this.cargando = true;
    this.error = '';

    this.getPremios().pipe(
      finalize(() => {
        this.cargando = false;
      })
    ).subscribe({
      next: (premios) => {
        // Ordenar premios por fecha (más recientes primero)
        this.premios = (premios || []).sort((a, b) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
      },
      error: (error) => {
        console.error('Error al cargar premios:', error);
        this.error = 'No se pudieron cargar los premios. Por favor, intenta más tarde.';
        this.premios = [];
      }
    });
  }

  /**
   * Obtiene los premios desde la API
   */
  getPremios(): Observable<Premio[]> {
    return this.http.get<Premio[]>(`${environment.apiUrl}premios`).pipe(
      catchError(error => {
        console.error('Error en la petición de premios:', error);
        return of([]);
      })
    );
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    if (!this.isBrowser) return fecha;
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Obtiene el año de un premio
   */
  obtenerAnyoPremio(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).getFullYear().toString();
  }

  /**
   * Verifica si un premio es reciente (últimos 12 meses)
   */
  esPremioReciente(premio: Premio): boolean {
    if (!this.isBrowser) return false;

    const fechaPremio = new Date(premio.fecha);
    const hoy = new Date();
    const doceMesesAtras = new Date();
    doceMesesAtras.setMonth(hoy.getMonth() - 12);

    return fechaPremio >= doceMesesAtras;
  }

  /**
   * Obtiene el tiempo transcurrido desde el premio
   */
  obtenerTiempoTranscurrido(fecha: string): string {
    if (!this.isBrowser) return '';

    const fechaPremio = new Date(fecha);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaPremio.getTime();
    const dias = Math.floor(diferencia / (1000 * 3600 * 24));
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (años > 0) {
      return `Hace ${años} año${años !== 1 ? 's' : ''}`;
    } else if (meses > 0) {
      return `Hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
    } else {
      return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Obtiene premios recientes (últimos 12 meses)
   */
  get premiosRecientes(): Premio[] {
    return this.premios.filter(premio => this.esPremioReciente(premio));
  }

  /**
   * Obtiene el año actual
   */
  get anyoActual(): number {
    return new Date().getFullYear();
  }

  /**
   * Obtiene los años en los que hay premios
   */
  get anyosConPremios(): number[] {
    const anyos = this.premios.map(premio => new Date(premio.fecha).getFullYear());
    return [...new Set(anyos)].sort((a, b) => b - a);
  }

  /**
   * Obtiene la cantidad de premios por año
   */
  get premiosPorAnyo(): { [key: number]: number } {
    const conteo: { [key: number]: number } = {};
    this.premios.forEach(premio => {
      const año = new Date(premio.fecha).getFullYear();
      conteo[año] = (conteo[año] || 0) + 1;
    });
    return conteo;
  }

  /**
   * Verifica si estamos en el cliente
   */
  get enCliente(): boolean {
    return this.isBrowser;
  }
}