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
    totalTalleres: 0,
    totalInscripciones: 0,
    totalProfesores: 0,
    totalActividades: 0,
    totalPremios: 0,
    totalFestivales: 0,
    totalServicios: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    totalSubcategorias: 0
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
      this.adminDataService.getSubcategorias().toPromise()
    ]).then((results: any[]) => {
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
      
      this.loading = false;
    }).catch(error => {
      console.error('Error cargando estadísticas:', error);
      this.error = 'Error al cargar las estadísticas';
      this.loading = false;
    });
  }

  recargarDatos(): void {
    this.cargarEstadisticas();
  }
}