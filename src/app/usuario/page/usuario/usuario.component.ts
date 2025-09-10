import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../components/usuario.service';
import { InputUsuario } from '../../components/input.usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit{
  usuarioForm: FormGroup;
    usuarios: InputUsuario[] = [];
    editingId: number | null = null;
    searchText: string = '';
    loading = false;
    errorMessage = '';
    formDisabled: boolean = true;
  constructor(
    private fb: FormBuilder, private usuarioService: UsuarioService
  ){
 this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      contrasenha: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    });
  }
  ngOnInit(): void {
    this.loadUsuarios();
    if (this.formDisabled) {
      this.usuarioForm.disable();
    }
  }
  loadUsuarios(): void {
    this.loading = true;
    this.usuarioService.getAll().subscribe({
      next: (usuarios: InputUsuario[]) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (err) => this.handleError('Error al cargar Usuarios', err)
    });
  }

    onSave(): void {
      if (this.usuarioForm.invalid) {
        this.markFormGroupTouched(this.usuarioForm);
        return;
      }
  
      const usuario = new InputUsuario(this.usuarioForm.value);
      this.loading = true;
  
      const request = this.editingId
        ? this.usuarioService.update(this.editingId, usuario)
        : this.usuarioService.create(usuario);
  
      request.subscribe({
        next: () => {
          alert(this.editingId ? 'Usuario actualizado' : 'Usuario creado');
          this.resetForm();
          this.loadUsuarios();
          this.formDisabled = true;
          this.usuarioForm.disable();
        },
        error: (err) => this.handleError('Error al guardar Usuario', err)
      });
    }
      onSelect(usuario: InputUsuario) {
        this.editingId = usuario.id || null;
        this.usuarioForm.patchValue(usuario);
        this.formDisabled = false;
        this.usuarioForm.enable();
      }
    
      onNew() {
        this.resetForm();
        this.formDisabled = false;
        this.usuarioForm.enable();
      }
    
      onCancel() {
        this.resetForm();
        this.formDisabled = true;
        this.usuarioForm.disable();
      }

      onDelete(id: number) {
        if (!id) return;
        if (confirm('¿Seguro que deseas eliminar este Usuario?')) {
          this.usuarioService.delete(id).subscribe({
            next: () => {
              alert('Usuario eliminado');
              this.resetForm();
              this.loadUsuarios();
            },
            error: (err) => this.handleError('Error al eliminar Usuario', err)
          });
        }
      }
    
      resetForm(): void {
        this.usuarioForm.reset(new InputUsuario);
        this.editingId = null;
      }
    
      private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => control.markAsTouched());
      }
    
      private handleError(msg: string, err: any) {
        this.errorMessage = `${msg}: ${err.message || 'Error desconocido'}`;
        this.loading = false;
        console.error(msg, err);
      }
    
      get filtrarUsuarios() {
        if (!this.searchText) return this.usuarios;
        const text = this.searchText.toLowerCase();
        return this.usuarios.filter(f =>
          f.nombre.toLowerCase().includes(text)
        );
      }



}
