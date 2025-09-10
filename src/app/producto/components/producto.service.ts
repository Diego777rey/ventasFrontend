import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { InputProducto } from "./input.producto";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { CREATE_PRODUCTO, DELETE_PRODUCTO, GET_PRODUCTOS, UPDATE_PRODUCTO } from "src/app/graphql/producto.graphql";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(private apollo: Apollo) { }
  getAll() {
    return this.apollo.watchQuery<{ findAllProductos: InputProducto[] }>({
      query: GET_PRODUCTOS,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllProductos),
      catchError(error => {
        console.error('Error fetching productos:', error);
        return throwError(() => new Error('Error al cargar los productos'));
      })
    );
  }
  create(inputProducto: InputProducto) {
    try {
      const dto = inputProducto.toDto();

      return this.apollo.mutate({
        mutation: CREATE_PRODUCTO,
        variables: { input: dto }
      }).pipe(
        catchError(error => {
          console.error('Error creating producto:', error);
          return throwError(() => new Error('Error al crear el producto: ' + error.message));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(error.message));
    }
  }
  update(id: number, inputProducto: InputProducto) {
    try {
      const dto = inputProducto.toDto();

      return this.apollo.mutate({
        mutation: UPDATE_PRODUCTO,
        variables: {
          id: id.toString(),
          input: dto
        }
      }).pipe(
        catchError(error => {
          console.error('Error updating producto:', error);
          return throwError(() => new Error('Error al actualizar el producto: ' + error.message));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(error.message));
    }
  }
  delete(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_PRODUCTO,
      variables: {
        id: id.toString()
      }
    }).pipe(
      catchError(error => {
        console.error('Error deleting producto:', error);
        return throwError(() => new Error('Error al eliminar el producto: ' + error.message));
      })
    );
  }
}