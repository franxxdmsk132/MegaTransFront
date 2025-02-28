import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Rutas } from '../Rutas/rutas';  // Asegúrate de importar correctamente la interfaz Rutas
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class RutaService {
  rutasUrl = 'http://104.196.61.204:8080/rutas';
  rutasUrl2 = 'http://192.168.0.107:8080/rutas';


  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    console.log('Token de Autenticación:', token); // Agrega este log para depuración
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Cambiar el tipo de retorno a Observable<Rutas[]>
  getRutas(): Observable<Rutas[]> {
    return this.httpClient.get<Rutas[]>(this.rutasUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }

  // Los otros métodos pueden mantenerse igual, ya que no presentan el mismo problema de tipo
  getRuta(id: number): Observable<Rutas> {
    return this.httpClient.get<Rutas>(`${this.rutasUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }

  addRuta(ruta: Rutas): Observable<Rutas> {
    return this.httpClient.post<Rutas>(this.rutasUrl, ruta, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }

  deleteRuta(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.rutasUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }

  updateRuta(id: number, ruta: Rutas): Observable<Rutas> {
    return this.httpClient.put<Rutas>(`${this.rutasUrl}/${id}`, ruta, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }

  // Método para mostrar el mensaje en Snackbar
  showSnackbar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,  // Duración del Snackbar (en milisegundos)
      verticalPosition: 'top',  // Posición vertical
      horizontalPosition: 'right',  // Posición horizontal
    });
  }
}
