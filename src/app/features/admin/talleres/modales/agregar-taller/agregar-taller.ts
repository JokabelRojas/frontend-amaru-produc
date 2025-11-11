import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdminDataService } from '../../../../../core/services/admin.data.service';

interface Taller {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  horario: string;
  modalidad: 'presencial' | 'virtual' | 'hibrido';
  duracion: number | null;
  precio: number | null;
  cupo_total: number | null;
  id_categoria: string;
  id_subcategoria: string;
  estado: 'activo' | 'inactivo';
  imagen_url: string;
}

@Component({
  selector: 'app-agregar-taller',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './agregar-taller.html',
  styleUrls: ['./agregar-taller.css']
})
export class AgregarTaller implements OnInit {

  modoEdicion = false;
  idTaller: string | null = null;

  categorias: any[] = [];
  subcategorias: any[] = [];

  nuevoTaller: Taller = {
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    horario: '',
    modalidad: 'presencial',
    duracion: null,
    precio: null,
    cupo_total: null,
    id_categoria: '',
    id_subcategoria: '',
    estado: 'activo',
    imagen_url: ''
  };

  constructor(
    private dialogRef: MatDialogRef<AgregarTaller>,
    private adminDataService: AdminDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();

    if (this.data?.taller) {
      this.modoEdicion = true;
      this.idTaller = this.data.taller._id;
      this.cargarDatosEdicion();
    }
  }

  cargarCategorias(): void {
    this.adminDataService.getCategorias().subscribe({
      next: res => this.categorias = res,
      error: err => console.error('Error al cargar categorías:', err)
    });
  }

  // Cargar subcategorías según categoría seleccionada
  onCategoriaChange(): void {
    const catId = this.nuevoTaller.id_categoria;
    if (!catId) {
      this.subcategorias = [];
      this.nuevoTaller.id_subcategoria = '';
      this.nuevoTaller.nombre = '';
      this.nuevoTaller.descripcion = '';
      return;
    }

    this.adminDataService.getSubcategoriasPorCategoria(catId).subscribe({
      next: res => {
        this.subcategorias = res;

        // Si estamos editando, mantener la subcategoría seleccionada
        if (this.modoEdicion && this.nuevoTaller.id_subcategoria) {
          const existeSub = this.subcategorias.some(s => s._id === this.nuevoTaller.id_subcategoria);
          if (!existeSub) this.nuevoTaller.id_subcategoria = '';
        } else {
          this.nuevoTaller.id_subcategoria = '';
        }

        // Limpiar nombre y descripción al cambiar categoría
        this.nuevoTaller.nombre = '';
        this.nuevoTaller.descripcion = '';
      },
      error: err => console.error('Error al cargar subcategorías:', err)
    });
  }

  // Actualizar nombre y descripción al elegir subcategoría
  onSubcategoriaChange(): void {
    const subcat = this.subcategorias.find(s => s._id === this.nuevoTaller.id_subcategoria);
    if (subcat) {
      // Algunos subcategorías pueden tener nombre_taller y descripcion_taller
      this.nuevoTaller.nombre = subcat.nombre_taller ?? subcat.nombre ?? '';
      this.nuevoTaller.descripcion = subcat.descripcion_taller ?? subcat.descripcion ?? '';
    } else {
      this.nuevoTaller.nombre = '';
      this.nuevoTaller.descripcion = '';
    }
  }

  cargarDatosEdicion(): void {
    const taller = this.data.taller;

    const formatDateForInput = (dateStr: string) => {
      if (!dateStr) return '';
      return new Date(dateStr).toISOString().slice(0,16); // compatible con datetime-local
    };

    this.nuevoTaller = {
      nombre: taller.nombre || '',
      descripcion: taller.descripcion || '',
      fecha_inicio: formatDateForInput(taller.fecha_inicio),
      fecha_fin: formatDateForInput(taller.fecha_fin),
      horario: taller.horario || '',
      modalidad: taller.modalidad || 'presencial',
      duracion: taller.duracion || null,
      precio: taller.precio || null,
      cupo_total: taller.cupo_total || null,
      id_categoria: taller.id_categoria?._id || taller.id_categoria || '',
      id_subcategoria: taller.id_subcategoria?._id || taller.id_subcategoria || '',
      estado: taller.estado || 'activo',
      imagen_url: taller.imagen_url || ''
    };

    // Cargar subcategorías de la categoría seleccionada
    if (this.nuevoTaller.id_categoria) this.onCategoriaChange();
  }

  guardarTaller(): void {
    // Validación
    if (!this.nuevoTaller.id_categoria || !this.nuevoTaller.id_subcategoria || !this.nuevoTaller.horario || !this.nuevoTaller.fecha_inicio || !this.nuevoTaller.fecha_fin) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const dataToSend = {
      ...this.nuevoTaller,
      fecha_inicio: new Date(this.nuevoTaller.fecha_inicio).toISOString(),
      fecha_fin: new Date(this.nuevoTaller.fecha_fin).toISOString(),
      duracion: this.nuevoTaller.duracion || 1,
      precio: this.nuevoTaller.precio || 0,
      cupo_total: this.nuevoTaller.cupo_total || 1
    };

    const observable = this.modoEdicion && this.idTaller
      ? this.adminDataService.updateTaller(this.idTaller, dataToSend)
      : this.adminDataService.addTaller(dataToSend);

    observable.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        console.error('❌ Error al guardar taller:', err);
        alert('Error al guardar el taller: ' + (err.error?.message || err.message || 'Error desconocido'));
      }
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
