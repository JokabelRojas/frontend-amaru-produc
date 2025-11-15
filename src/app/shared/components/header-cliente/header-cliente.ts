import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Ajusta la ruta según tu estructura

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
  private userData: any = null;

  constructor(
    private router: Router,
    private authService: AuthService
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
    
    // Intentar obtener del localStorage si no está cargado
    const storedUser = this.getStoredUser();
    return storedUser?.nombre || 'Usuario';
  }

  /** Carga los datos del usuario desde el localStorage */
  private loadUserData() {
    this.userData = this.getStoredUser();
  }

  /** Obtiene los datos del usuario del localStorage */
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

  /** Cierra sesión */
  logout() {
    this.authService.logout();
    
    // También limpiar datos específicos del usuario si los guardaste
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('user_data');
    }
    
    this.userData = null;
    this.closeAllMenus();
    this.router.navigate(['/']);
  }

  /** Detecta el scroll para cambiar el color del header */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 10;
    }
  }

  /** Abre o cierra el menú móvil */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.showTalleresMobile = false;
    }
  }

  /** Muestra el submenú de Talleres en desktop */
  toggleTalleresMenu(state: boolean) {
    this.showTalleresMenu = state;
  }

  /** Alternar submenú de talleres en móvil */
  toggleTalleresMobile() {
    this.showTalleresMobile = !this.showTalleresMobile;
  }

  /** Cerrar todos los menús al navegar */
  closeAllMenus() {
    this.isMenuOpen = false;
    this.showTalleresMobile = false;
    this.showTalleresMenu = false;
  }

  /** Navega a una ruta y cierra el menú móvil si está abierto */
  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeAllMenus();
  }
}