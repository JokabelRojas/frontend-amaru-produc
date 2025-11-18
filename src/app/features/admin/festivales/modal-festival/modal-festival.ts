import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminDataService } from '../../../../core/services/admin.data.service';

@Component({
  selector: 'app-modal-festival',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './modal-festival.html',
  styleUrls: ['./modal-festival.css']
})
export class ModalFestival implements OnInit {

  modoEdicion: boolean = false;
  idFestival: string | null = null;
  actividades: any[] = [];

  nuevoFestival = {
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    lugar: '',
    organizador: '',
    tipo: '',
    id_actividad: '',
    imagen_url: ''
  };

  constructor(
    private dialogRef: MatDialogRef<ModalFestival>,
    private adminDataService: AdminDataService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Método para mostrar mensajes
  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: tipo === 'success' ? ['snackbar-success'] : ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  ngOnInit(): void {
    this.cargarActividades();
    
    // Si se reciben datos, activar modo edición y rellenar campos
    if (this.data && this.data.festival) {
      this.modoEdicion = true;
      this.idFestival = this.data.festival._id;
      this.nuevoFestival = {
        titulo: this.data.festival.titulo,
        descripcion: this.data.festival.descripcion,
        fecha_inicio: this.formatearFechaParaInput(this.data.festival.fecha_inicio),
        fecha_fin: this.formatearFechaParaInput(this.data.festival.fecha_fin),
        lugar: this.data.festival.lugar,
        organizador: this.data.festival.organizador,
        tipo: this.data.festival.tipo,
        id_actividad: this.data.festival.id_actividad,
        imagen_url: this.data.festival.imagen_url || ''
      };
    }
  }

  cargarActividades(): void {
    this.adminDataService.getActividades().subscribe({
      next: (actividades) => {
        this.actividades = actividades;
      },
      error: (err) => {
        console.error('Error al cargar actividades:', err);
        const mensaje = err.error?.message || 'Error al cargar actividades';
        this.mostrarMensaje(mensaje, 'error');
      }
    });
  }

  // Método para formatear la fecha para el input datetime-local
  private formatearFechaParaInput(fecha: string): string {
    if (!fecha) return '';
    // Convierte la fecha ISO a formato compatible con datetime-local
    return fecha.substring(0, 16); // Remueve segundos y milisegundos
  }

  guardarFestival(): void {
    if (!this.validarCamposObligatorios()) {
      this.mostrarMensaje('Por favor complete todos los campos obligatorios', 'error');
      return;
    }

    // Validar que la fecha de inicio no sea mayor que la fecha de fin
    if (new Date(this.nuevoFestival.fecha_inicio) > new Date(this.nuevoFestival.fecha_fin)) {
      this.mostrarMensaje('La fecha de inicio no puede ser mayor que la fecha de fin', 'error');
      return;
    }

    // Formatear fechas para enviar al backend
    const festivalData = {
      ...this.nuevoFestival,
      fecha_inicio: new Date(this.nuevoFestival.fecha_inicio).toISOString(),
      fecha_fin: new Date(this.nuevoFestival.fecha_fin).toISOString()
    };

    if (this.modoEdicion && this.idFestival) {
      // 🔄 Modo edición → PATCH
      this.adminDataService.updateFestival(this.idFestival, festivalData).subscribe({
        next: (res) => {
          console.log('Festival actualizado correctamente:', res);
          const mensaje = res?.message || 'Festival actualizado correctamente';
          this.mostrarMensaje(mensaje);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar festival:', err);
          const mensaje = err.error?.message || 'Error al actualizar el festival';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    } else {
      // 🆕 Modo creación → POST
      this.adminDataService.createFestival(festivalData).subscribe({
        next: (res) => {
          console.log('Festival agregado correctamente:', res);
          const mensaje = res?.message || 'Festival creado correctamente';
          this.mostrarMensaje(mensaje);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al agregar festival:', err);
          const mensaje = err.error?.message || 'Error al crear el festival';
          this.mostrarMensaje(mensaje, 'error');
        }
      });
    }
  }

  private validarCamposObligatorios(): boolean {
    return !!(this.nuevoFestival.titulo && 
              this.nuevoFestival.descripcion && 
              this.nuevoFestival.fecha_inicio && 
              this.nuevoFestival.fecha_fin && 
              this.nuevoFestival.lugar && 
              this.nuevoFestival.organizador && 
              this.nuevoFestival.tipo && 
              this.nuevoFestival.id_actividad);
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}