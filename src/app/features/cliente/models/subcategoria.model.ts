// src/app/features/cliente/services/models/subcategoria.model.ts
import { Categoria } from './categoria.model';

export interface Subcategoria {
  _id: string
nombre: string
id_categoria: string
descripcion?: string
estado?: 'activo' | 'inactivo'
}