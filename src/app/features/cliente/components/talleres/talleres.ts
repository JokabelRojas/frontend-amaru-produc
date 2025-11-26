import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgClass, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TalleresService } from '../../services/talleres.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminDataService } from '../../../../core/services/admin.data.service';
import { MatIconModule } from '@angular/material/icon';
import { FooterCliente } from '../../../../shared/components/footer-cliente/footer-cliente';
import { HeaderCliente } from '../../../../shared/components/header-cliente/header-cliente';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule,FormsModule , NgFor, NgClass, DatePipe, MatIconModule, FooterCliente, HeaderCliente],
  templateUrl: './talleres.html',
  styleUrls: ['./talleres.css'],
})
export class Talleres implements OnInit {
  private talleresService = inject(TalleresService);
  private authService = inject(AuthService);
  private adminDataService = inject(AdminDataService);
  private router = inject(Router);
  
  // Propiedades para el estado de carga y errores
  cargando: boolean = true;
  error: string | null = null;
  
  talleres: any[] = [];
  currentIndex = 0;
  
  // Variables para controlar modales
  showModalNoLogueado = false;
  showModalInscripcion = false;
  showModalDetalles = false;
  tallerSeleccionado: any = null;
  usuarioData: any = null;
  emailInscripcion: string = '';


  // QR code
  qrCode = 'assets/img/qr-pago.png';

  ngOnInit(): void {
    this.cargarTalleres();
  }
  esEmailValido(email: string): boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(email);
}

  cargarTalleres(): void {
    this.cargando = true;
    this.error = null;
    
    this.talleresService.getTalleresActivos().subscribe({
      next: (response: any) => {
        console.log('Respuesta de talleres:', response);
        
        // SOLUCIÓN: Acceder a response.data que es el array
        const talleresData = response.data || [];
        
        this.talleres = talleresData.map((taller: any) => ({
          ...taller,
          categoria: taller.id_subcategoria?.nombre || 'Taller',
          duracion: this.calcularDuracion(taller.fecha_inicio, taller.fecha_fin),
          cupos: taller.cupo_disponible,
          lugar: taller.modalidad === 'presencial' ? 'Sede Principal' : 'Virtual',
          subtitulo: taller.id_subcategoria?.nombre || 'Taller Especializado',
          subdescripcion: taller.id_subcategoria?.descripcion || 'Aprende técnicas avanzadas'
        }));

        console.log('Talleres procesados:', this.talleres);
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error cargando talleres activos:', err);
        this.talleres = [];
        this.error = 'Error al cargar los talleres. Por favor, intenta nuevamente.';
        this.cargando = false;
      },
    });
  }

  public calcularDuracion(fechaInicio: string, fechaFin: string): string {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays >= 7) {
      const semanas = Math.ceil(diffDays / 7);
      return `${semanas} semana${semanas > 1 ? 's' : ''}`;
    }
    
    return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
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

  abrirModalDetalles(taller: any): void {
    this.tallerSeleccionado = taller;
    this.showModalDetalles = true;
  }

  abrirModalInscripcion(taller: any): void {
    this.tallerSeleccionado = taller;
    
    if (this.authService.isAuthenticated()) {
      this.usuarioData = this.authService.getUserData();
      this.showModalInscripcion = true;
      this.showModalNoLogueado = false;
    } else {
      this.showModalNoLogueado = true;
      this.showModalInscripcion = false;
    }
  }

  irALogin(): void {
    this.cerrarModales();
    this.router.navigate(['/login']);
  }

  cerrarModales(): void {
    this.showModalNoLogueado = false;
    this.showModalInscripcion = false;
    this.showModalDetalles = false;
    this.tallerSeleccionado = null;
    this.usuarioData = null;
  }
  
  abrirWhatsApp(): void {
    const mensaje = `Hola, acabo de realizar el pago para el taller "${this.tallerSeleccionado?.nombre}". Adjunto comprobante.`;
    const url = `https://wa.me/51959194292?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
procesarInscripcion(): void {
  // Validar que el email esté presente y sea válido
  if (!this.emailInscripcion || !this.esEmailValido(this.emailInscripcion)) {
    alert('Por favor, ingrese un email válido para continuar con la inscripción.');
    return;
  }

  if (this.tallerSeleccionado && this.usuarioData) {
    const inscripcionData = {
      id_usuario: this.usuarioData.id,
      email: this.emailInscripcion,
      estado: "pendiente"
    };

    this.adminDataService.inscribirseTaller(inscripcionData).subscribe({
      next: (responseInscripcion: any) => {
        console.log('Inscripción exitosa:', responseInscripcion);
        
        const detalleData = {
          id_inscripcion: responseInscripcion._id,
          id_taller: this.tallerSeleccionado._id,
          cantidad: 1,
          precio_unitario: this.tallerSeleccionado.precio || 0,
          precio_total: this.tallerSeleccionado.precio || 0,
          observaciones: `Inscripción ${this.tallerSeleccionado.nombre} - Email: ${this.emailInscripcion}`
        };

        this.adminDataService.crearDetalleInscripcion(detalleData).subscribe({
          next: (responseDetalle: any) => {
            console.log('Detalle de inscripción creado:', responseDetalle);
            this.cerrarModales();
            alert(`¡Inscripción exitosa para ${this.tallerSeleccionado.nombre}! Se enviará la confirmación a: ${this.emailInscripcion}`);
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

  getNombreCompleto(): string {
    if (this.usuarioData) {
      return `${this.usuarioData.nombre} ${this.usuarioData.apellido}`;
    }
    return 'Usuario';
  }
}