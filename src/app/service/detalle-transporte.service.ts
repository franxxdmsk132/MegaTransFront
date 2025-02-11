import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DetalleTransporte } from '../DetalleTransporte/detalle-transporte';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class DetalleTransporteService {
  apiUrl = 'http://192.168.0.107:8080/detalle-transporte';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    console.log('Token de Autenticación:', token); // Agrega este log para depuración
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear un nuevo detalle de transporte
  crearDetalleTransporte(detalle: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers);
    return this.http.post<any>(this.apiUrl, detalle, { headers });
  }

  // Obtener todos los detalles de transporte
  obtenerDetallesTransporte(): Observable<DetalleTransporte[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleTransporte[]>(this.apiUrl, { headers });
  }

  // Obtener detalle de transporte por ID
  obtenerDetallePorId(id: number): Observable<DetalleTransporte> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleTransporte>(`${this.apiUrl}${id}`, { headers });
  }

  // Actualizar estado del detalle de transporte
  actualizarEstado(id: number, estado: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}${id}`, { estado }, { headers });
  }

  // Buscar detalle de transporte por número de orden
  buscarPorNumOrden(numOrden: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/buscar?numOrden=${numOrden}`, { headers });
  }

  // Eliminar un detalle de transporte
  eliminarDetalleTransporte(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}${id}`, { headers });
  }
}
