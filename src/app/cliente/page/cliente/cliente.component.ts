import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../components/cliente.service';
import { Cliente } from '../../components/cliente';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  clienteForm: FormGroup;
  Clientes: Cliente[] = [];
  editingId: number | null = null;
  searchText: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  formDisabled: boolean = true;

  constructor(private fb: FormBuilder, private service: ClienteService) {
    this.clienteForm = ClienteFormHelper.buildForm(this.fb);
  }

  ngOnInit(): void {
    this.loadClientes();
    if (this.formDisabled) {
      this.clienteForm.disable();
    }
  }

  // ==================== MÉTODOS ====================

  loadClientes(): void {
    this.loading = true;
    this.service.getClientes().subscribe({
      next: data => {
        this.Clientes = data;
        this.loading = false;
      },
      error: err => this.handleError('Error al cargar Clientes', err)
    });
  }

  onSave(): void {
    if (this.clienteForm.invalid) {
      ClienteFormHelper.markTouched(this.clienteForm);
      return;
    }

    const cliente: Cliente = this.clienteForm.value;
    this.loading = true;

    const request = this.editingId
      ? this.service.updateCliente(this.editingId, cliente)
      : this.service.createCliente(cliente);

    request.subscribe({
      next: () => {
        alert(this.editingId ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
        ClienteFormHelper.resetForm(this.clienteForm);
        this.editingId = null;
        this.loadClientes();
        this.formDisabled = true;
        this.clienteForm.disable();
      },
      error: err => this.handleError('Error al guardar Cliente', err)
    });
  }

  onSelect(cliente: Cliente): void {
    this.editingId = cliente.id || null;
    this.clienteForm.patchValue(cliente);
    this.formDisabled = false;
    this.clienteForm.enable();
  }

  onNew(): void {
    ClienteFormHelper.resetForm(this.clienteForm);
    this.editingId = null;
    this.formDisabled = false;
    this.clienteForm.enable();
  }

  onCancel(): void {
    ClienteFormHelper.resetForm(this.clienteForm);
    this.editingId = null;
    this.formDisabled = true;
    this.clienteForm.disable();
  }

  onDelete(id: number): void {
    if (!id || !confirm('¿Seguro que deseas eliminar este Cliente?')) return;

    this.service.deleteCliente(id).subscribe({
      next: () => {
        alert('Cliente eliminado exitosamente');
        this.onNew();
        this.loadClientes();
      },
      error: err => this.handleError('Error al eliminar Cliente', err)
    });
  }

  // ==================== FILTROS ====================
  get filteredClientes(): Cliente[] {
    if (!this.searchText) return this.Clientes;
    const text = this.searchText.toLowerCase();
    return this.Clientes.filter(f =>
      f.nombre.toLowerCase().includes(text) ||
      f.apellido.toLowerCase().includes(text)
    );
  }

  // ==================== UTILIDADES ====================
  private handleError(message: string, error: any): void {
    this.errorMessage = `${message}: ${error.message || 'Error desconocido'}`;
    this.loading = false;
    console.error(message, error);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.clienteForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  isInvalid(controlName: string): boolean {
    const control = this.clienteForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  getButtonText(): string {
    return this.editingId ? 'Actualizar' : 'Guardar';
  }

  canDelete(): boolean {
    return this.editingId !== null;
  }

}

// ==================== FORM HELPER ====================
class ClienteFormHelper {

  static buildForm(fb: FormBuilder): FormGroup {
    return fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      documento: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      activo: [true, Validators.required],
      fechaRegistro: ['', [Validators.required]]
    });
  }

  static markTouched(form: FormGroup): void {
    Object.values(form.controls).forEach(control => control.markAsTouched());
  }

  static resetForm(form: FormGroup): void {
    form.reset({
      nombre: '',
      apellido: '',
      documento: '',
      telefono: '',
      email: '',
      activo: true,
      fechaRegistro: ''
    });
  }

}
