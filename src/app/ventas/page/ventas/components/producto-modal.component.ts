import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-producto-modal',
  templateUrl: './producto-modal.component.html',
  styleUrls: ['./producto-modal.component.css']
})
export class ProductoModalComponent {
  @Input() productos: any[] = [];
  @Input() isOpen: boolean = false;
  @Output() productoSelected = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  productoSearch: string = '';

  get filteredProductos(): any[] {
    const q = (this.productoSearch || '').toLowerCase();
    if (!q) return this.productos;
    return this.productos.filter(p =>
      (p.descripcion || '').toLowerCase().includes(q) ||
      (p.categoria?.nombre || '').toLowerCase().includes(q) ||
      String(p.precioVenta || '').toLowerCase().includes(q)
    );
  }

  onProductoSelect(producto: any): void {
    this.productoSelected.emit(producto);
    this.productoSearch = '';
    this.modalClosed.emit();
  }

  onModalClose(): void {
    this.productoSearch = '';
    this.modalClosed.emit();
  }
}
