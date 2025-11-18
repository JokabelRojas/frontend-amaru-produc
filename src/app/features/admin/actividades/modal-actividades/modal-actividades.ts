import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  enviando: boolean = false;

  nuevaActividad = {
    nombre: '',
    descripcion: ''
  };

  constructor(
    private dialogRef: MatDialogRef<ModalActividades>,
    private adminDataService: AdminDataService,
    private snackBar: MatSnackBar,
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

  /**
   * Muestra un mensaje de snackbar
   */
  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Valida los campos del formulario antes de enviar
   */
  private validarFormulario(): boolean {
    // Validación de campos requeridos
    if (!this.nuevaActividad.nombre?.trim()) {
      this.mostrarMensaje('El nombre de la actividad es obligatorio', 'error');
      return false;
    }

    if (!this.nuevaActividad.descripcion?.trim()) {
      this.mostrarMensaje('La descripción de la actividad es obligatoria', 'error');
      return false;
    }

    // Validación de longitud mínima
    if (this.nuevaActividad.nombre.trim().length < 3) {
      this.mostrarMensaje('El nombre debe tener al menos 3 caracteres', 'error');
      return false;
    }

    if (this.nuevaActividad.descripcion.trim().length < 10) {
      this.mostrarMensaje('La descripción debe tener al menos 10 caracteres', 'error');
      return false;
    }

    // Validación de longitud máxima
    if (this.nuevaActividad.nombre.length > 100) {
      this.mostrarMensaje('El nombre no puede exceder los 100 caracteres', 'error');
      return false;
    }

    if (this.nuevaActividad.descripcion.length > 500) {
      this.mostrarMensaje('La descripción no puede exceder los 500 caracteres', 'error');
      return false;
    }

    return true;
  }

  /**
   * Maneja el envío del formulario para guardar o actualizar la actividad
   */
  guardarActividad(): void {
    // Validar formulario
    if (!this.validarFormulario()) {
      return;
    }

    this.enviando = true;

    // Trim de los campos
    const actividadLimpia = {
      nombre: this.nuevaActividad.nombre.trim(),
      descripcion: this.nuevaActividad.descripcion.trim()
    };

    if (this.modoEdicion && this.idActividad) {
      // 🔄 Modo edición → PATCH
      this.actualizarActividad(actividadLimpia);
    } else {
      // 🆕 Modo creación → POST
      this.crearActividad(actividadLimpia);
    }
  }

  /**
   * Actualiza una actividad existente
   */
  private actualizarActividad(actividad: any): void {
    this.adminDataService.updateActividad(this.idActividad!, actividad).subscribe({
      next: (res) => {
        console.log('Actividad actualizada correctamente:', res);
        const mensaje = res?.message || 'Actividad actualizada correctamente';
        this.mostrarMensaje(mensaje);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al actualizar actividad:', err);
        const mensaje = err.error?.message || this.obtenerMensajeError(err, 'actualizar');
        this.mostrarMensaje(mensaje, 'error');
        this.enviando = false;
      },
      complete: () => {
        this.enviando = false;
      }
    });
  }

  /**
   * Crea una nueva actividad
   */
  private crearActividad(actividad: any): void {
    this.adminDataService.createActividad(actividad).subscribe({
      next: (res) => {
        console.log('Actividad agregada correctamente:', res);
        const mensaje = res?.message || 'Actividad creada correctamente';
        this.mostrarMensaje(mensaje);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al agregar actividad:', err);
        const mensaje = err.error?.message || this.obtenerMensajeError(err, 'crear');
        this.mostrarMensaje(mensaje, 'error');
        this.enviando = false;
      },
      complete: () => {
        this.enviando = false;
      }
    });
  }

  /**
   * Obtiene mensajes de error amigables para el usuario
   */
  private obtenerMensajeError(error: any, operacion: string): string {
    if (error.status === 0) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    } else if (error.status === 400) {
      return 'Datos inválidos. Verifica la información ingresada.';
    } else if (error.status === 401) {
      return 'No autorizado. Tu sesión puede haber expirado.';
    } else if (error.status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    } else if (error.status === 409) {
      return 'Ya existe una actividad con ese nombre.';
    } else if (error.status >= 500) {
      return 'Error del servidor. Intenta nuevamente más tarde.';
    } else {
      return `Error al ${operacion} la actividad. Intenta nuevamente.`;
    }
  }

  cerrarModal(): void {
    if (!this.enviando) {
      this.dialogRef.close();
    }
  }
}