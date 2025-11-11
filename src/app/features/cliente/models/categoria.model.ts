
export interface Categoria {
  _id: string
nombre: string
tipo: 'taller' | 'servicio'
descripcion?: string
estado?: 'activo' | 'inactivo'

}
