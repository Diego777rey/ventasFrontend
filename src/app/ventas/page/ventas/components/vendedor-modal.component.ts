import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-vendedor-modal',
  templateUrl: './vendedor-modal.component.html',
  styleUrls: ['./vendedor-modal.component.css']
})
export class VendedorModalComponent {
  @Input() vendedores: any[] = [];
  @Input() isOpen: boolean = false;
  @Output() vendedorSelected = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  vendedorSearch: string = '';

  get filteredVendedores(): any[] {
    const q = (this.vendedorSearch || '').toLowerCase();
    if (!q) return this.vendedores;
    return this.vendedores.filter(v =>
      (v.nombre || '').toLowerCase().includes(q) ||
      (v.apellido || '').toLowerCase().includes(q) ||
      (v.email || '').toLowerCase().includes(q)
    );
  }

  onVendedorSelect(vendedor: any): void {
    this.vendedorSelected.emit(vendedor);
    this.vendedorSearch = '';
    this.modalClosed.emit();
  }

  onModalClose(): void {
    this.vendedorSearch = '';
    this.modalClosed.emit();
  }
}
