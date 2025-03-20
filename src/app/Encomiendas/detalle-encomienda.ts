import {JwtDTO} from '../Seguridad/models/jwt-dto';
import {Lote} from '../lote/Lote';

export interface DetalleEncomienda{
  id?:number;
  numGuia:string;
  usuario:JwtDTO
  fecha:string;
  dirRemitente:string;
  latitudOrg:number;
  longitudOrg:number;
  nombreD:string;
  apellidoD:string;
  identificacionD:string;
  telfBeneficiario:string;
  telfEncargado:string;
  correoD:string;
  dirDestino:string;
  latitudDestino:number;
  longitudDestino:number;
  referenciaD:string;
  tipoEntrega:string;
  ruta:string;
  estado:string;
  qrCodePath:string;
  lote:Lote
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
