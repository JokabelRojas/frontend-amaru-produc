import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar SnackBar
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
    private snackBar: MatSnackBar, // Inyectar SnackBar
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

  // Método para mostrar mensajes
  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  guardarCategoria(): void {
    if (!this.nuevaCategoria.nombre || !this.nuevaCategoria.tipo || !this.nuevaCategoria.descripcion) {
      this.mostrarMensaje('Por favor, complete todos los campos obligatorios', 'error');
      return;
    }

    if (this.modoEdicion && this.idCategoria) {
      // 🔄 Modo edición → PATCH
      this.adminDataService.updateCategoria(this.idCategoria, this.nuevaCategoria).subscribe({
        next: (res) => {
          console.log('Categoría actualizada correctamente:', res);
          const mensaje = res?.message || 'Categoría actualizada correctamente';
          this.mostrarMensaje(mensaje);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar categoría:', err);
          const mensaje = err.error?.message || 'Error al actualizar la categoría';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    } else {
      // 🆕 Modo creación → POST
      this.adminDataService.addCategoria(this.nuevaCategoria).subscribe({
        next: (res) => {
          console.log('Categoría agregada correctamente:', res);
          const mensaje = res?.message || 'Categoría agregada correctamente';
          this.mostrarMensaje(mensaje);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al agregar categoría:', err);
          const mensaje = err.error?.message || 'Error al agregar la categoría';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}