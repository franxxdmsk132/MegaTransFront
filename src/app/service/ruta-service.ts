import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Rutas } from '../Rutas/rutas';  // Asegúrate de importar correctamente la interfaz Rutas
import { MatSnackBar } from '@angular/material/snack-bar';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RutaService {
  //rutasUrl = 'https://8cde-45-236-151-3.ngrok-free.app/rutas';
  //rutasUrl2 = 'http://192.168.0.103:8080/rutas';
  private rutasUrl = environment.apiUrl + "/rutas";


  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'  // Agregar este encabezado en cada solicitud
    });
  }

  // Cambiar el tipo de retorno a Observable<Rutas[]>
  getRutas(): Observable<Rutas[]> {
    const headers = this.getAuthHeaders(); // Combinar headers
    return this.httpClient.get<Rutas[]>(this.rutasUrl, { headers}).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }

  // Los otros métodos pueden mantenerse igual, ya que no presentan el mismo problema de tipo
  getRuta(id: number): Observable<Rutas> {
    const headers = this.getAuthHeaders(); // Combinar headers
    return this.httpClient.get<Rutas>(`${this.rutasUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }

  addRuta(ruta: Rutas): Observable<Rutas> {
    const headers = this.getAuthHeaders(); // Combinar headers
    return this.httpClient.post<Rutas>(this.rutasUrl, ruta, { headers }).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }
  // addRuta(ruta: Rutas): Observable<Rutas> {
  //   const headers = this.getAuthHeaders().set('ngrok-skip-browser-warning', 'true'); // Combinar headers
  //   return this.httpClient.post<Rutas>(this.rutasUrl, ruta, { headers: this.getAuthHeaders() }).pipe(
  //     catchError((error) => {
  //       this.showSnackbar(error.error.message, 'Error');
  //       return throwError(error);
  //     })
  //   );
  // }

  deleteRuta(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.rutasUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        this.showSnackbar(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }

  updateRuta(id: number, ruta: Rutas): Observable<Rutas> {
    const headers = this.getAuthHeaders(); // Combinar headers
    return this.httpClient.put<Rutas>(`${this.rutasUrl}/${id}`, ruta, { headers }).pipe(
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
