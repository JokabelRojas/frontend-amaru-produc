import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private adminDataService: AdminDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarPremios();
  }

  cargarPremios(): void {
    this.adminDataService.getPremios().subscribe({
      next: (premios) => {
        this.premios = premios;
      },
      error: (err) => console.error('Error al cargar premios:', err)
    });
  }

  abrirModalPremio(): void {
    const dialogRef = this.dialog.open(ModalPremios, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarPremios();
      }
    });
  }

  eliminarPremio(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este premio?')) {
      this.adminDataService.deletePremio(id).subscribe({
        next: (res) => {
          console.log('Premio eliminado correctamente:', res);
          this.cargarPremios();
        },
        error: (err) => {
          console.error('Error al eliminar el premio:', err);
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
        this.cargarPremios();
      }
    });
  }
}