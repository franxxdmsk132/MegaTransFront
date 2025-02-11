export class JwtDTO {
  token?: string;
  type?: string;
  nombreUsuario?: string;
  nombre?: string;

  apellido?: string;

  telefono?: string;
  identificacion?: string;

  authorities: string[] = [];
}
