import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { ModalProfesor } from './modal-profesor/modal-profesor';

@Component({
  selector: 'app-profesor',
  imports: [MatIconModule, CommonModule],
  templateUrl: './profesor.html',
  styleUrl: './profesor.css'
})
export class Profesor{
  profesores: any[] = [];

  constructor(private adminDataService: AdminDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  cargarProfesores(): void {
    this.adminDataService.getProfesores().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
      },
      error: (err) => console.error('Error al cargar profesores:', err)
    });
  }

  abrirModalProfesor(): void {
    const dialogRef = this.dialog.open(ModalProfesor, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarProfesores();
      }
    });
  }

  eliminarProfesor(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este profesor?')) {
      this.adminDataService.deleteProfesor(id).subscribe({
        next: (res) => {
          console.log('Profesor eliminado correctamente:', res);
          this.cargarProfesores();
        },
        error: (err) => {
          console.error('Error al eliminar el profesor:', err);
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
        this.cargarProfesores();
      }
    });
  }
}