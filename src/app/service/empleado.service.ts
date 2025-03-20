import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NuevoUsuario} from '../Seguridad/models/nuevo-usuario';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  //empleadoUrl = 'https://3298-45-236-151-3.ngrok-free.app/auth/';
  //empleadoUrl2 = 'http://192.168.0.103:8080/auth/';
  private empleadoUrl = environment.apiUrl + "/auth/";

constructor(private http: HttpClient) {}
  public listar():Observable<NuevoUsuario[]> {
  return this.http.get<NuevoUsuario[]>(this.empleadoUrl + 'empleados');
  }
  public save(formData: FormData):Observable<any> {
    return this.http.post<any>(this.empleadoUrl + 'nuevoEmpleado',formData);
  }
  // nuevoEmpl(formData: FormData): Observable<any> {
  //   const headers = {
  //     'Authorization': 'Bearer ' + this.tokenService.getToken()
  //   };
  //
  //   return this.httpClient.post<any>(this.authURL + 'nuevoEmpleado', formData, { headers });
  // }
  public delete(id: number): Observable<any> {
    return this.http.delete<any>(this.empleadoUrl + `empleado/${id}`);
  }
  public detail(id: number): Observable<NuevoUsuario> {
    return this.http.get<NuevoUsuario>(this.empleadoUrl + `empleado/${id}`);
  }
  public update(id: number, empleado: NuevoUsuario): Observable<any> {
    return this.http.put<any>(this.empleadoUrl + `empleado/${id}`, empleado);
  }
}


