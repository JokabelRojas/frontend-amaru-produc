import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { AgregarCategoria } from './modales/agregar-categoria/agregar-categoria';
import { AgregarSubcategoria } from './modales/agregar-subcategoria/agregar-subcategoria';

@Component({
  selector: 'app-categoria',
  imports: [MatIconModule, CommonModule ],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css'
})
export class Categoria {
  activeTab: 'categorias' | 'subcategorias' = 'categorias';

  categorias: any[] = [];
  subcategorias: any[] = [];

  constructor(private adminDataService: AdminDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarCategoriasYSubcategorias();
  }

  cargarCategoriasYSubcategorias(): void {
    this.adminDataService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargarSubcategorias();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  cargarSubcategorias(): void {
    this.adminDataService.getSubcategorias().subscribe({
      next: (data) => {
        this.subcategorias = data;

        this.subcategorias.forEach((subcat) => {
          if (subcat.id_categoria) {
            this.adminDataService.getCategoriaPorId(subcat.id_categoria._id).subscribe({
              next: (categoria) => {
                subcat.categoria = categoria.nombre;
              },
              error: (err) => {
                console.error(`Error al obtener categoría ${subcat.id_categoria}:`, err);
                subcat.categoria = 'Sin categoría';
              }
            });
          } else {
            subcat.categoria = 'Sin categoría';
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar subcategorías:', err);
      }
    });
  }

  abrirModalCategoria(): void {
    const dialogRef = this.dialog.open(AgregarCategoria, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarCategoriasYSubcategorias();
      }
    });
  }

  eliminarCategoria(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
      this.adminDataService.deleteCategoria(id).subscribe({
        next: (res) => {
          console.log('Categoría eliminada correctamente:', res);
          this.cargarCategoriasYSubcategorias();
        },
        error: (err) => {
          console.error('Error al eliminar la categoría:', err);
        }
      });
    }
  }

  editarCategoria(categoria: any): void {
    const dialogRef = this.dialog.open(AgregarCategoria, {
      width: '500px',
      data: { categoria }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarCategoriasYSubcategorias();
      }
    });
  }

  abrirModalSubcategoria(): void {
    const dialogRef = this.dialog.open(AgregarSubcategoria, {
      width: '500px',
      data: { categorias: this.categorias } 
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarCategoriasYSubcategorias();
      }
    });
  }

  eliminarSubcategoria(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta subcategoría?')) {
      this.adminDataService.deleteSubcategoria(id).subscribe({
        next: (res) => {
          console.log('Subcategoría eliminada correctamente:', res);
          this.cargarCategoriasYSubcategorias();
        },
        error: (err) => {
          console.error('Error al eliminar la subcategoría:', err);
        }
      });
    }
  }

  editarSubcategoria(subcategoria: any): void {
    const dialogRef = this.dialog.open(AgregarSubcategoria, {
      width: '500px',
      data: { subcategoria, categorias: this.categorias }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarCategoriasYSubcategorias();
      }
    });
  }
}
