import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendedorService } from '../../components/vendedor.service';
import { Vendedor } from '../../components/vendedor';

@Component({
  selector: 'app-vendedor-form',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.css']
})
export class VendedorComponent implements OnInit {
  vendedorForm: FormGroup;
  vendedores: Vendedor[] = [];
  editingId: number | null = null;
  searchText: string = '';
  loading = false;
  errorMessage = '';
  formDisabled: boolean = true;

  constructor(private fb: FormBuilder, private service: VendedorService) {
    this.vendedorForm = fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      activo: [true],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit() { this.load(); if (this.formDisabled) { this.vendedorForm.disable(); } }

  load() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: v => { this.vendedores = v; this.loading = false; },
      error: e => this.error('Error al cargar', e)
    });
  }

  save() {
    if (this.vendedorForm.invalid) return this.markTouched();

    const req = this.editingId
      ? this.service.update(this.editingId, new Vendedor(this.vendedorForm.value))
      : this.service.create(new Vendedor(this.vendedorForm.value));

    this.loading = true;
    req.subscribe({
      next: () => { alert(this.editingId ? 'Actualizado' : 'Creado'); this.reset(); this.load(); this.formDisabled = true; this.vendedorForm.disable(); },
      error: e => this.error('Error al guardar', e)
    });
  }
  //Aca utilizamos el select para seleccionar y poder editar
  select(v: Vendedor) { this.editingId = v.id || null; this.vendedorForm.patchValue(v); this.formDisabled = false; this.vendedorForm.enable(); }
  delete(id: number) {
    if (!id || !confirm('¿Eliminar este vendedor?')) return;
    this.service.delete(id).subscribe({
      next: () => { alert('Eliminado'); this.reset(); this.load(); },
      error: e => this.error('Error al eliminar', e)
    });
  }

  reset() { this.vendedorForm.reset({ activo: true }); this.editingId = null; }

  onNew() { this.reset(); this.formDisabled = false; this.vendedorForm.enable(); }
  onCancel() { this.reset(); this.formDisabled = true; this.vendedorForm.disable(); }
  markTouched() { Object.values(this.vendedorForm.controls).forEach(c => c.markAsTouched()); }
  error(msg: string, e: any) { this.errorMessage = `${msg}: ${e?.message || 'desconocido'}`; this.loading = false; }

  get filtrarVendedores() {
    if (!this.searchText) return this.vendedores;
    const t = this.searchText.toLowerCase();
    return this.vendedores.filter(v => v.nombre.toLowerCase().includes(t) || v.apellido.toLowerCase().includes(t));
  }
}
