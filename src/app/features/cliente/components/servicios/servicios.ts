import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './servicios.html',
})
export class Servicios implements OnInit {

  servicios: Servicio[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.http.get<Servicio[]>('http://localhost:3000/servicios/activos')
      .subscribe({
        next: (data) => {
          // Solo tomar los primeros 3 servicios
          this.servicios = data.slice(0, 3);
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error cargando servicios activos:', err);
          this.error = 'No se pudieron cargar los servicios';
          this.cargando = false;
        }
      });
  }
}
