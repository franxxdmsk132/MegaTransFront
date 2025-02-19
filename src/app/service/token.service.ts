import {Injectable} from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';
const FULLNAME_KEY = 'AuthFullName';
const IDENTIFICACION_KEY = 'AuthIdentificacion';
const TELEFONO_KEY = 'AuthTelefono';
const NOMBRE_COMERCIAL_KEY = 'AuthNombreComercial';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor() {
  }

  public setToken(token: string): void {
    window.localStorage.setItem(TOKEN_KEY, token);
  }


  public getToken(): string  {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  public setUserName(userName: string): void {
    window.localStorage.removeItem(USERNAME_KEY);
    window.localStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string {
    return localStorage.getItem(USERNAME_KEY)|| "";
  }

  public setFullName(nombre: string, apellido: string): void {
    window.localStorage.removeItem('AuthFullName');
    window.localStorage.setItem('AuthFullName', `${nombre} ${apellido}`);
  }

  public getFullName(): string {
    return localStorage.getItem('AuthFullName')|| "";
  }
  public setIdentificacion(identificacion: string): void {
    window.localStorage.removeItem(IDENTIFICACION_KEY);
    window.localStorage.setItem(IDENTIFICACION_KEY, identificacion);
  }

  public getIdentificacion(): string {
    return localStorage.getItem(IDENTIFICACION_KEY)|| "";
  }

  public setTelefono(telefono: string): void {
    window.localStorage.removeItem(TELEFONO_KEY);
    window.localStorage.setItem(TELEFONO_KEY, telefono);
  }

  public getTelefono(): string {
    return localStorage.getItem(TELEFONO_KEY)|| "";
  }

  public getNombreComercial(): string {
    return localStorage.getItem(NOMBRE_COMERCIAL_KEY)|| "";
  }
  public setNombreComercial(nombreComercial: string): void {
    window.localStorage.removeItem(NOMBRE_COMERCIAL_KEY);
    window.localStorage.setItem(NOMBRE_COMERCIAL_KEY, nombreComercial);
  }

  public setAuthorities(authorities: string[]): void {
    window.localStorage.removeItem(AUTHORITIES_KEY);
    window.localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
    const authorities = localStorage.getItem(AUTHORITIES_KEY);
    if (authorities) {
      JSON.parse(authorities).forEach((authority: any) => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }


  public isAdmin(): boolean {
    return this.getAuthorities().includes('ROLE_ADMIN');
  }

  public isEmpl(): boolean {
    return this.getAuthorities().includes('ROLE_EMPL');
  }

  public logOut(): void {
    window.localStorage.clear();
  }


}
