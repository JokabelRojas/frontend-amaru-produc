import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminDataService } from '../../../../core/services/admin.data.service';

@Component({
  selector: 'app-modal-premio',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './modal-premios.html',
  styleUrls: ['./modal-premios.css']
})
export class ModalPremios {

  modoEdicion: boolean = false;
  idPremio: string | null = null;

  nuevoPremio = {
    titulo: '',
    fecha: '',
    descripcion: '',
    url_imagen: ''
  };

  constructor(
    private dialogRef: MatDialogRef<ModalPremios>,
    private adminDataService: AdminDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Si se reciben datos, activar modo edición y rellenar campos
    if (data && data.premio) {
      this.modoEdicion = true;
      this.idPremio = data.premio._id;
      this.nuevoPremio = {
        titulo: data.premio.titulo,
        fecha: this.formatearFecha(data.premio.fecha),
        descripcion: data.premio.descripcion,
        url_imagen: data.premio.url_imagen || ''
      };
    }
  }

  // Método para formatear la fecha para el input date
  private formatearFecha(fecha: string): string {
    if (!fecha) return '';
    // Convierte la fecha de "YYYY-MM-DD" al formato que necesita el input
    return fecha.split('T')[0]; // Remueve la parte de tiempo si existe
  }

  guardarPremio(): void {
    if (!this.nuevoPremio.titulo || !this.nuevoPremio.fecha || !this.nuevoPremio.descripcion) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    if (this.modoEdicion && this.idPremio) {
      // 🔄 Modo edición → PATCH
      this.adminDataService.updatePremio(this.idPremio, this.nuevoPremio).subscribe({
        next: (res) => {
          console.log('Premio actualizado correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar premio:', err);
        }
      });
    } else {
      // 🆕 Modo creación → POST
      this.adminDataService.createPremios(this.nuevoPremio).subscribe({
        next: (res) => {
          console.log('Premio agregado correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al agregar premio:', err);
        }
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}