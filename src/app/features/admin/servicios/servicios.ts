import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AgregarServicios } from './modales/agregar-servicios/agregar-servicios';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicios',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios implements OnInit {
  categorias: any[] = [];
  subcategorias: any[] = [];
  servicios: any[] = [];

  filtros = {
    id_categoria: '',
    id_subcategoria: '',
    estado: ''
  };

  constructor(
    private dialog: MatDialog,
    private adminDataService: AdminDataService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarServicios();
  }

  cargarCategorias(): void {
    this.adminDataService.getCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  onCategoriaChange(): void {
    if (this.filtros.id_categoria) {
      this.adminDataService.getSubcategoriasPorCategoria(this.filtros.id_categoria).subscribe({
        next: (data) => (this.subcategorias = data),
        error: (err) => console.error('Error al cargar subcategorías', err)
      });
    } else {
      this.subcategorias = [];
      this.filtros.id_subcategoria = '';
    }
  }

  cargarServicios(): void {
    this.adminDataService.getServiciosFiltrados(this.filtros).subscribe({
      next: (data) => (this.servicios = data),
      error: (err) => console.error('Error al cargar servicios', err)
    });
  }

  openAgregarServicio(): void {
    const dialogRef = this.dialog.open(AgregarServicios, {
      width: '600px',
      panelClass: 'custom-modalbox',
      data: { 
        categorias: this.categorias
      }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarServicios();
      }
    });
  }

  editarServicio(servicio: any): void {
    const dialogRef = this.dialog.open(AgregarServicios, {
      width: '600px',
      panelClass: 'custom-modalbox',
      data: { 
        servicio: servicio,
        categorias: this.categorias
      }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarServicios();
      }
    });
  }

  eliminarServicio(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este servicio?')) {
      this.adminDataService.deleteServicio(id).subscribe({
        next: () => {
          alert('Servicio eliminado correctamente');
          this.cargarServicios();
        },
        error: (err) => console.error('Error al eliminar servicio', err)
      });
    }
  }
}