export interface Direccion {
  id?:number;
  barrio: string;
  callePrincipal: string;
  calleSecundaria: string;
  ciudad: string;
  latitud: number;
  longitud: number;
  referencia: string;
  telefono: string;
}

export interface DetalleTransporte {
  id?: number;
  cantidadEstibaje: number;
  descripcionProducto: string;
  estado: string;
  tipoServicio: string;
  estibaje: string;
  fecha: string;
  numOrden: string;
  pago: string;
  dirOrigen: Direccion;
  dirDestino: Direccion;
  unidadId: number;
  usuarioId: number;
}
