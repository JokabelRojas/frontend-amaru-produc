import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminDataService } from '../../../../core/services/admin.data.service';

@Component({
  selector: 'app-modal-profesor',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './modal-profesor.html',
  styleUrls: ['./modal-profesor.css']
})
export class ModalProfesor {

  modoEdicion: boolean = false;
  idProfesor: string | null = null;

  nuevoProfesor = {
    nombre: '',
    descripcion: '',
    especialidad: '',
    imagen_url: ''
  };

  constructor(
    private dialogRef: MatDialogRef<ModalProfesor>,
    private adminDataService: AdminDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Si se reciben datos, activar modo edición y rellenar campos
    if (data && data.profesor) {
      this.modoEdicion = true;
      this.idProfesor = data.profesor._id;
      this.nuevoProfesor = {
        nombre: data.profesor.nombre,
        descripcion: data.profesor.descripcion,
        especialidad: data.profesor.especialidad,
        imagen_url: data.profesor.imagen_url || ''
      };
    }
  }

  guardarProfesor(): void {
    if (!this.nuevoProfesor.nombre || !this.nuevoProfesor.descripcion || !this.nuevoProfesor.especialidad) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    if (this.modoEdicion && this.idProfesor) {
      // 🔄 Modo edición → PATCH
      this.adminDataService.updateProfesor(this.idProfesor, this.nuevoProfesor).subscribe({
        next: (res) => {
          console.log('Profesor actualizado correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar profesor:', err);
        }
      });
    } else {
      // 🆕 Modo creación → POST
      this.adminDataService.createProfesor(this.nuevoProfesor).subscribe({
        next: (res) => {
          console.log('Profesor agregado correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al agregar profesor:', err);
        }
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}