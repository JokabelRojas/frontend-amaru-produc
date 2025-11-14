import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminDataService } from '../../../../core/services/admin.data.service';

@Component({
  selector: 'app-modal-actividad',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './modal-actividades.html',
  styleUrls: ['./modal-actividades.css']
})
export class ModalActividades {

  modoEdicion: boolean = false;
  idActividad: string | null = null;

  nuevaActividad = {
    nombre: '',
    descripcion: ''
  };

  constructor(
    private dialogRef: MatDialogRef<ModalActividades>,
    private adminDataService: AdminDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Si se reciben datos, activar modo edición y rellenar campos
    if (data && data.actividad) {
      this.modoEdicion = true;
      this.idActividad = data.actividad._id;
      this.nuevaActividad = {
        nombre: data.actividad.nombre,
        descripcion: data.actividad.descripcion
      };
    }
  }

  guardarActividad(): void {
    if (!this.nuevaActividad.nombre || !this.nuevaActividad.descripcion) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    if (this.modoEdicion && this.idActividad) {
      // 🔄 Modo edición → PATCH
      this.adminDataService.updateActividad(this.idActividad, this.nuevaActividad).subscribe({
        next: (res) => {
          console.log('Actividad actualizada correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar actividad:', err);
        }
      });
    } else {
      // 🆕 Modo creación → POST
      this.adminDataService.createActividad(this.nuevaActividad).subscribe({
        next: (res) => {
          console.log('Actividad agregada correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al agregar actividad:', err);
        }
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}