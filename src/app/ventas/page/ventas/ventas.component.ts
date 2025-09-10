import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from '../../components/venta.service';
import { ProductoService } from 'src/app/producto/components/producto.service';
import { VendedorService } from 'src/app/vendedor/components/vendedor.service';
import { ClienteService } from 'src/app/cliente/components/cliente.service';
import { InputVenta } from '../../components/input.venta';

declare var bootstrap: any;

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

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private vendedorService: VendedorService
  ) {
    this.ventaForm = this.fb.group({
      fecha: ['', Validators.required],
      tipoPago: ['', Validators.required],
      clienteId: [null, Validators.required],
      vendedorId: [null, Validators.required],
      items: [[]],
    });
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadProductos();
    this.loadVendedores();
    this.loadVentas();
    if (this.formDisabled) {
      this.ventaForm.disable();
    }
  }

  // 🚀 Modales
  abrirModalCliente() {
    const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
    modal.show();
  }

  abrirModalVendedor() {
    const modal = new bootstrap.Modal(document.getElementById('vendedorModal'));
    modal.show();
  }

  abrirModalProducto() {
    const modal = new bootstrap.Modal(document.getElementById('productoModal'));
    modal.show();
  }

  // 🔄 Carga de datos
  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data: any[]) => this.clientes = data,
      error: (err) => console.error('Error cargando clientes', err)
    });
  }

  loadProductos(): void {
    this.productoService.getAll().subscribe({
      next: (data: any[]) => this.productos = data,
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  loadVendedores(): void {
    this.vendedorService.getAll().subscribe({
      next: (data: any[]) => this.vendedores = data,
      error: (err) => console.error('Error cargando vendedores', err)
    });
  }

  loadVentas(): void {
    this.ventaService.getAll().subscribe({
      next: (data: any[]) => {
        this.ventas = data;
        this.filteredVentas = [...data];
      },
      error: (err) => console.error('Error cargando ventas', err)
    });
  }
  selectCliente(cliente: any): void {
    this.ventaForm.patchValue({ clienteId: cliente.id });
  }

  selectVendedor(vendedor: any): void {
    this.ventaForm.patchValue({ vendedorId: vendedor.id });
  }

  selectProducto(producto: any): void {
    const items = this.ventaForm.value.items || [];
    const itemExistente = items.find((item: any) => item.productoId === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      items.push({
        productoId: producto.id,
        cantidad: 1,
        precio: producto.precioVenta,
        producto
      });
    }

    this.ventaForm.patchValue({ items });
  }

  getClienteNombre(clienteId: number): string {
    const c = this.clientes.find(x => x.id === clienteId);
    return c ? c.nombre : '';
  }

  getVendedorNombre(vendedorId: number): string {
    const v = this.vendedores.find(x => x.id === vendedorId);
    return v ? v.nombre : '';
  }

  getTotalCantidad(): number {
    return (this.ventaForm.value.items || [])
      .reduce((total: number, item: any) => total + (item.cantidad || 0), 0);
  }

  getTotalMonto(): number {
    return (this.ventaForm.value.items || [])
      .reduce((total: number, item: any) => total + ((item.cantidad || 0) * (item.precio || 0)), 0);
  }

  calcularTotalVenta(venta: any) {
    return (venta.items || []).reduce((sum: number, item: any) => sum + item.cantidad * item.precio, 0);
  }

  updateItemQuantity(index: number, event: any): void {
    const items = [...this.ventaForm.value.items];
    items[index].cantidad = Number(event.target.value);
    this.ventaForm.patchValue({ items });
  }

  removeItem(index: number): void {
    const items = [...this.ventaForm.value.items];
    items.splice(index, 1);
    this.ventaForm.patchValue({ items });
  }

  
  onSave(): void {
    if (this.ventaForm.invalid || this.ventaForm.value.items.length === 0) {
      alert('Complete todos los campos y agregue al menos un producto');
      return;
    }

    const items = this.ventaForm.value.items.map((item: any) => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
      precio: item.precio
    }));

    const ventaData: InputVenta = {
      fecha: this.ventaForm.value.fecha,
      tipoPago: this.ventaForm.value.tipoPago,
      clienteId: this.ventaForm.value.clienteId,
      vendedorId: this.ventaForm.value.vendedorId,
      items
    };

    if (this.editingId) {
      this.ventaService.update(this.editingId, ventaData).subscribe({
        next: () => {
          alert('Venta actualizada correctamente');
          this.loadVentas();
          this.editingId = null;
          this.ventaForm.reset({ items: [] });
          this.formDisabled = true;
          this.ventaForm.disable();
        },
        error: (err) => alert('Error al actualizar la venta: ' + err.message)
      });
    } else {
      this.ventaService.create(ventaData).subscribe({
        next: () => {
          alert('Venta registrada correctamente');
          this.loadVentas();
          this.editingId = null;
          this.ventaForm.reset({ items: [] });
          this.formDisabled = true;
          this.ventaForm.disable();
        },
        error: (err) => alert('Error al crear la venta: ' + err.message)
      });
    }
  }

  // 🔄 Reset formulario
  onNew(): void {
    this.editingId = null;
    this.ventaForm.reset({ items: [] });
    this.formDisabled = false;
    this.ventaForm.enable();
  }

  
  onCancel(): void {
    this.editingId = null;
    this.ventaForm.reset({ items: [] });
    this.formDisabled = true;
    this.ventaForm.disable();
  }



  // ⚡ Editar venta desde la tabla
  onSelect(venta: any): void {
    this.editingId = venta.id;
    this.ventaForm.patchValue({
      fecha: venta.fecha,
      tipoPago: venta.tipoPago,
      clienteId: venta.cliente?.id,
      vendedorId: venta.vendedor?.id,
      items: venta.items || []
    });
    this.formDisabled = false;
    this.ventaForm.enable();
  }

  
  onDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar esta venta?')) {
      this.ventaService.delete(id).subscribe({
        next: () => this.loadVentas(),
        error: (err) => alert('Error al eliminar la venta: ' + err.message)
      });
    }
  }

  onSearch(): void {
    if (!this.searchText) {
      this.filteredVentas = [...this.ventas];
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredVentas = this.ventas.filter(venta =>
      (venta.cliente?.nombre?.toLowerCase().includes(searchLower)) ||
      (venta.vendedor?.nombre?.toLowerCase().includes(searchLower)) ||
      (venta.tipoPago?.toLowerCase().includes(searchLower)) ||
      (venta.fecha?.toString().includes(searchLower))
    );
  }
}
