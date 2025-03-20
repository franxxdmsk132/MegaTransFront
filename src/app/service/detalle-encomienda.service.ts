import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from './token.service';
import {Observable} from 'rxjs';
import {DetalleEncomienda} from '../Encomiendas/detalle-encomienda';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleEncomiendaService {
  //apiUrl = 'http://192.168.100.190:8080/detalle-encomienda';
  //apiUrl2 = 'http://192.168.0.103:8080/detalle-encomienda';
  //apiUrl = 'https://3298-45-236-151-3.ngrok-free.app/detalle-encomienda';
  private apiUrl = environment.apiUrl + "/detalle-encomienda";
  private imgUrl = environment.apiUrl ;


  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'  // Agregar este encabezado en cada solicitud
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
  // Obtener Excel
  obtenerDetallesTransporteExcel(): Observable<Blob> {
    const headers = this.getAuthHeaders();

    return this.http.get(`${this.apiUrl}/excel`, {
      headers,
      responseType: 'blob' // Importante para manejar archivos binarios
    });
  }
  public getImage(qrCodePath: string): Observable<Blob> {
    return this.http.get(`${this.imgUrl}${qrCodePath}`, { headers: this.getAuthHeaders() , responseType: 'blob'});
  }
}
