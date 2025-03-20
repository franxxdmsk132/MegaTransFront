import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from './token.service';
import {Lote} from '../lote/Lote';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {DetalleEncomienda} from '../Encomiendas/detalle-encomienda';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  //apiUrl2 = 'https://3298-45-236-151-3.ngrok-free.app/detalle-encomienda';
  //apiUrl = 'https://3298-45-236-151-3.ngrok-free.app/lote';
  //apiUrl3 = 'http://192.168.0.103:8080/lote';
  private apiUrl = environment.apiUrl + "/lote";
  private apiUrl2 = environment.apiUrl + "/detalle-encomienda";


  constructor(private http: HttpClient,
              private tokenService: TokenService) {
  }


  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'  // Agregar este encabezado en cada solicitud
    });
  }

  // ✅ Crear un nuevo lote con headers
  crearLote(lote: Lote): Observable<Lote> {
    return this.http.post<Lote>(`${this.apiUrl}`, lote, { headers: this.getAuthHeaders() });
  }

  // ✅ Listar todos los lotes con headers
  listarLotes(): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  // ✅ Obtener un lote por ID con headers
  obtenerLotePorId(id: number): Observable<Lote> {
    return this.http.get<Lote>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // ✅ Actualizar un lote con headers
  actualizarLote(id: number, lote: Lote): Observable<Lote> {
    return this.http.put<Lote>(`${this.apiUrl}/actualizar/${id}`, lote, { headers: this.getAuthHeaders() });
  }
  // ✅ Método para obtener los detalles de las encomiendas por número de guía
  obtenerEncomiendaPorNumGuia(numGuia: string): Observable<DetalleEncomienda> {
    return this.http.get<DetalleEncomienda>(`${this.apiUrl2}/guia/${numGuia}`, {
      headers: this.getAuthHeaders()
    });
  }  // ✅ Método mejorado para obtener el lote y sus encomiendas asociadas
  obtenerLoteConEncomiendas(id: number): Observable<any> {
    return this.http.get<Lote>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      switchMap((lote) => {
        if (!lote || !lote.numerosGuia || lote.numerosGuia.length === 0) {
          return new Observable((observer) => {
            observer.next({ lote, encomiendas: [] });
            observer.complete();
          });
        }

        // Hacer llamadas en paralelo para obtener los detalles de cada encomienda
        const encomiendasRequests = lote.numerosGuia.map((numGuia) =>
          this.obtenerEncomiendaPorNumGuia(numGuia)
        );

        return forkJoin(encomiendasRequests).pipe(
          map((encomiendas) => ({ lote, encomiendas }))
        );
      })
    );
  }

  // ✅ Actualizar solo el estado del lote con headers
  actualizarEstadoLote(id: number, nuevoEstado: string): Observable<Lote> {
    return this.http.put<Lote>(
      `${this.apiUrl}/${id}/estado`, // ✅ Cambiado a PUT
      null,
      { headers: this.getAuthHeaders(), params: { nuevoEstado } }
    );
  }
  actualizarEstadoLote2(id: number, nuevoEstado: string): Observable<Lote> {
    return this.http.put<Lote>(
      `${this.apiUrl}/${id}/estado2`, // ✅ Cambiado a PUT
      null,
      { headers: this.getAuthHeaders(), params: { nuevoEstado } }
    );
  }
  // Obtener Excel
  obtenerDetallesTransporteExcel(): Observable<Blob> {
    const headers = this.getAuthHeaders();

    return this.http.get(`${this.apiUrl}/excel`, {
      headers,
      responseType: 'blob' // Importante para manejar archivos binarios
    });
  }
  // Obtener Pdf
  obtenerDetallesEncomiendaPDF(id : number ): Observable<Blob> {
    const headers = this.getAuthHeaders();

    return this.http.get(`${this.apiUrl}/pdf/${id}`, {
      headers,
      responseType: 'blob' // Importante para manejar archivos binarios
    });
  }
}
