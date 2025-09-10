
import { Categoria } from "./categoria";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Apollo } from "apollo-angular";
import { CREATE_CATEGORIA, DELETE_CATEGORIA, GET_CATEGORIAS, UPDATE_CATEGORIA } from "src/app/graphql/categoria.graphql";

//ESTE ES EL SERVICIO PARA Categorias
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo.watchQuery<{ findAllCategorias: Categoria[] }>({
      query: GET_CATEGORIAS
    }).valueChanges.pipe(map(result => result.data.findAllCategorias));
  }

  create(Categoria: Categoria) {
    return this.apollo.mutate({
      mutation: CREATE_CATEGORIA,
      variables: { input: Categoria }
    });
  }

  update(id: number, Categoria: Categoria) {
    return this.apollo.mutate({
      mutation: UPDATE_CATEGORIA,
      variables: { id, input: Categoria }
    });
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_CATEGORIA,
      variables: { id }
    });
  }
}
