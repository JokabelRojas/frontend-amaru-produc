import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { AgregarCategoria } from './modales/agregar-categoria/agregar-categoria';
import { AgregarSubcategoria } from './modales/agregar-subcategoria/agregar-subcategoria';

@Component({
  selector: 'app-categoria',
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css'
})
export class Categoria {
  activeTab: 'categorias' | 'subcategorias' = 'categorias';

  categorias: any[] = [];
  subcategorias: any[] = [];

  constructor(
    private adminDataService: AdminDataService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarCategoriasYSubcategorias();
  }

  // Método auxiliar para mostrar mensajes
  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000, // Aumenté la duración para que se pueda leer mejor
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  cargarCategoriasYSubcategorias(): void {
    this.adminDataService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargarSubcategorias();
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        const mensaje = err.error?.message || 'Error al cargar categorías';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  cargarSubcategorias(): void {
    this.adminDataService.getSubcategorias().subscribe({
      next: (data) => {
        this.subcategorias = data;

        this.subcategorias.forEach((subcat) => {
          if (subcat.id_categoria) {
            this.adminDataService.getCategoriaPorId(subcat.id_categoria._id).subscribe({
              next: (categoria) => {
                subcat.categoria = categoria.nombre;
              },
              error: (err) => {
                console.error(`Error al obtener categoría ${subcat.id_categoria}:`, err);
                subcat.categoria = 'Sin categoría';
              }
            });
          } else {
            subcat.categoria = 'Sin categoría';
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar subcategorías:', err);
        const mensaje = err.error?.message || 'Error al cargar subcategorías';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  abrirModalCategoria(): void {
    const dialogRef = this.dialog.open(AgregarCategoria, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Categoría guardada exitosamente');
        this.cargarCategoriasYSubcategorias();
      } else if (resultado && resultado.message) {
        // Si el modal retorna un mensaje específico
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarCategoriasYSubcategorias();
        }
      }
    });
  }

  eliminarCategoria(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
      this.adminDataService.deleteCategoria(id).subscribe({
        next: (res) => {
          console.log('Categoría eliminada correctamente:', res);
          const mensaje = res?.message || 'Categoría eliminada correctamente';
          this.mostrarMensaje(mensaje);
          this.cargarCategoriasYSubcategorias();
        },
        error: (err) => {
          console.error('Error al eliminar la categoría:', err);
          const mensaje = err.error?.message || 'Error al eliminar la categoría';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  editarCategoria(categoria: any): void {
    const dialogRef = this.dialog.open(AgregarCategoria, {
      width: '500px',
      data: { categoria }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Categoría actualizada exitosamente');
        this.cargarCategoriasYSubcategorias();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarCategoriasYSubcategorias();
        }
      }
    });
  }

  abrirModalSubcategoria(): void {
    const dialogRef = this.dialog.open(AgregarSubcategoria, {
      width: '500px',
      data: { categorias: this.categorias }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Subcategoría guardada exitosamente');
        this.cargarCategoriasYSubcategorias();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarCategoriasYSubcategorias();
        }
      }
    });
  }

  eliminarSubcategoria(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta subcategoría?')) {
      this.adminDataService.deleteSubcategoria(id).subscribe({
        next: (res) => {
          console.log('Subcategoría eliminada correctamente:', res);
          const mensaje = res?.message || 'Subcategoría eliminada correctamente';
          this.mostrarMensaje(mensaje);
          this.cargarCategoriasYSubcategorias();
        },
        error: (err) => {
          console.error('Error al eliminar la subcategoría:', err);
          const mensaje = err.error?.message || 'Error al eliminar la subcategoría';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  editarSubcategoria(subcategoria: any): void {
    const dialogRef = this.dialog.open(AgregarSubcategoria, {
      width: '500px',
      data: { subcategoria, categorias: this.categorias }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Subcategoría actualizada exitosamente');
        this.cargarCategoriasYSubcategorias();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarCategoriasYSubcategorias();
        }
      }
    });
  }

  cambiarEstadoCategoria(id: string, estadoActual: string): void {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const accion = estadoActual === 'activo' ? 'desactivar' : 'activar';

    if (confirm(`¿Seguro que deseas ${accion} esta categoría?`)) {
      if (estadoActual === 'activo') {
        this.adminDataService.desactivarCategoria(id).subscribe({
          next: (res) => {
            console.log('Categoría desactivada correctamente:', res);
            const mensaje = res?.message || 'Categoría desactivada correctamente';
            this.mostrarMensaje(mensaje);
            this.cargarCategoriasYSubcategorias();
          },
          error: (err) => {
            console.error('Error al desactivar la categoría:', err);
            const mensaje = err.error?.message || 'Error al desactivar la categoría';
            this.mostrarMensaje(mensaje, 'error');
          }
        });
      } else {
        this.adminDataService.activarCategoria(id).subscribe({
          next: (res) => {
            console.log('Categoría activada correctamente:', res);
            const mensaje = res?.message || 'Categoría activada correctamente';
            this.mostrarMensaje(mensaje);
            this.cargarCategoriasYSubcategorias();
          },
          error: (err) => {
            console.error('Error al activar la categoría:', err);
            const mensaje = err.error?.message || 'Error al activar la categoría';
            this.mostrarMensaje(mensaje, 'error');
          }
        });
      }
    }
  }

  cambiarEstadoSubcategoria(id: string, estadoActual: string): void {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const accion = estadoActual === 'activo' ? 'desactivar' : 'activar';

    if (confirm(`¿Seguro que deseas ${accion} esta subcategoría?`)) {
      this.adminDataService.cambiarEstadoSubcategoria(id, nuevoEstado).subscribe({
        next: (res) => {
          console.log(`Subcategoría ${accion}da correctamente:`, res);
          const mensaje = res?.message || `Subcategoría ${accion}da correctamente`;
          this.mostrarMensaje(mensaje);
          this.cargarCategoriasYSubcategorias();
        },
        error: (err) => {
          console.error(`Error al ${accion} la subcategoría:`, err);
          const mensaje = err.error?.message || `Error al ${accion} la subcategoría`;
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }
}