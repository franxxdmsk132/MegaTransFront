import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { NuevoUsuario } from '../Seguridad/models/nuevo-usuario';
import { Observable } from 'rxjs';
import { LoginUsuario } from '../Seguridad/models/login-usuario';
import { JwtDTO } from '../Seguridad/models/jwt-dto';
import {TokenService} from './token.service';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL = environment.apiUrl + "/auth/";

  //authURL = 'http://192.168.0.107:8080/auth/';
  //authURL = 'http://192.168.100.190:8080/auth/';
  //authURL2 = 'http://192.168.0.103:8080/auth/';
  //authURL = 'https://8cde-45-236-151-3.ngrok-free.app/auth/';
  //authURL3 =  'http://192.168.100.190:8080/auth/';



  constructor(private httpClient: HttpClient,
              private tokenService: TokenService,) { }


  // private getAuthHeaders(): HttpHeaders {
  //   const token = this.tokenService.getToken();
  //   console.log('Token de Autenticación:', token); // Agrega este log para depuración
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${token}`
  //   });
  // }
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'  // Agregar este encabezado en cada solicitud
    });
  }

  public nuevo(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', formData, {
      headers: this.getAuthHeaders()
    });
  }

  nuevoEmpl(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevoEmpleado', formData, {
      headers: this.getAuthHeaders()
    });
  }

  public nuevoEmpleado(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevoEmpleado', nuevoUsuario, {
      headers: this.getAuthHeaders()
    });
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + 'login', loginUsuario, {
      headers: this.getAuthHeaders()
    });
  }

  public getUserProfile(username: string): Observable<JwtDTO> {
    return this.httpClient.get<JwtDTO>(`${this.authURL}perfil/${username}`, {
      headers: this.getAuthHeaders()
    });
  }

  public changePassword(username: string, password: string, newPassword: string): Observable<any> {
    const body = { password, newPassword };  // Envía los datos como JSON
    return this.httpClient.put<any>(`${this.authURL}changePass/${username}`, body, {
      headers: this.getAuthHeaders()
    });
  }

  public actualizarUsuario(username: String, usuarioData: any): Observable<any> {
    return this.httpClient.put(`${this.authURL}usuario/${username}`, usuarioData, {
      headers: this.getAuthHeaders()
    });
  }

  public getCountUsuarios(): Observable<number> {
    return this.httpClient.get<number>(`${this.authURL}count`, {
      headers: this.getAuthHeaders()
    });
  }
}
