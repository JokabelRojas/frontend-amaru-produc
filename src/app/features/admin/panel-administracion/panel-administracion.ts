import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-panel-administracion',
  imports: [CommonModule, MatIconModule],
  templateUrl: './panel-administracion.html',
  styleUrl: './panel-administracion.css'
})
export class PanelAdministracion implements OnInit {
  estadisticas: any = {
    // Estadísticas generales
    totalTalleres: 0,
    totalInscripciones: 0,
    totalProfesores: 0,
    totalActividades: 0,
    totalPremios: 0,
    totalFestivales: 0,
    totalServicios: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    totalSubcategorias: 0,
    
    // Nuevas estadísticas de inscripciones
    inscripcionesHoy: 0,
    inscripcionesMesActual: 0,
    inscripcionesAnioActual: 0,
    inscripcionesPendientes: 0,
    ingresosTotales: 0,
    fechaHoy: '',
    mesActual: '',
    anioActual: '',
    tallerMasPopular: {
      nombre: '',
      inscripciones: 0
    }
  };

  loading: boolean = true;
  error: string = '';

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.error = '';

    // Realizar todas las llamadas en paralelo
    Promise.all([
      this.adminDataService.getTalleres().toPromise(),
      this.adminDataService.getInscripciones().toPromise(),
      this.adminDataService.getProfesores().toPromise(),
      this.adminDataService.getActividades().toPromise(),
      this.adminDataService.getPremios().toPromise(),
      this.adminDataService.getFestivales().toPromise(),
      this.adminDataService.getServicios().toPromise(),
      this.adminDataService.getUserSinContrasena().toPromise(),
      this.adminDataService.getCategorias().toPromise(),
      this.adminDataService.getSubcategorias().toPromise(),
      this.adminDataService.getDetalleInscripciones().toPromise()
    ]).then((results: any[]) => {
      // Estadísticas generales
      this.estadisticas.totalTalleres = results[0]?.length || 0;
      this.estadisticas.totalInscripciones = results[1]?.length || 0;
      this.estadisticas.totalProfesores = results[2]?.length || 0;
      this.estadisticas.totalActividades = results[3]?.length || 0;
      this.estadisticas.totalPremios = results[4]?.length || 0;
      this.estadisticas.totalFestivales = results[5]?.length || 0;
      this.estadisticas.totalServicios = results[6]?.length || 0;
      this.estadisticas.totalUsuarios = results[7]?.length || 0;
      this.estadisticas.totalCategorias = results[8]?.length || 0;
      this.estadisticas.totalSubcategorias = results[9]?.length || 0;

      // Procesar detalles de inscripciones para nuevas estadísticas
      const detallesInscripciones = results[10] || [];
      this.procesarEstadisticasInscripciones(detallesInscripciones);
      
      this.loading = false;
    }).catch(error => {
      console.error('Error cargando estadísticas:', error);
      this.error = 'Error al cargar las estadísticas';
      this.loading = false;
    });
  }

  procesarEstadisticasInscripciones(detalles: any[]): void {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0]; // YYYY-MM-DD
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    // Formatear fechas para display
    this.estadisticas.fechaHoy = this.formatearFecha(hoy);
    this.estadisticas.mesActual = this.obtenerNombreMes(mesActual);
    this.estadisticas.anioActual = anioActual.toString();

    // Contadores
    let inscripcionesHoy = 0;
    let inscripcionesMes = 0;
    let inscripcionesAnio = 0;
    let inscripcionesPendientes = 0;
    let ingresosTotales = 0;

    // Mapa para contar inscripciones por taller
    const inscripcionesPorTaller = new Map();

    detalles.forEach(detalle => {
      const fechaInscripcion = new Date(detalle.id_inscripcion.fecha_inscripcion);
      const fechaDetalle = fechaInscripcion.toISOString().split('T')[0];
      const mesDetalle = fechaInscripcion.getMonth() + 1;
      const anioDetalle = fechaInscripcion.getFullYear();

      // Inscripciones de hoy
      if (fechaDetalle === fechaHoy) {
        inscripcionesHoy++;
      }

      // Inscripciones del mes actual
      if (mesDetalle === mesActual && anioDetalle === anioActual) {
        inscripcionesMes++;
      }

      // Inscripciones del año actual
      if (anioDetalle === anioActual) {
        inscripcionesAnio++;
      }

      // Inscripciones pendientes
      if (detalle.id_inscripcion.estado === 'pendiente') {
        inscripcionesPendientes++;
      }

      // Ingresos totales (solo inscripciones confirmadas/completadas)
      if (detalle.id_inscripcion.estado === 'completado' || detalle.estado === 'completado') {
        ingresosTotales += detalle.precio_total || 0;
      }

      // Contar inscripciones por taller
      if (detalle.id_taller) {
        const tallerId = detalle.id_taller._id;
        const nombreTaller = detalle.id_taller.nombre;
        
        if (inscripcionesPorTaller.has(tallerId)) {
          inscripcionesPorTaller.set(tallerId, {
            nombre: nombreTaller,
            inscripciones: inscripcionesPorTaller.get(tallerId).inscripciones + 1
          });
        } else {
          inscripcionesPorTaller.set(tallerId, {
            nombre: nombreTaller,
            inscripciones: 1
          });
        }
      }
    });

    // Encontrar el taller más popular
    let tallerMasPopular = { nombre: '', inscripciones: 0 };
    inscripcionesPorTaller.forEach((taller, id) => {
      if (taller.inscripciones > tallerMasPopular.inscripciones) {
        tallerMasPopular = taller;
      }
    });

    // Asignar valores a las estadísticas
    this.estadisticas.inscripcionesHoy = inscripcionesHoy;
    this.estadisticas.inscripcionesMesActual = inscripcionesMes;
    this.estadisticas.inscripcionesAnioActual = inscripcionesAnio;
    this.estadisticas.inscripcionesPendientes = inscripcionesPendientes;
    this.estadisticas.ingresosTotales = ingresosTotales;
    this.estadisticas.tallerMasPopular = tallerMasPopular;
  }

  formatearFecha(fecha: Date): string {
    const opciones: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  obtenerNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
  }

  recargarDatos(): void {
    this.cargarEstadisticas();
  }
}