import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgClass, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TalleresService } from '../../services/talleres.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminDataService } from '../../../../core/services/admin.data.service'; // Asegúrate de importar este servicio
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
  private authService = inject(AuthService);
  private adminDataService = inject(AdminDataService);
  private router = inject(Router);
  
  talleres: any[] = [];
  currentIndex = 0;
  
  // Variables para controlar modales
  showModalNoLogueado = false;
  showModalInscripcion = false;
  tallerSeleccionado: any = null;
  usuarioData: any = null;

  // QR code (puedes reemplazar con tu QR real)
  qrCode = 'assets/img/qr-pago.png'; // Ruta a tu imagen QR

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

  // Nueva función para abrir modal de inscripción
  abrirModalInscripcion(taller: any): void {
    this.tallerSeleccionado = taller;
    
    if (this.authService.isAuthenticated()) {
      // Usuario logueado - obtener datos y mostrar modal de inscripción
      this.usuarioData = this.authService.getUserData();
      this.showModalInscripcion = true;
      this.showModalNoLogueado = false;
    } else {
      // Usuario NO logueado - mostrar modal para login/registro
      this.showModalNoLogueado = true;
      this.showModalInscripcion = false;
    }
  }

  // Ir a login
  irALogin(): void {
    this.cerrarModales();
    this.router.navigate(['/login']);
  }

  // Cerrar todos los modales
  cerrarModales(): void {
    this.showModalNoLogueado = false;
    this.showModalInscripcion = false;
    this.tallerSeleccionado = null;
    this.usuarioData = null;
  }

  // Función para abrir WhatsApp
  abrirWhatsApp(): void {
    const mensaje = `Hola, acabo de realizar el pago para el taller "${this.tallerSeleccionado?.nombre}". Adjunto comprobante.`;
    const url = `https://wa.me/51959194292?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  // Función para procesar inscripción
  procesarInscripcion(): void {
    if (this.tallerSeleccionado && this.usuarioData) {
      // Primera API: inscribirseTaller
      const inscripcionData = {
        id_usuario: this.usuarioData.id,
        estado: "pendiente"
      };

      this.adminDataService.inscribirseTaller(inscripcionData).subscribe({
        next: (responseInscripcion: any) => {
          console.log('Inscripción exitosa:', responseInscripcion);
          
          // Segunda API: crearDetalleInscripcion
          const detalleData = {
            id_inscripcion: responseInscripcion._id,
            id_taller: this.tallerSeleccionado._id,
            cantidad: 1,
            precio_unitario: this.tallerSeleccionado.precio || 0,
            precio_total: this.tallerSeleccionado.precio || 0,
            observaciones: `Inscripción ${this.tallerSeleccionado.nombre}`
          };

          this.adminDataService.crearDetalleInscripcion(detalleData).subscribe({
            next: (responseDetalle: any) => {
              console.log('Detalle de inscripción creado:', responseDetalle);
              this.cerrarModales();
              alert(`¡Inscripción exitosa para ${this.tallerSeleccionado.nombre}!`);
            },
            error: (errorDetalle: any) => {
              console.error('Error en detalle de inscripción:', errorDetalle);
              alert('Error al completar la inscripción. Por favor, contacta con soporte.');
            }
          });
        },
        error: (errorInscripcion: any) => {
          console.error('Error en inscripción:', errorInscripcion);
          alert('Error al realizar la inscripción. Por favor, intenta nuevamente.');
        }
      });
    }
  }

  // Método para obtener nombre completo
  getNombreCompleto(): string {
    if (this.usuarioData) {
      return `${this.usuarioData.nombre} ${this.usuarioData.apellido}`;
    }
    return 'Usuario';
  }
}