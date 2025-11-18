import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgregarTaller } from './modales/agregar-taller/agregar-taller';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-talleres',
  imports: [MatIconModule, CommonModule, FormsModule, MatTooltipModule],
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
    private adminDataService: AdminDataService,
    private snackBar: MatSnackBar
  ) {}

  // Método para mostrar mensajes
  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarTalleres();
  }

  cargarCategorias(): void {
    this.adminDataService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => {
        console.error('Error al cargar categorías', err);
        const mensaje = err.error?.message || 'Error al cargar categorías';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  cargarTalleres(): void {
    this.adminDataService.getTalleresFiltrados(this.filtros).subscribe({
      next: (data) => {
        this.talleres = data;
        this.totalTalleres = data.length;
      },
      error: (err) => {
        console.error('Error al cargar talleres', err);
        const mensaje = err.error?.message || 'Error al cargar talleres';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  openAgregarTaller(): void {
    const dialogRef = this.dialog.open(AgregarTaller, {
      width: '600px',
      panelClass: 'custom-modalbox',
      data: { categorias: this.categorias }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Taller guardado exitosamente');
        this.cargarTalleres();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarTalleres();
        }
      }
    });
  }

  editarTaller(taller: any): void {
    const dialogRef = this.dialog.open(AgregarTaller, {
      width: '600px',
      panelClass: 'custom-modalbox',
      data: { taller: taller, categorias: this.categorias }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Taller actualizado exitosamente');
        this.cargarTalleres();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarTalleres();
        }
      }
    });
  }

  eliminarTaller(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este taller?')) {
      this.adminDataService.deleteTaller(id).subscribe({
        next: (res) => {
          const mensaje = res?.message || 'Taller eliminado correctamente';
          this.mostrarMensaje(mensaje);
          this.cargarTalleres();
        },
        error: (err) => {
          console.error('Error al eliminar taller', err);
          const mensaje = err.error?.message || 'Error al eliminar el taller';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  // 🔄 Activar / Inactivar taller
  cambiarEstado(taller: any, activo: boolean): void {
    const nuevoEstado = activo ? 'activo' : 'inactivo';
    const accion = activo ? 'activado' : 'desactivado';
    
    this.adminDataService.updateTaller(taller._id, { estado: nuevoEstado }).subscribe({
      next: (res) => {
        const mensaje = res?.message || `Taller ${accion} correctamente`;
        this.mostrarMensaje(mensaje);
        taller.estado = nuevoEstado;
      },
      error: (err) => {
        console.error('Error al cambiar estado del taller', err);
        const mensaje = err.error?.message || 'No se pudo cambiar el estado. Intenta nuevamente.';
        this.mostrarMensaje(mensaje, 'error');
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
    this.mostrarMensaje('Filtros limpiados correctamente');
  }

  // 📄 Exportar datos (ejemplo)
  exportarDatos() {
    // Aquí podrías generar un CSV o Excel con los talleres
    this.mostrarMensaje('Función de exportar en construcción.', 'error');
  }

  // 🔹 Obtener nombre de la categoría por id
  obtenerNombreCategoria(id_categoria: string): string {
    const cat = this.categorias.find(c => c._id === id_categoria);
    return cat ? cat.nombre : 'Sin categoría';
  }
}