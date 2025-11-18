import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { ModalActividades } from './modal-actividades/modal-actividades';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css'
})
export class Actividades {
  actividades: any[] = [];

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
    this.cargarActividades();
  }

  cargarActividades(): void {
    this.adminDataService.getActividades().subscribe({
      next: (actividades) => {
        this.actividades = actividades;
      },
      error: (err) => {
        console.error('Error al cargar actividades:', err);
        const mensaje = err.error?.message || 'Error al cargar actividades';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  abrirModalActividad(): void {
    const dialogRef = this.dialog.open(ModalActividades, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Actividad guardada exitosamente');
        this.cargarActividades();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarActividades();
        }
      }
    });
  }

  eliminarActividad(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta actividad?')) {
      this.adminDataService.deleteActividad(id).subscribe({
        next: (res) => {
          console.log('Actividad eliminada correctamente:', res);
          const mensaje = res?.message || 'Actividad eliminada correctamente';
          this.mostrarMensaje(mensaje);
          this.cargarActividades();
        },
        error: (err) => {
          console.error('Error al eliminar la actividad:', err);
          const mensaje = err.error?.message || 'Error al eliminar la actividad';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  editarActividad(actividad: any): void {
    const dialogRef = this.dialog.open(ModalActividades, {
      width: '500px',
      data: { actividad }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Actividad actualizada exitosamente');
        this.cargarActividades();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarActividades();
        }
      }
    });
  }
}