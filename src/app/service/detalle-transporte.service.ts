import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {DetalleTransporte} from '../DetalleTransporte/detalle-transporte';
import {TokenService} from './token.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DetalleTransporteService {
  //apiUrl = 'https://3298-45-236-151-3.ngrok-free.app/detalle-transporte';
  //apiUrl2 = 'http://192.168.0.103:8080/detalle-transporte';
  private apiUrl = environment.apiUrl + "/detalle-transporte";

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'  // Agregar este encabezado en cada solicitud
    });
  }

  // Crear un nuevo Detalle de transporte
  crearDetalleTransporte(detalle: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers);
    return this.http.post<any>(this.apiUrl, detalle, {headers});
  }

  // Obtener todos los detalles de transporte
  obtenerDetallesTransporte(): Observable<DetalleTransporte[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleTransporte[]>(`${this.apiUrl}/filtrados`, {headers});
  }
  // Obtener Excel
  obtenerDetallesTransporteExcel(): Observable<Blob> {
    const headers = this.getAuthHeaders();

    return this.http.get(`${this.apiUrl}/excel`, {
      headers,
      responseType: 'blob' // Importante para manejar archivos binarios
    });
  }

  // Obtener Detalle de transporte por ID
  obtenerDetallePorId(id: number): Observable<DetalleTransporte> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleTransporte>(`${this.apiUrl}/${id}`, {headers});
  }

  // Actualizar estado del Detalle de transporte
  actualizarEstado(id: number, estado: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, { estado }, { headers });
  }



  // Buscar Detalle de transporte por número de orden
  buscarPorNumOrden(numOrden: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/buscar?numOrden=${numOrden}`, {headers}).pipe(
      catchError(this.handleError));
  }

  // Eliminar un Detalle de transporte
  eliminarDetalleTransporte(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers});
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error al realizar la búsqueda.';
    if (error.status === 404) {
      errorMessage = 'No se encontró el número de orden.';
    }
    return throwError(errorMessage);
  }
}
