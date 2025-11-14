import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { ModalActividades } from './modal-actividades/modal-actividades';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css'
})
export class Actividades {
  actividades: any[] = [];

  constructor(private adminDataService: AdminDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(): void {
    this.adminDataService.getActividades().subscribe({
      next: (actividades) => {
        this.actividades = actividades;
      },
      error: (err) => console.error('Error al cargar actividades:', err)
    });
  }

  abrirModalActividad(): void {
    const dialogRef = this.dialog.open(ModalActividades, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarActividades();
      }
    });
  }

  eliminarActividad(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta actividad?')) {
      this.adminDataService.deleteActividad(id).subscribe({
        next: (res) => {
          console.log('Actividad eliminada correctamente:', res);
          this.cargarActividades();
        },
        error: (err) => {
          console.error('Error al eliminar la actividad:', err);
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
        this.cargarActividades();
      }
    });
  }
}