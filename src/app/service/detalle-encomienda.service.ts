import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from './token.service';
import {Observable} from 'rxjs';
import {DetalleEncomienda} from '../Encomiendas/detalle-encomienda';

@Injectable({
  providedIn: 'root'
})
export class DetalleEncomiendaService {
  apiUrl2 = 'http://104.196.61.204:8080/detalle-encomienda';
  apiUrl = 'http://192.168.0.103:8080/detalle-encomienda';

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    console.log('Token de Autenticación:', token); // Agrega este log para depuración
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener todos los detalles de encomienda
  getAllDetalleEncomiendas(): Observable<DetalleEncomienda[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleEncomienda[]>(`${this.apiUrl}/filtrados`, {headers});
  }
  // Obtener todos los detalles de encomienda
  getAllDetalleEncomiendasRecoleccion(): Observable<DetalleEncomienda[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleEncomienda[]>(`${this.apiUrl}/Recoleccion`, {headers});
  }
  getAllDetalleEncomiendasRecolectadas(): Observable<DetalleEncomienda[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleEncomienda[]>(`${this.apiUrl}/recolectados`, {headers});
  }

  // Crear una nueva encomienda
  crearDetalleEncomienda(detalle: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers);
    return this.http.post<any>(`${this.apiUrl}/crear`, detalle, {headers});
  }

  // Obtener detalle de encomienda por ID
  obtenerDetalleEncomienda(id: number): Observable<DetalleEncomienda> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleEncomienda>(`${this.apiUrl}/${id}`, {headers});
  }

  // Obtener detalle de encomienda por número de guía
  obtenerDetalleEncomiendaPorNumGuia(numGuia: string): Observable<DetalleEncomienda> {
    const headers = this.getAuthHeaders();
    return this.http.get<DetalleEncomienda>(`${this.apiUrl}/guia/${numGuia}`, {headers});
  }

  // Actualizar estado de una encomienda
  actualizarEstado(id: number, estado: string): Observable<string> {
    const headers = this.getAuthHeaders();
    const body = {estado}; // Suponiendo que el estado es una propiedad que se debe enviar
    return this.http.put<string>(`${this.apiUrl}/${id}`, body, {headers});
  }
}
