import { Unidades } from '../unidades/unidades';

export interface Lote {
  id?: number;
  numLote?: string;
  fecha?: string;
  estado?: string;
  encargado?:string;
  unidad?: Unidades;  // ✅ Se mantiene como objeto Unidades
  encomiendaIds?: number[]; // ✅ Lista de IDs de encomiendas
  numerosGuia?: string[]; // ✅ Lista de números de guía
  ruta?: string; // ✅ Ruta del lote
}
