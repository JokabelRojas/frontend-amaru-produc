import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { ModalServicio } from './modales/agregar-servicios/agregar-servicios';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicio {
  servicios: any[] = [];

  constructor(private adminDataService: AdminDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.adminDataService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
      },
      error: (err) => console.error('Error al cargar servicios:', err)
    });
  }

  abrirModalServicio(): void {
    const dialogRef = this.dialog.open(ModalServicio, {
      width: '500px',
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
        next: (res) => {
          console.log('Servicio eliminado correctamente:', res);
          this.cargarServicios();
        },
        error: (err) => {
          console.error('Error al eliminar el servicio:', err);
        }
      });
    }
  }

  editarServicio(servicio: any): void {
    const dialogRef = this.dialog.open(ModalServicio, {
      width: '500px',
      data: { servicio }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarServicios();
      }
    });
  }
}