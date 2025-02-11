export class Unidades{
  id?:number;
  altura?:number;
  largo?:number;
  ancho?:number;
  tipo?:string;
  tipo_cajon?:string;
  imagenUrl?:string;


  constructor(altura: number, largo: number, ancho: number, tipo: string, tipo_cajon: string, imagenUrl: string) {
    this.altura = altura;
    this.largo = largo;
    this.ancho = ancho;
    this.tipo = tipo;
    this.tipo_cajon = tipo_cajon;
    this.imagenUrl = imagenUrl;
  }
}
