import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from './token.service';
import {Lote} from '../lote/Lote';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  apiUrl = 'http://104.196.61.204:8080/lote';

  constructor(private http: HttpClient,
              private tokenService: TokenService) {
  }


  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    console.log('Token de Autenticación:', token); // Agrega este log para depuración
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
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

  // ✅ Actualizar solo el estado del lote con headers
  actualizarEstadoLote(id: number, nuevoEstado: string): Observable<Lote> {
    return this.http.put<Lote>(
      `${this.apiUrl}/${id}/estado`, // ✅ Cambiado a PUT
      null,
      { headers: this.getAuthHeaders(), params: { nuevoEstado } }
    );
  }

}
