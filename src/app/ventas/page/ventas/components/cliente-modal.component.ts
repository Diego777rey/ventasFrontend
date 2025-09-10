import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.css']
})
export class ClienteModalComponent {
  @Input() clientes: any[] = [];
  @Input() isOpen: boolean = false;
  @Output() clienteSelected = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  clienteSearch: string = '';

  get filteredClientes(): any[] {
    const q = (this.clienteSearch || '').toLowerCase();
    if (!q) return this.clientes;
    return this.clientes.filter(c =>
      (c.nombre || '').toLowerCase().includes(q) ||
      (c.apellido || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  }

  onClienteSelect(cliente: any): void {
    this.clienteSelected.emit(cliente);
    this.clienteSearch = '';
    this.modalClosed.emit();
  }

  onModalClose(): void {
    this.clienteSearch = '';
    this.modalClosed.emit();
  }
}
