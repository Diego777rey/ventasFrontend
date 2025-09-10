import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from './cliente';
import { CREATE_CLIENTE, DELETE_CLIENTE, GET_CLIENTES, UPDATE_CLIENTE } from 'src/app/graphql/cliente.graphql';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  constructor(private apollo: Apollo) {}

  getClientes(): Observable<Cliente[]> {
    return this.apollo.watchQuery<{ findAllClientes: Cliente[] }>({
      query: GET_CLIENTES
    }).valueChanges.pipe(
      map(result => result.data.findAllClientes)
    );
  }

  createCliente(cliente: Cliente): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_CLIENTE,
      variables: { input: cliente }
    });
  }

  updateCliente(id: number, cliente: Cliente): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_CLIENTE,
      variables: { id, input: cliente }
    });
  }

  deleteCliente(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_CLIENTE,
      variables: { id }
    });
  }
}
