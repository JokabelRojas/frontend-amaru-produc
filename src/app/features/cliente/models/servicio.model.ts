// src/app/features/cliente/models/servicio.model.ts
import { Categoria } from './categoria.model';
import { Subcategoria } from './subcategoria.model';

export interface Servicio {
  _id: string;
  titulo: string;
  descripcion?: string;
  imagen_url?: string;
  estado?: 'activo' | 'inactivo';
  // Puede ser un string (ID) o el objeto completo
  id_categoria: string | Categoria;
  id_subcategoria: string | Subcategoria;
}
