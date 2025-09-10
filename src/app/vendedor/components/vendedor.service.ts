// src/app/services/vendedor.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Vendedor } from './vendedor';
import { map } from 'rxjs';
import { CREATE_VENDEDOR, DELETE_VENDEDOR, GET_VENDEDORES, UPDATE_VENDEDOR } from 'src/app/graphql/vendedor.graphql';
@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo.watchQuery<{ findAllVendedores: Vendedor[] }>({
      query: GET_VENDEDORES
    }).valueChanges.pipe(map(result => result.data.findAllVendedores));//este es lo que devuelve el servicio graphql
  }

  create(vendedor: Vendedor) {
    return this.apollo.mutate({
      mutation: CREATE_VENDEDOR,
      variables: { input: vendedor }
    });
  }

  update(id: number, vendedor: Vendedor) {
    return this.apollo.mutate({
      mutation: UPDATE_VENDEDOR,
      variables: { id, input: vendedor }
    });
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_VENDEDOR,
      variables: { id }
    });
  }
}
