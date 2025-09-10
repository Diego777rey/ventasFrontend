export interface Producto {
  id: number;
  descripcion: string;
  precioVenta: number;
  stock: number;
  categoriaId: number;
  categoria?: {
    id: number;
    nombre: string;
  };
}
