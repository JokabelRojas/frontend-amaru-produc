import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { ModalProfesor } from './modal-profesor/modal-profesor';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-profesor',
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './profesor.html',
  styleUrl: './profesor.css'
})
export class Profesor {
  profesores: any[] = [];

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
    this.cargarProfesores();
  }

  cargarProfesores(): void {
    this.adminDataService.getProfesores().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
      },
      error: (err) => {
        console.error('Error al cargar profesores:', err);
        const mensaje = err.error?.message || 'Error al cargar profesores';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  abrirModalProfesor(): void {
    const dialogRef = this.dialog.open(ModalProfesor, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Profesor guardado exitosamente');
        this.cargarProfesores();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarProfesores();
        }
      }
    });
  }

  eliminarProfesor(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este profesor?')) {
      this.adminDataService.deleteProfesor(id).subscribe({
        next: (res) => {
          console.log('Profesor eliminado correctamente:', res);
          const mensaje = res?.message || 'Profesor eliminado correctamente';
          this.mostrarMensaje(mensaje);
          this.cargarProfesores();
        },
        error: (err) => {
          console.error('Error al eliminar el profesor:', err);
          const mensaje = err.error?.message || 'Error al eliminar el profesor';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  editarProfesor(profesor: any): void {
    const dialogRef = this.dialog.open(ModalProfesor, {
      width: '500px',
      data: { profesor }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Profesor actualizado exitosamente');
        this.cargarProfesores();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarProfesores();
        }
      }
    });
  }
}