
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Apollo } from "apollo-angular";
import { InputUsuario } from "./input.usuario";
import { CREATE_USUARIO, DELETE_USUARIO, GET_USUARIOS, UPDATE_USUARIO } from "src/app/graphql/usuario.graphql";
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo.watchQuery<{ findAllUsuarios: InputUsuario[] }>({
      query: GET_USUARIOS
    }).valueChanges.pipe(map(result => result.data.findAllUsuarios));
  }

  create(usuario: InputUsuario) {
    return this.apollo.mutate({
      mutation: CREATE_USUARIO,
      variables: { input: usuario }//aca le pasamos el parametro usuario que es de tipo input usuario
    });
  }

  update(id: number, usuario: InputUsuario) {
    return this.apollo.mutate({
      mutation: UPDATE_USUARIO,
      variables: { id, input: usuario }
    });
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_USUARIO,
      variables: { id }
    });
  }
}
