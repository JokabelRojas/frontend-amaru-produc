import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminDataService } from '../../../core/services/admin.data.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-inscripciones',
  imports: [
    CommonModule, 
    FormsModule,
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule
  ],  templateUrl: './inscripciones.html',
  styleUrl: './inscripciones.css'
})
export class Inscripciones {
  inscripcionesCombinadas: any[] = [];
  inscripcionesFiltradas: any[] = [];
  
  // Filtros
  filtroEstado: string = '';
  filtroTaller: string = '';
  
  // Estados
  cambiandoEstado: boolean = false;
  cargando: boolean = false;

  constructor(
    private adminDataService: AdminDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarInscripcionesCombinadas();
  }

  cargarInscripcionesCombinadas(): void {
    this.cargando = true;
    
    // Realizar ambas llamadas API simultáneamente
    this.adminDataService.getInscripciones().subscribe({
      next: (inscripciones) => {
        this.adminDataService.getDetalleInscripciones().subscribe({
          next: (detalles) => {
            this.combinarDatos(inscripciones, detalles);
            this.cargando = false;
          },
          error: (err) => {
            console.error('Error al cargar detalles de inscripciones:', err);
            this.mostrarError('Error al cargar detalles de inscripciones');
            this.cargando = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar inscripciones:', err);
        this.mostrarError('Error al cargar inscripciones');
        this.cargando = false;
      }
    });
  }

  combinarDatos(inscripciones: any[], detalles: any[]): void {
    this.inscripcionesCombinadas = inscripciones.map(inscripcion => {
      // Buscar el detalle que corresponde a esta inscripción
      const detalleCorrespondiente = detalles.find(
        detalle => detalle.id_inscripcion._id === inscripcion._id
      );

      return {
        ...inscripcion,
        detalle: detalleCorrespondiente,
        usuario: inscripcion.id_usuario,
        taller: detalleCorrespondiente?.id_taller
      };
    });

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let filtered = [...this.inscripcionesCombinadas];

    // Filtrar por estado
    if (this.filtroEstado) {
      filtered = filtered.filter(inscripcion => 
        inscripcion.estado === this.filtroEstado
      );
    }

    // Filtrar por taller
    if (this.filtroTaller) {
      filtered = filtered.filter(inscripcion => 
        inscripcion.taller?.nombre === this.filtroTaller
      );
    }

    this.inscripcionesFiltradas = filtered;
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroTaller = '';
    this.aplicarFiltros();
  }

  // Getter para obtener talleres únicos para el filtro
  get talleresUnicos(): string[] {
    const talleres = this.inscripcionesCombinadas
      .map(inscripcion => inscripcion.taller?.nombre)
      .filter(nombre => nombre && nombre.trim() !== '');
    
    return [...new Set(talleres)].sort();
  }

  cambiarEstado(idInscripcion: string, nuevoEstado: string): void {
    const accion = nuevoEstado === 'aprobado' ? 'aceptar' : 'rechazar';
    
    if (!confirm(`¿Estás seguro de que deseas ${accion} esta inscripción?`)) {
      return;
    }

    this.cambiandoEstado = true;

    // Llamar al servicio real para cambiar el estado
    this.adminDataService.cambiarEstadoInscripcion(idInscripcion, nuevoEstado).subscribe({
      next: (response) => {
        console.log('Estado actualizado:', response);
        
        // Actualizar el estado localmente
        const inscripcionIndex = this.inscripcionesCombinadas.findIndex(
          inscripcion => inscripcion._id === idInscripcion
        );

        if (inscripcionIndex !== -1) {
          this.inscripcionesCombinadas[inscripcionIndex].estado = nuevoEstado;
          this.aplicarFiltros();
        }

        this.mostrarExito(`Inscripción ${accion}da correctamente`);
        this.cambiandoEstado = false;
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        this.mostrarError(`Error al ${accion} la inscripción`);
        this.cambiandoEstado = false;
      }
    });
  }

  exportarExcel(): void {
    if (this.inscripcionesFiltradas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    try {
      // Preparar datos para Excel
      const datosExcel = this.inscripcionesFiltradas.map(inscripcion => ({
        'ID Inscripción': inscripcion._id,
        'Usuario': `${inscripcion.usuario?.nombre} ${inscripcion.usuario?.apellido}`,
        'Email': inscripcion.usuario?.email,
        'DNI': inscripcion.usuario?.dni,
        'Teléfono': inscripcion.usuario?.telefono,
        'Taller': inscripcion.taller?.nombre,
        'Descripción Taller': inscripcion.taller?.descripcion,
        'Modalidad': inscripcion.taller?.modalidad,
        'Horario': inscripcion.taller?.horario,
        'Fecha Inicio': inscripcion.taller?.fecha_inicio ? new Date(inscripcion.taller.fecha_inicio) : '',
        'Fecha Fin': inscripcion.taller?.fecha_fin ? new Date(inscripcion.taller.fecha_fin) : '',
        'Fecha Inscripción': inscripcion.fecha_inscripcion ? new Date(inscripcion.fecha_inscripcion) : '',
        'Precio Total': inscripcion.total,
        'Moneda': inscripcion.moneda,
        'Cantidad': inscripcion.detalle?.cantidad,
        'Precio Unitario': inscripcion.detalle?.precio_unitario,
        'Estado': this.obtenerEstadoLegible(inscripcion.estado),
        'Observaciones': inscripcion.detalle?.observaciones
      }));

      // Crear workbook y worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inscripciones');

      // Generar archivo y descargar
      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `inscripciones_${fecha}.xlsx`);

      this.mostrarExito('Archivo Excel exportado correctamente');

    } catch (error) {
      console.error('Error al exportar Excel:', error);
      this.mostrarError('Error al exportar el archivo Excel');
    }
  }

  // Métodos auxiliares para mostrar mensajes
  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-exito']
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

  private obtenerEstadoLegible(estado: string): string {
    const estados: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado'
    };
    return estados[estado] || estado;
  }

  // Método para recargar los datos
  recargarDatos(): void {
    this.cargarInscripcionesCombinadas();
  }

}
