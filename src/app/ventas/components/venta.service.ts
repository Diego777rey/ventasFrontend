import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { InputVenta } from "./input.venta";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { CREATE_VENTA, DELETE_VENTA, GET_VENTAS, GET_VENTAS_BY_ID, UPDATE_VENTA } from "src/app/graphql/venta.graphql";

@Injectable({
  providedIn: "root",
})
export class VentaService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo
      .watchQuery<{ findAllVentas: any[] }>({
        query: GET_VENTAS,
        fetchPolicy: "network-only",
      })
      .valueChanges.pipe(
        map((result) => result.data.findAllVentas),
        catchError((error) => {
          console.error("Error cargando ventas:", error);
          return throwError(() => new Error("Error al cargar ventas"));
        })
      );
  }

  getById(id: number) {
    return this.apollo
      .watchQuery<{ findVentaById: any }>({
        query: GET_VENTAS_BY_ID,
        variables: { ventaId: id.toString() },
      })
      .valueChanges.pipe(
        map((result) => result.data.findVentaById),
        catchError((error) => {
          console.error("Error buscando venta:", error);
          return throwError(() => new Error("Error al buscar venta"));
        })
      );
  }

  create(inputVenta: InputVenta) {
    try {
      const dto = inputVenta;

      return this.apollo.mutate({
        mutation: CREATE_VENTA,
        variables: { input: dto },
      }).pipe(
        catchError((error) => {
          console.error("Error creando venta:", error);
          return throwError(() => new Error("Error al crear la venta: " + error.message));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(error.message));
    }
  }

  update(id: number, inputVenta: InputVenta) {
    try {
      const dto = inputVenta;

      return this.apollo.mutate({
        mutation: UPDATE_VENTA,
        variables: { id: id.toString(), input: dto },
      }).pipe(
        catchError((error) => {
          console.error("Error actualizando venta:", error);
          return throwError(() => new Error("Error al actualizar la venta: " + error.message));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(error.message));
    }
  }

  delete(id: number) {
    return this.apollo
      .mutate({
        mutation: DELETE_VENTA,
        variables: { id: id.toString() },
      })
      .pipe(
        catchError((error) => {
          console.error("Error eliminando venta:", error);
          return throwError(() => new Error("Error al eliminar la venta: " + error.message));
        })
      );
  }
}
