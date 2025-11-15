import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminDataService } from '../../../../../core/services/admin.data.service';

@Component({
  selector: 'app-modal-servicio',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './agregar-servicios.html',
  styleUrls: ['./agregar-servicios.css']
})
export class ModalServicio {

  modoEdicion: boolean = false;
  idServicio: string | null = null;

  nuevoServicio = {
    titulo: '',
    descripcion: '',
    imagen_url: ''
  };

  constructor(
    private dialogRef: MatDialogRef<ModalServicio>,
    private adminDataService: AdminDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Si se reciben datos, activar modo edición y rellenar campos
    if (data && data.servicio) {
      this.modoEdicion = true;
      this.idServicio = data.servicio._id;
      this.nuevoServicio = {
        titulo: data.servicio.titulo,
        descripcion: data.servicio.descripcion,
        imagen_url: data.servicio.imagen_url || ''
      };
    }
  }

  guardarServicio(): void {
    if (!this.nuevoServicio.titulo || !this.nuevoServicio.descripcion) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    if (this.modoEdicion && this.idServicio) {
      // 🔄 Modo edición → PATCH
      this.adminDataService.updateServicio(this.idServicio, this.nuevoServicio).subscribe({
        next: (res) => {
          console.log('Servicio actualizado correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar servicio:', err);
        }
      });
    } else {
      // 🆕 Modo creación → POST
      this.adminDataService.createServicio(this.nuevoServicio).subscribe({
        next: (res) => {
          console.log('Servicio agregado correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al agregar servicio:', err);
        }
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}