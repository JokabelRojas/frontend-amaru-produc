export interface Premio {
  _id?: string;
  nombre: string;
  descripcion?: string;
  festival: string; // referencia al _id del festival
  valor?: string;
  estado?: 'activo' | 'inactivo';
  imagen_url?: string;
}
