import { Component,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';


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
  isScrolled = false;

  constructor(private router: Router) {}

  /** Detecta el scroll para cambiar el color del header */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  /** Abre o cierra el menú móvil */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /** Muestra el submenú de Talleres en desktop */
  toggleTalleresMenu(state: boolean) {
    this.showTalleresMenu = state;
  }

  /** Navega a una ruta y cierra el menú móvil si está abierto */
  navigateTo(path: string) {
    this.router.navigate([path]);
    this.isMenuOpen = false;
  }
}