import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from './token.service';
import {catchError, Observable, throwError} from 'rxjs';
import {Unidades} from '../unidades/unidades';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UnidadesService {
  //unidadesUrl = 'https://3298-45-236-151-3.ngrok-free.app/unidad/';
  //imgUrl = 'https://8cde-45-236-151-3.ngrok-free.app';
  // unidadesUrl = 'http://192.168.0.103:8080/unidad/';
  // imgUrl = 'http://192.168.0.103:8080';
  private unidadesUrl = environment.apiUrl + "/unidad/";
  public imgUrl = environment.apiUrl;


  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'  // Agregar este encabezado en cada solicitud
    });
  }
  private getAuthHeadersImg(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`  // Agregar este encabezado en cada solicitud
    });
  }


  public lista(): Observable<Unidades[]> {
    return this.httpClient.get<Unidades[]>(this.unidadesUrl + 'lista', {headers: this.getAuthHeaders()});
  }

  public save(formData: FormData): Observable<any> {
    const token = this.tokenService.getToken();
    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.httpClient.post<any>(this.unidadesUrl + 'create', formData, {headers});
  }
  obtenerUnidadPorId(id: number): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // No pongas 'Content-Type', ya que FormData se encarga de eso
    });

    return this.httpClient.get(`${this.unidadesUrl}detalles/${id}`, { headers:this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('Error al obtener la unidad:', err);
        return throwError(() => new Error('Error al obtener la unidad'));
      })
    );
  }



  public update(id: number, formData: FormData): Observable<any> {
    const token = this.tokenService.getToken();
    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    // Asegúrate de que el método PUT también pase los headers
    return this.httpClient.put<any>(`${this.unidadesUrl}update/${id}`, formData, { headers });
  }


  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.unidadesUrl + `delete/${id}`);
  }

  public getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(`${this.imgUrl}${imageUrl}`, { headers: this.getAuthHeaders() , responseType: 'blob'});
  }
}
