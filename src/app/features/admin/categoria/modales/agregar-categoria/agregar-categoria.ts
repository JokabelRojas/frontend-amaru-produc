import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AdminDataService } from '../../../../../core/services/admin.data.service';

@Component({
  selector: 'app-agregar-categoria',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, MatSelectModule],
  templateUrl: './agregar-categoria.html',
  styleUrls: ['./agregar-categoria.css']
})
export class AgregarCategoria {

  modoEdicion: boolean = false;
  idCategoria: string | null = null;

  tiposCategoria: string[] = ['servicio', 'taller'];

  nuevaCategoria = {
    nombre: '',
    tipo: '',
    descripcion: '',
  };

  constructor(
    private dialogRef: MatDialogRef<AgregarCategoria>,
    private adminDataService: AdminDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Si se reciben datos, activar modo edición y rellenar campos
    if (data && data.categoria) {
      this.modoEdicion = true;
      this.idCategoria = data.categoria._id;
      this.nuevaCategoria = {
        nombre: data.categoria.nombre,
        tipo: data.categoria.tipo,
        descripcion: data.categoria.descripcion,
      };
    }
  }

  guardarCategoria(): void {
    if (!this.nuevaCategoria.nombre || !this.nuevaCategoria.tipo || !this.nuevaCategoria.descripcion) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    if (this.modoEdicion && this.idCategoria) {
      // 🔄 Modo edición → PATCH
      this.adminDataService.updateCategoria(this.idCategoria, this.nuevaCategoria).subscribe({
        next: (res) => {
          console.log('Categoría actualizada correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar categoría:', err);
        }
      });
    } else {
      // 🆕 Modo creación → POST
      this.adminDataService.addCategoria(this.nuevaCategoria).subscribe({
        next: (res) => {
          console.log('Categoría agregada correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al agregar categoría:', err);
        }
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

}
