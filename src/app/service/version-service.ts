import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private Url = environment.apiUrl + "/auth";

  constructor(private http: HttpClient,
              private tokenService: TokenService) {}
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'  // Agregar este encabezado en cada solicitud
    });
  }
  getVersion(): Observable<string> {
    return this.http.get<string>(this.Url + '/current',{ headers: this.getAuthHeaders() });
  }
}
