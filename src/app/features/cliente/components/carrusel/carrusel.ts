import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgClass, DatePipe } from '@angular/common';
import { TalleresService } from '../../services/talleres.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule, NgFor, NgClass, DatePipe, MatIconModule],
  templateUrl: './carrusel.html',
  styleUrls: ['./carrusel.css'],
})
export class Carrusel implements OnInit {
  private talleresService = inject(TalleresService);
  talleres: any[] = [];
  currentIndex = 0;

  ngOnInit(): void {
    this.cargarTalleres();
  }

  cargarTalleres(): void {
    this.talleresService.getTalleresActivos().subscribe({
      next: (data: any[]) => (this.talleres = data),
      error: (err: any) => console.error('Error cargando talleres activos:', err),
    });
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.talleres.length) % this.talleres.length;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.talleres.length;
  }

  irSlide(index: number): void {
    this.currentIndex = index;
  }
}
