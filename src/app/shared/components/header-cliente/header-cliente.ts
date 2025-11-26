import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminDataService } from '../../../core/services/admin.data.service';

@Component({
  selector: 'app-header-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-cliente.html',
  styleUrls: ['./header-cliente.css']
})
export class HeaderCliente implements OnInit, OnDestroy {
  isMenuOpen = false;
  showTalleresMenu = false;
  showTalleresMobile = false;
  isScrolled = false;
  showInscripcionesModal = false;
  isLoading = false;
  
  private userData: any = null;
  private allInscripciones: any[] = [];
  inscripcionesFiltradas: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminDataService: AdminDataService // Inyectar el servicio
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  ngOnDestroy() {
    // Limpiar si es necesario
  }

  /** Verifica si el usuario está logueado */
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  /** Obtiene el nombre del usuario */
  getUserName(): string {
    if (this.userData) {
      return this.userData.nombre || 'Usuario';
    }
    
    const storedUser = this.getStoredUser();
    return storedUser?.nombre || 'Usuario';
  }

  /** Obtiene el ID del usuario */
  getUserId(): string {
    if (this.userData) {
      return this.userData.id;
    }
    
    const storedUser = this.getStoredUser();
    return storedUser?.id || null;
  }

  /** Carga los datos del usuario */
  private loadUserData() {
    this.userData = this.getStoredUser();
  }

  private getStoredUser(): any {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        return null;
      }
    }
    return null;
  }

  /** Abre el modal de inscripciones */
  async openInscripcionesModal() {
    this.showInscripcionesModal = true;
    await this.loadInscripciones();
  }

  /** Cierra el modal de inscripciones */
  closeInscripcionesModal() {
    this.showInscripcionesModal = false;
    this.isLoading = false;
  }

  /** Carga las inscripciones desde la API */
  private async loadInscripciones() {
    this.isLoading = true;
    try {
      // Llamar al servicio para obtener las inscripciones
      const result = await this.adminDataService.getDetalleInscripciones().toPromise();
      this.allInscripciones = result ?? [];
      
      // Filtrar inscripciones por el ID del usuario actual
      const userId = this.getUserId();
      this.inscripcionesFiltradas = this.allInscripciones.filter(
        (inscripcion: any) => inscripcion.id_inscripcion.id_usuario === userId
      );
      
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
      this.inscripcionesFiltradas = [];
    } finally {
      this.isLoading = false;
    }
  }

  /** Obtiene la clase CSS para el badge de estado */
  getEstadoBadgeClass(estado: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return `${baseClasses} bg-yellow-500/20 text-yellow-300 border border-yellow-500/30`;
      case 'aprobado':
      case 'activo':
        return `${baseClasses} bg-green-500/20 text-green-300 border border-green-500/30`;
      case 'rechazado':
      case 'cancelado':
        return `${baseClasses} bg-red-500/20 text-red-300 border border-red-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-300 border border-gray-500/30`;
    }
  }

  /** Obtiene el texto legible para el estado */
  getEstadoText(estado: string): string {
    const estados: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'aprobado': 'Aprobado',
      'activo': 'Activo',
      'rechazado': 'Rechazado',
      'cancelado': 'Cancelado'
    };
    
    return estados[estado?.toLowerCase()] || estado || 'Desconocido';
  }

  /** Formatea la fecha para mostrar */
  formatFecha(fechaString: string): string {
    if (!fechaString) return 'Fecha no disponible';
    
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  /** Cierra sesión */
  logout() {
    this.authService.logout();
    
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('user_data');
    }
    
    this.userData = null;
    this.closeAllMenus();
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 10;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.showTalleresMobile = false;
    }
  }

  toggleTalleresMenu(state: boolean) {
    this.showTalleresMenu = state;
  }

  toggleTalleresMobile() {
    this.showTalleresMobile = !this.showTalleresMobile;
  }

  closeAllMenus() {
    this.isMenuOpen = false;
    this.showTalleresMobile = false;
    this.showTalleresMenu = false;
    this.showInscripcionesModal = false;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeAllMenus();
  }
}