import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Servicio } from '../../models/servicio.model';
import { HeaderCliente } from '../../../../shared/components/header-cliente/header-cliente';

@Component({
  selector: 'app-servicios2',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderCliente],
  templateUrl: './servicios2.html',
})
export class Servicios2 implements OnInit {

  servicios: Servicio[] = [];
  cargando: boolean = true;
  error: string | null = null;
  
  // Número de WhatsApp
  private whatsappNumber = '51959194292';
  
  // Variables para el modal de confirmación
  servicioSeleccionado: Servicio | null = null;
  showModalConfirmacion: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

cargarServicios(): void {
  this.http.get<Servicio[]>('https://amaru-produc-backend.onrender.com/servicios/activos')
    .subscribe({
      next: (data) => {
        this.servicios = data; // Mostrar todos los servicios, no solo 3
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando servicios activos:', err);
        this.error = 'No se pudieron cargar los servicios';
        this.cargando = false;
      }
    });
}
  // Función para abrir modal de confirmación
  confirmarCotizacion(servicio: Servicio): void {
    this.servicioSeleccionado = servicio;
    this.showModalConfirmacion = true;
  }

  // Función para enviar mensaje por WhatsApp
  cotizarServicio(servicio: Servicio): void {
    this.showModalConfirmacion = false;
    const mensaje = this.generarMensajeCotizacion(servicio);
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    this.servicioSeleccionado = null;
  }

  // Generar mensaje personalizado para WhatsApp
  private generarMensajeCotizacion(servicio: Servicio): string {
    return `¡Hola! 👋

Me interesa cotizar el siguiente servicio:

📸 *${servicio.titulo}*

${servicio.descripcion ? `ℹ️ ${servicio.descripcion}` : 'ℹ️ Servicio profesional de fotografía'}

Por favor, necesito información sobre:
• Precios y paquetes disponibles
• Fechas y horarios
• Requisitos específicos
• Tiempos de entrega

¡Quedo atento a su respuesta! ✨

*Datos de contacto:*
[Tu nombre]
[Tu número de teléfono]`;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.showModalConfirmacion = false;
    this.servicioSeleccionado = null;
  }

  // Función alternativa directa (sin modal)
  cotizarDirecto(servicio: Servicio): void {
    const mensaje = `¡Hola! Estoy interesado/a en cotizar el servicio: "${servicio.titulo}". Por favor, envíenme más información. Gracias!`;
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}