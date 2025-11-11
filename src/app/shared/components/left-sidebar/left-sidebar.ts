import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-left-sidebar',
  imports: [RouterModule, CommonModule, MatIconModule,MatTooltipModule],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css'
})
export class LeftSidebar {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
items = [
  {
    routeLink: 'panel-administracion',
    icon: 'home',
    label: 'Panel de Administración',
  },
  {
    routeLink: 'categoria',
    icon: 'category',
    label: 'Gestion de Categoria y Subcategoria',
  },
  {
    routeLink: 'talleres',
    icon: 'article',
    label: 'Gestion de Talleres',
  },
  {
    routeLink: 'festivales',
    icon: 'celebration',
    label: 'Gestion de Festivales y Premios',
  },
    {
    routeLink: 'servicios',
    icon: 'build',
    label: 'Gestion de Servicios',
  },
    {
    routeLink: 'inscripciones',
    icon: 'how_to_reg',
    label: 'Gestion de Inscripciones',
  },
];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

}
