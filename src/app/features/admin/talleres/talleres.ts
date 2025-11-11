import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgregarTaller } from './modales/agregar-taller/agregar-taller';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-talleres',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './talleres.html',
  styleUrls: ['./talleres.css']
})
export class Talleres implements OnInit {
  categorias: any[] = [];
  talleres: any[] = [];
  totalTalleres: number = 0;

  vista: 'grid' | 'list' = 'grid';

  filtros = {
    id_categoria: '',
    estado: '',
    fecha_inicio: '',
    fecha_fin: ''
  };

  constructor(
    private dialog: MatDialog,
    private adminDataService: AdminDataService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarTalleres();
  }

  cargarCategorias(): void {
    this.adminDataService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  cargarTalleres(): void {
    this.adminDataService.getTalleresFiltrados(this.filtros).subscribe({
      next: (data) => {
        this.talleres = data;
        this.totalTalleres = data.length; // Actualiza total
      },
      error: (err) => console.error('Error al cargar talleres', err)
    });
  }

  openAgregarTaller(): void {
    const dialogRef = this.dialog.open(AgregarTaller, {
      width: '600px',
      panelClass: 'custom-modalbox',
      data: { categorias: this.categorias }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) this.cargarTalleres();
    });
  }

  editarTaller(taller: any): void {
    const dialogRef = this.dialog.open(AgregarTaller, {
      width: '600px',
      panelClass: 'custom-modalbox',
      data: { taller: taller, categorias: this.categorias }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) this.cargarTalleres();
    });
  }

  eliminarTaller(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este taller?')) {
      this.adminDataService.deleteTaller(id).subscribe({
        next: () => {
          alert('Taller eliminado correctamente');
          this.cargarTalleres();
        },
        error: (err) => console.error('Error al eliminar taller', err)
      });
    }
  }

  // 🔄 Activar / Inactivar taller
  cambiarEstado(taller: any, activo: boolean): void {
    const nuevoEstado = activo ? 'activo' : 'inactivo';
    this.adminDataService.updateTaller(taller._id, { estado: nuevoEstado }).subscribe({
      next: () => {
        taller.estado = nuevoEstado;
      },
      error: (err) => {
        console.error('Error al cambiar estado del taller', err);
        alert('No se pudo cambiar el estado. Intenta nuevamente.');
      }
    });
  }

  // 🌐 Cambiar vista entre grid y list
  cambiarVista(vista: 'grid' | 'list') {
    this.vista = vista;
  }

  // 🧹 Limpiar filtros
  limpiarFiltros() {
    this.filtros = {
      id_categoria: '',
      estado: '',
      fecha_inicio: '',
      fecha_fin: ''
    };
    this.cargarTalleres();
  }

  // 📄 Exportar datos (ejemplo)
  exportarDatos() {
    // Aquí podrías generar un CSV o Excel con los talleres
    alert('Función de exportar en construcción.');
  }

  // 🔹 Obtener nombre de la categoría por id
  obtenerNombreCategoria(id_categoria: string): string {
    const cat = this.categorias.find(c => c._id === id_categoria);
    return cat ? cat.nombre : 'Sin categoría';
  }
}
