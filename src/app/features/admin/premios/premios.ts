import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { ModalPremios } from './modal-premios/modal-premios';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-premio',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './premios.html',
  styleUrl: './premios.css'
})
export class Premios {
  premios: any[] = [];

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
    this.cargarPremios();
  }

  cargarPremios(): void {
    this.adminDataService.getPremios().subscribe({
      next: (premios) => {
        this.premios = premios;
      },
      error: (err) => {
        console.error('Error al cargar premios:', err);
        const mensaje = err.error?.message || 'Error al cargar premios';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  abrirModalPremio(): void {
    const dialogRef = this.dialog.open(ModalPremios, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Premio guardado exitosamente');
        this.cargarPremios();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarPremios();
        }
      }
    });
  }

  eliminarPremio(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este premio?')) {
      this.adminDataService.deletePremio(id).subscribe({
        next: (res) => {
          console.log('Premio eliminado correctamente:', res);
          const mensaje = res?.message || 'Premio eliminado correctamente';
          this.mostrarMensaje(mensaje);
          this.cargarPremios();
        },
        error: (err) => {
          console.error('Error al eliminar el premio:', err);
          const mensaje = err.error?.message || 'Error al eliminar el premio';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  editarPremio(premio: any): void {
    const dialogRef = this.dialog.open(ModalPremios, {
      width: '500px',
      data: { premio }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.mostrarMensaje('Premio actualizado exitosamente');
        this.cargarPremios();
      } else if (resultado && resultado.message) {
        this.mostrarMensaje(resultado.message, resultado.type || 'success');
        if (resultado.reload) {
          this.cargarPremios();
        }
      }
    });
  }
}