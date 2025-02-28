import {Unidades} from '../unidades/unidades';
import {JwtDTO} from '../models/jwt-dto';
import {Lote} from '../lote/Lote';

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
  unidad: Unidades;
  cliente: JwtDTO;
  lote:Lote;
}
