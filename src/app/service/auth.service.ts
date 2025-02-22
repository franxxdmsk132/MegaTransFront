import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { NuevoUsuario } from '../models/nuevo-usuario';
import { Observable } from 'rxjs';
import { LoginUsuario } from '../models/login-usuario';
import { JwtDTO } from '../models/jwt-dto';
import {TokenService} from './token.service';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //authURL = 'http://192.168.0.107:8080/auth/';
  authURL = 'http://104.196.131.87:8080/auth/';
  authURL2 = environment.apiUrl + '/auth'



  constructor(private httpClient: HttpClient,
              private tokenService: TokenService,) { }


  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    console.log('Token de Autenticación:', token); // Agrega este log para depuración
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }


  public nuevo(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', formData);
  }
  nuevoEmpl(formData: FormData): Observable<any> {
    const headers = {
      'Authorization': 'Bearer ' + this.tokenService.getToken()
    };

    return this.httpClient.post<any>(this.authURL + 'nuevoEmpleado', formData, { headers });
  }

  public nuevoEmpleado(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevoEmpleado', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + 'login', loginUsuario);
  }
  public getUserProfile(username: string): Observable<JwtDTO> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<JwtDTO>(`${this.authURL}perfil/${username}`, { headers });
  }

  public changePassword(username: string, password: string, newPassword: string): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = { password, newPassword }; // Envía los datos como JSON

    return this.httpClient.put<any>(`${this.authURL}changePass/${username}`, body, { headers });
  }
  public actualizarUsuario(username: String, usuarioData: any): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
    return this.httpClient.put(`${this.authURL}usuario/${username}`, usuarioData, { headers });
  }
  public getCountUsuarios(): Observable<number> {
    // const token = this.tokenService.getToken();
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<number>(`${this.authURL}count`);
  }


}
