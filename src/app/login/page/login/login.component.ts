import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/usuario/components/usuario.service';
import { InputUsuario } from 'src/app/usuario/components/input.usuario';
import { Router } from '@angular/router';
import { AuthService } from '../../components/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuarioForm = this.fb.group({
    'nombre': ['', Validators.required],
    'contrasenha': ['', Validators.required],
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService, private router: Router,private authService: AuthService) {} // 🔹 inyectamos el servicio

  ngOnInit(): void {}

  iniciarSesion() {
    const nombre = this.nombre.value;
    const contrasenha = this.contrasenha.value;

    this.usuarioService.getAll().subscribe((usuarios: InputUsuario[]) => {
      const usuarioEncontrado = usuarios.find(u => u.nombre === nombre && u.contrasenha === contrasenha);
      if (usuarioEncontrado) {
        console.log('Login exitoso', usuarioEncontrado);
        this.authService.login();
        this.router.navigate(['/bienvenido']);
      } else {
        alert('Usuario o contraseña incorrecta')
        console.log('Usuario o contraseña incorrecta');
      }
    });
  }  // getters para usar en el formulario
  get nombre() {
    return this.usuarioForm.get('nombre') as FormControl;
  }

  get contrasenha() {
    return this.usuarioForm.get('contrasenha') as FormControl;
  }
}
