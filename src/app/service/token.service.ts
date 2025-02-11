import {Injectable} from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';
const FULLNAME_KEY = 'AuthFullName';
const IDENTIFICACION_KEY = 'AuthIdentificacion';
const TELEFONO_KEY = 'AuthTelefono';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor() {
  }

  public setToken(token: string): void {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }


  public getToken(): string  {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  }

  public setUserName(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string {
    return sessionStorage.getItem(USERNAME_KEY)|| "";
  }

  public setFullName(nombre: string, apellido: string): void {
    window.sessionStorage.removeItem('AuthFullName');
    window.sessionStorage.setItem('AuthFullName', `${nombre} ${apellido}`);
  }

  public getFullName(): string {
    return sessionStorage.getItem('AuthFullName')|| "";
  }
  public setIdentificacion(identificacion: string): void {
    window.sessionStorage.removeItem(IDENTIFICACION_KEY);
    window.sessionStorage.setItem(IDENTIFICACION_KEY, identificacion);
  }

  public getIdentificacion(): string {
    return sessionStorage.getItem(IDENTIFICACION_KEY)|| "";
  }

  public setTelefono(telefono: string): void {
    window.sessionStorage.removeItem(TELEFONO_KEY);
    window.sessionStorage.setItem(TELEFONO_KEY, telefono);
  }

  public getTelefono(): string {
    return sessionStorage.getItem(TELEFONO_KEY)|| "";
  }

  public setAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
    const authorities = sessionStorage.getItem(AUTHORITIES_KEY);
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
    window.sessionStorage.clear();
  }
}
