import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { ModalFestival } from './modal-festival/modal-festival';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-festival',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './festivales.html',
  styleUrl: './festivales.css'
})
export class Festival {
  festivales: any[] = [];

  constructor(
    private adminDataService: AdminDataService, 
    private dialog: MatDialog,
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
    this.cargarFestivales();
  }

  cargarFestivales(): void {
    this.adminDataService.getFestivales().subscribe({
      next: (festivales) => {
        this.festivales = festivales;
      },
      error: (err) => {
        console.error('Error al cargar festivales:', err);
        const mensaje = err.error?.message || 'Error al cargar festivales';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  abrirModalFestival(): void {
    const dialogRef = this.dialog.open(ModalFestival, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Festival guardado exitosamente');
        this.cargarFestivales();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarFestivales();
        }
      }
    });
  }

  eliminarFestival(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este festival?')) {
      this.adminDataService.deleteFestival(id).subscribe({
        next: (res) => {
          console.log('Festival eliminado correctamente:', res);
          const mensaje = res?.message || 'Festival eliminado correctamente';
          this.mostrarMensaje(mensaje);
          this.cargarFestivales();
        },
        error: (err) => {
          console.error('Error al eliminar el festival:', err);
          const mensaje = err.error?.message || 'Error al eliminar el festival';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  editarFestival(festival: any): void {
    const dialogRef = this.dialog.open(ModalFestival, {
      width: '600px',
      data: { festival }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Festival actualizado exitosamente');
        this.cargarFestivales();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarFestivales();
        }
      }
    });
  }

  cambiarEstadoFestival(id: string, estadoActual: string): void {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const accion = estadoActual === 'activo' ? 'desactivar' : 'activar';
    
    if (confirm(`¿Seguro que deseas ${accion} este festival?`)) {
      this.adminDataService.cambiarEstadoFestival(id, nuevoEstado).subscribe({
        next: (res) => {
          console.log(`Festival ${accion}do correctamente:`, res);
          const mensaje = res?.message || `Festival ${accion}do correctamente`;
          this.mostrarMensaje(mensaje);
          this.cargarFestivales(); 
        },
        error: (err) => {
          console.error(`Error al ${accion} el festival:`, err);
          const mensaje = err.error?.message || `Error al ${accion} el festival`;
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }
} 