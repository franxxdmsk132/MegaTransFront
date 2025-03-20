export class NuevoUsuario {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  nombreComercial: string;
  nombreUsuario: string;
  identificacion: string;
  password: string;


  constructor(nombre: string, apellido: string, telefono: string,nombreComercial:string, nombreUsuario: string, identificacion: string, password: string) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.nombreComercial = nombreComercial;
    this.nombreUsuario = nombreUsuario;
    this.identificacion = identificacion;
    this.password = password;
  }
}
