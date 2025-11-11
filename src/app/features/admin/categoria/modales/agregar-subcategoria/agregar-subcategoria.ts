import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminDataService } from '../../../../../core/services/admin.data.service';
@Component({
  selector: 'app-agregar-subcategoria',
  imports: [MatIconModule, CommonModule, FormsModule],  
  templateUrl: './agregar-subcategoria.html',
  styleUrl: './agregar-subcategoria.css'
})
export class AgregarSubcategoria {

modoEdicion: boolean = false;
  idSubcategoria: string | null = null;
  categorias: any[] = [];

  nuevaSubcategoria = {
    nombre: '',
    descripcion: '',
    id_categoria: ''
  };

  constructor(
    private dialogRef: MatDialogRef<AgregarSubcategoria>,
    private adminDataService: AdminDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Si se reciben datos, activar modo edición y rellenar campos
    if (data && data.subcategoria) {
      this.modoEdicion = true;
      this.idSubcategoria = data.subcategoria._id;
      this.nuevaSubcategoria = {
        nombre: data.subcategoria.nombre,
        descripcion: data.subcategoria.descripcion,
        id_categoria: data.subcategoria.id_categoria?._id || ''
      };
    }
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.adminDataService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  guardarSubcategoria(): void {
    if (!this.nuevaSubcategoria.nombre || !this.nuevaSubcategoria.descripcion || !this.nuevaSubcategoria.id_categoria) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    if (this.modoEdicion && this.idSubcategoria) {
      // 🔄 Modo edición → PATCH
      this.adminDataService.updateSubcategoria(this.idSubcategoria, this.nuevaSubcategoria).subscribe({
        next: (res) => {
          console.log('Subcategoría actualizada correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar subcategoría:', err);
        }
      });
    } else {
      // 🆕 Modo creación → POST
      this.adminDataService.addSubcategoria(this.nuevaSubcategoria).subscribe({
        next: (res) => {
          console.log('Subcategoría agregada correctamente:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al agregar subcategoría:', err);
        }
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }


}
