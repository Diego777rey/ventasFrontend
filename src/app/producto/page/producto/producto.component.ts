import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputProducto } from '../../components/input.producto';
import { ProductoService } from '../../components/producto.service';
import { CategoriaService } from 'src/app/categoria/components/categoria.service';
import { Categoria } from 'src/app/categoria/components/categoria';

declare var bootstrap: any; // 👈 importante para manejar el modal con Bootstrap JS

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productoForm: FormGroup;
  inputProducto: InputProducto[] = [];
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  editingId: number | null = null;
  searchText: string = '';
  searchCategoria: string = '';
  loading = false;
  errorMessage = '';
  formDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {
    this.productoForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      stock: [0,[Validators.required, Validators.min(0)]],
      activo: [true, Validators.required],
      categoria: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProductos();
    this.loadCategorias();
    if (this.formDisabled) {
      this.productoForm.disable();
    }
  }

  private buildProductoFromForm(): InputProducto {
    const formValue = this.productoForm.value;

    const producto = new InputProducto();
    producto.descripcion = formValue.descripcion.trim();
    producto.precioCompra = Number(formValue.precioCompra);
    producto.precioVenta = Number(formValue.precioVenta);
    producto.stock = Number(formValue.stock);
    producto.activo = Boolean(formValue.activo);
    producto.categoria = formValue.categoria;

    return producto;
  }

  loadProductos(): void {
    this.loading = true;
    this.productoService.getAll().subscribe({
      next: (inputProducto: InputProducto[]) => {
        this.inputProducto = inputProducto;
        this.loading = false;
      },
      error: (err: any) => this.handleError('Error al cargar productos', err)
    });
  }

  onSave(): void {
    if (this.productoForm.invalid) {
      this.markFormGroupTouched(this.productoForm);
      return;
    }
    const producto = this.buildProductoFromForm();
    if (producto.precioVenta <= producto.precioCompra) {
      alert('El precio de venta debe ser mayor que el precio de compra');
      return;
    }
    this.loading = true;

    const request = this.editingId
      ? this.productoService.update(this.editingId, producto)
      : this.productoService.create(producto);

    request.subscribe({
      next: () => {
        alert(this.editingId ? 'Producto actualizado' : 'Producto creado');
        this.resetForm();
        this.loadProductos();
        this.formDisabled = true;
        this.productoForm.disable();
      },
      error: (err: any) => {
        this.loading = false;
        if (err.message.includes('Categoría no válida')) {
          alert('Error: Debes seleccionar una categoría válida');
          this.errorMessage = 'Debes seleccionar una categoría válida';
        } else {
          this.handleError('Error al guardar producto', err);
        }
      }
    });
  }

  onSelect(inputProducto: InputProducto) {
    this.editingId = inputProducto.id || null;
    this.productoForm.patchValue({
      descripcion: inputProducto.descripcion,
      precioCompra: inputProducto.precioCompra,
      precioVenta: inputProducto.precioVenta,
      stock: inputProducto.stock,
      activo: inputProducto.activo,
      categoria: inputProducto.categoria ?? null
    });
    this.formDisabled = false;
    this.productoForm.enable();
  }

  onNew() {
    this.resetForm();
    this.formDisabled = false;
    this.productoForm.enable();
  }

  onDelete(id: number) {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productoService.delete(id).subscribe({
        next: () => {
          alert('Producto eliminado');
          this.resetForm();
          this.loadProductos();
        },
        error: (err: any) => this.handleError('Error al eliminar producto', err)
      });
    }
  }

  resetForm(): void {
    this.productoForm.reset({
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      activo: true,
      categoria: null
    });
    this.editingId = null;
    this.errorMessage = '';
  }

  onCancel() {
    this.resetForm();
    this.formDisabled = true;
    this.productoForm.disable();
  }

  loadCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
        this.categoriasFiltradas = categorias;
      },
      error: (err: any) => this.handleError('Error al cargar categorías', err)
    });
  }

  // 🔹 Abrir modal de categorías
  abrirModalCategoria() {
    const modalElement = document.getElementById('categoriaModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // 🔹 Buscar categorías dentro del modal
  filtrarCategorias() {
    const filtro = this.searchCategoria.toLowerCase();
    this.categoriasFiltradas = this.categorias.filter(c =>
      c.descripcion.toLowerCase().includes(filtro)
    );
  }

  // 🔹 Seleccionar categoría desde el modal
  seleccionarCategoria(categoria: Categoria) {
    if (categoria && categoria.id != 0) {
      this.productoForm.patchValue({ categoria: categoria });
      const modalElement = document.getElementById('categoriaModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      }
    }
  }

  getCategoriaDescripcion(categoria: Categoria | null): string {
    return categoria ? categoria.descripcion : '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleError(msg: string, err: any) {
    let errorDetails = err.message;

    if (err.graphQLErrors && err.graphQLErrors.length > 0) {
      errorDetails = err.graphQLErrors.map((e: any) => e.message).join(', ');
    }

    this.errorMessage = `${msg}: ${errorDetails}`;
    this.loading = false;
    console.error(msg, err);
    alert(`Error: ${errorDetails}`);
  }

  get filteredProductos() {
    if (!this.searchText) return this.inputProducto;
    const text = this.searchText.toLowerCase();
    return this.inputProducto.filter(f =>
      f.descripcion.toLowerCase().includes(text)
    );
  }

  get f() {
    return this.productoForm.controls;
  }
}
