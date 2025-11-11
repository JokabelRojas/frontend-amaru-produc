export interface Festival {
  _id?: string;
  titulo: string;
  descripcion?: string;
  fecha_evento: string;
  lugar: string;
  organizador: string;
  tipo: string;
  id_categoria: any;
  estado?: 'activo' | 'inactivo';
  imagen_url?: string;
}
