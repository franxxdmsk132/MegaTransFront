import {JwtDTO} from '../models/jwt-dto';

export interface DetalleEncomienda{
  id?:number;
  numGuia:string;
  cliente:JwtDTO
  fecha:string;
  dirRemitente:string;
  nombreD:string;
  apellidoD:string;
  identificacionD:string;
  telfBeneficiario:string;
  telfEncargado:string;
  correoD:string;
  referenciaD:string;
  tipoEntrega:string;
  ruta:string;
  estado:string;
  qrCodePath:string;
}
export interface Productos{
  id?: number;
  alto:number;
  ancho:number;
  largo:number;
  peso:number;
  fragil:boolean;
  detalleEncomienda_id: DetalleEncomienda;
}
