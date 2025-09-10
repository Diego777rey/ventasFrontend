import { Cliente } from './cliente.interface';
import { Vendedor } from './vendedor.interface';
import { VentaItem } from './venta-item.interface';

export interface Venta {
  id: number;
  fecha: string;
  tipoPago: string;
  clienteId: number;
  vendedorId: number;
  cliente?: Cliente;
  vendedor?: Vendedor;
  items: VentaItem[];
  totalMonto?: number;
  totalCantidad?: number; 
}
