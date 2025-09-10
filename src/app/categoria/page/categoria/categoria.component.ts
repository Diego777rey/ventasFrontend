import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../components/categoria';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../../components/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  CategoriaForm: FormGroup;
  Categorias: Categoria[] = [];
  editingId: number | null = null;
  searchText: string = '';
  loading = false;
  errorMessage = '';
  formDisabled: boolean = true;

  constructor(private fb: FormBuilder, private categoriaService: CategoriaService) {
    this.CategoriaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
    if (this.formDisabled) {
      this.CategoriaForm.disable();
    }
  }

  loadCategorias(): void {
    this.loading = true;
    this.categoriaService.getAll().subscribe({
      next: (categorias: Categoria[]) => {
        this.Categorias = categorias;
        this.loading = false;
      },
      error: (err) => this.handleError('Error al cargar Categorias', err)
    });
  }

  onSave(): void {
    if (this.CategoriaForm.invalid) {
      this.markFormGroupTouched(this.CategoriaForm);
      return;
    }

    const categoria = new Categoria(this.CategoriaForm.value);
    this.loading = true;

    const request = this.editingId
      ? this.categoriaService.update(this.editingId, categoria)
      : this.categoriaService.create(categoria);

    request.subscribe({
      next: () => {
        alert(this.editingId ? 'Categoria actualizado' : 'Categoria creado');
        this.resetForm();
        this.loadCategorias();
        this.formDisabled = true;
        this.CategoriaForm.disable();
      },
      error: (err) => this.handleError('Error al guardar Categoria', err)
    });
  }

  onSelect(categoria: Categoria) {
    this.editingId = categoria.id || null;
    this.CategoriaForm.patchValue(categoria);
    this.formDisabled = false;
    this.CategoriaForm.enable();
  }

  onNew() {
    this.resetForm();
    this.formDisabled = false;
    this.CategoriaForm.enable();
  }

  onDelete(id: number) {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar este Categoria?')) {
      this.categoriaService.delete(id).subscribe({
        next: () => {
          alert('Categoria eliminado');
          this.resetForm();
          this.loadCategorias();
        },
        error: (err) => this.handleError('Error al eliminar Categoria', err)
      });
    }
  }

  resetForm(): void {
    this.CategoriaForm.reset(new Categoria());
    this.editingId = null;
  }

  onCancel() {
    this.resetForm();
    this.formDisabled = true;
    this.CategoriaForm.disable();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }

  private handleError(msg: string, err: any) {
    this.errorMessage = `${msg}: ${err.message || 'Error desconocido'}`;
    this.loading = false;
    console.error(msg, err);
  }

  get filteredCategorias() {
    if (!this.searchText) return this.Categorias;
    const text = this.searchText.toLowerCase();
    return this.Categorias.filter(f =>
      f.descripcion.toLowerCase().includes(text)
    );
  }
}
