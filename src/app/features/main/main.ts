import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAdmin } from '../../shared/components/header-admin/header-admin';
import { HeaderCliente } from '../../shared/components/header-cliente/header-cliente';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule, HeaderAdmin, HeaderCliente],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
    isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });
}
