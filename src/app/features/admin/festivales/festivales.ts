import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private adminDataService: AdminDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarFestivales();
  }

  cargarFestivales(): void {
    this.adminDataService.getFestivales().subscribe({
      next: (festivales) => {
        this.festivales = festivales;
      },
      error: (err) => console.error('Error al cargar festivales:', err)
    });
  }

  abrirModalFestival(): void {
    const dialogRef = this.dialog.open(ModalFestival, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarFestivales();
      }
    });
  }

  eliminarFestival(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este festival?')) {
      this.adminDataService.deleteFestival(id).subscribe({
        next: (res) => {
          console.log('Festival eliminado correctamente:', res);
          this.cargarFestivales();
        },
        error: (err) => {
          console.error('Error al eliminar el festival:', err);
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
        this.cargarFestivales();
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
        this.cargarFestivales(); 
      },
      error: (err) => {
        console.error(`Error al ${accion} el festival:`, err);
      }
    });
  }
}
}