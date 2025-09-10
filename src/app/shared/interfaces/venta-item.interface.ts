import { Producto } from './producto.interface';

export interface VentaItem {
  productoId: number;
  cantidad: number;
  precio: number;
  producto?: Producto;
}
