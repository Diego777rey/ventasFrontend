import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { VentaService } from '../../components/venta.service';
import { ClienteService } from 'src/app/cliente/components/cliente.service';
import { ProductoService } from 'src/app/producto/components/producto.service';
import { VendedorService } from 'src/app/vendedor/components/vendedor.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Cliente, Vendedor, Producto, Venta, VentaItem } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventaForm: FormGroup;
  editingId: number | null = null;
  searchText: string = '';
  formDisabled: boolean = true;

  clientes: any[] = [];
  vendedores: any[] = [];
  productos: any[] = [];
  ventas: any[] = [];
  filteredVentas: any[] = [];

  readonly MODAL_IDS = {
    CLIENTE: 'cliente-modal',
    VENDEDOR: 'vendedor-modal',
    PRODUCTO: 'producto-modal'
  } as const;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private vendedorService: VendedorService,
    private modalService: ModalService
  ) {
    this.ventaForm = this.fb.group({
      fecha: ['', Validators.required],
      tipoPago: ['', Validators.required],
      clienteId: [null, Validators.required],
      vendedorId: [null, Validators.required],
      items: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadProductos();
    this.loadVendedores();
    this.loadVentas();
    if (this.formDisabled) this.ventaForm.disable();
  }

  // ----------------- MODALES -----------------
  abrirModalCliente() { this.modalService.openModal(this.MODAL_IDS.CLIENTE); }
  abrirModalVendedor() { this.modalService.openModal(this.MODAL_IDS.VENDEDOR); }
  abrirModalProducto() { this.modalService.openModal(this.MODAL_IDS.PRODUCTO); }

  onClienteModalClosed() { this.modalService.closeModal(this.MODAL_IDS.CLIENTE); }
  onVendedorModalClosed() { this.modalService.closeModal(this.MODAL_IDS.VENDEDOR); }
  onProductoModalClosed() { this.modalService.closeModal(this.MODAL_IDS.PRODUCTO); }

  get isClienteModalOpen() { return this.modalService.isModalOpen(this.MODAL_IDS.CLIENTE); }
  get isVendedorModalOpen() { return this.modalService.isModalOpen(this.MODAL_IDS.VENDEDOR); }
  get isProductoModalOpen() { return this.modalService.isModalOpen(this.MODAL_IDS.PRODUCTO); }

  // ----------------- CARGA DE DATOS -----------------
  loadClientes() { this.clienteService.getClientes().subscribe({ next: data => this.clientes = data, error: err => console.error(err) }); }
  loadProductos() { this.productoService.getAll().subscribe({ next: data => this.productos = data, error: err => console.error(err) }); }
  loadVendedores() { this.vendedorService.getAll().subscribe({ next: data => this.vendedores = data, error: err => console.error(err) }); }
  loadVentas() { this.ventaService.obtenerVentas().subscribe({ next: data => { this.ventas = data; this.filteredVentas = [...data]; }, error: err => console.error(err) }); }

  // ----------------- SELECCIÓN -----------------
  selectCliente(cliente: any) { this.ventaForm.patchValue({ clienteId: cliente.id }); }
  selectVendedor(vendedor: any) { this.ventaForm.patchValue({ vendedorId: vendedor.id }); }
  selectProducto(producto: any) {
    const itemsArray = this.itemsArray;
    const itemExistente = itemsArray.controls.find(c => c.get('productoId')?.value === producto.id);
    if (itemExistente) {
      const cantidadActual = itemExistente.get('cantidad')?.value || 0;
      itemExistente.get('cantidad')?.setValue(cantidadActual + 1);
    } else {
      itemsArray.push(this.fb.group({
        productoId: [producto.id],
        cantidad: [1, [Validators.required, Validators.min(1)]],
        precio: [producto.precioVenta],
        producto: [producto]
      }));
    }
  }

  get itemsArray(): FormArray { return this.ventaForm.get('items') as FormArray; }
  updateItemQuantity(index: number, event: any): void {
    const cantidad = Number(event.target.value);
    this.itemsArray.at(index).get('cantidad')?.setValue(cantidad);
  }

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  getTotalCantidad(): number {
    return this.itemsArray.controls
      .reduce((total: number, control) => {
        const cantidad = control.get('cantidad')?.value || 0;
        return total + cantidad;
      }, 0);
  }

  getTotalMonto(): number {
    return this.itemsArray.controls
      .reduce((total: number, control) => {
        const cantidad = control.get('cantidad')?.value || 0;
        const precio = control.get('precio')?.value || 0;
        return total + (cantidad * precio);
      }, 0);
  }
  onSave(): void {
    if (this.ventaForm.invalid || this.itemsArray.length === 0) {
      alert('Complete todos los campos y agregue al menos un producto');
      return;
    }

    const ventaData = {
      fecha: this.ventaForm.value.fecha,
      tipoPago: this.ventaForm.value.tipoPago,
      clienteId: this.ventaForm.value.clienteId.toString(),
      vendedorId: this.ventaForm.value.vendedorId.toString(),
      items: this.itemsArray.value.map((item: any) => ({
        productoId: item.productoId.toString(),
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    const request$ = this.editingId
      ? this.ventaService.actualizarVenta(this.editingId, ventaData)
      : this.ventaService.crearVenta(ventaData);

    request$.subscribe({
      next: () => {
        alert(`Venta ${this.editingId ? 'actualizada' : 'registrada'} correctamente`);
        this.loadVentas();
        this.onCancel();
      },
      error: err => alert('Error al guardar la venta: ' + err.message)
    });
  }

  onNew(): void {
    this.editingId = null;
    this.ventaForm.reset();
    this.itemsArray.clear();
    this.formDisabled = false;
    this.ventaForm.enable();
  }

  onCancel(): void {
    this.editingId = null;
    this.ventaForm.reset();
    this.itemsArray.clear();
    this.formDisabled = true;
    this.ventaForm.disable();
  }

  onSelect(venta: any): void {
    this.editingId = venta.id;
    this.ventaForm.patchValue({
      fecha: venta.fecha,
      tipoPago: venta.tipoPago,
      clienteId: venta.cliente?.id,
      vendedorId: venta.vendedor?.id
    });

    this.itemsArray.clear();
    venta.items?.forEach((item: any) => {
      this.itemsArray.push(this.fb.group({
        productoId: [item.productoId],
        cantidad: [item.cantidad, [Validators.required, Validators.min(1)]],
        precio: [item.precio],
        producto: [item.producto]
      }));
    });

    this.formDisabled = false;
    this.ventaForm.enable();
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar esta venta?')) {
      this.ventaService.eliminarVenta(id).subscribe({ next: () => this.loadVentas(), error: err => console.error(err) });
    }
  }

  onSearch(): void {
    if (!this.searchText) {
      this.filteredVentas = [...this.ventas];
      return;
    }
    const searchLower = this.searchText.toLowerCase();
    this.filteredVentas = this.ventas.filter(v =>
      v.cliente?.nombre?.toLowerCase().includes(searchLower) ||
      v.vendedor?.nombre?.toLowerCase().includes(searchLower) ||
      v.tipoPago?.toLowerCase().includes(searchLower) ||
      v.fecha?.toString().includes(searchLower)
    );
  }
  getClienteNombre(clienteId: number): string { return this.clientes.find(c => c.id === clienteId)?.nombre || ''; }
  getVendedorNombre(vendedorId: number): string { return this.vendedores.find(v => v.id === vendedorId)?.nombre || ''; }
}
