import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-cliente.html',
  styleUrls: ['./header-cliente.css']
})
export class HeaderCliente {
  isMenuOpen = false;
  showTalleresMenu = false;
  showTalleresMobile = false; // Nueva propiedad para móvil
  isScrolled = false;

  constructor(private router: Router) {}

  /** Detecta el scroll para cambiar el color del header */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Solo ejecutar en el cliente
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