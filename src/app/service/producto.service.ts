// import {Injectable} from '@angular/core';
// import {HttpClient, HttpHeaders} from '@angular/common/http';
// import {Observable} from 'rxjs';
// import {TokenService} from './token.service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ProductoService {
//
//   productoURL = 'http://192.168.0.103:8080/producto/';
//   imgUrl = 'http://192.168.0.107:8080';
//
//
//   constructor(private httpClient: HttpClient,
//               private tokenService: TokenService,) {
//   }
//
//
//   private getAuthHeaders(): HttpHeaders {
//     const token = this.tokenService.getToken();
//     console.log('Token de Autenticación:', token); // Agrega este log para depuración
//     return new HttpHeaders({
//       Authorization: `Bearer ${token}`
//     });
//   }
//
//   public lista(): Observable<Producto[]> {
//     return this.httpClient.get<Producto[]>(this.productoURL + 'lista', {headers: this.getAuthHeaders()});
//   }
//
//   public reporte(): Observable<Blob> {
//     return this.httpClient.get(this.productoURL + 'exportarPDF', {
//       headers: this.getAuthHeaders(),
//       responseType: 'blob'
//     });
//   }
//
//   public detail(id: number): Observable<Producto> {
//     return this.httpClient.get<Producto>(this.productoURL + `detail/${id}`, {headers: this.getAuthHeaders()});
//   }
//
//   public detailName(nombre: string): Observable<Producto> {
//     return this.httpClient.get<Producto>(this.productoURL + `detailname/${nombre}`);
//   }
//
//   public getImage(imageUrl: string): Observable<Blob> {
//     const headers = this.getAuthHeaders();
//     return this.httpClient.get(`${this.imgUrl}/${imageUrl}`, {headers, responseType: 'blob'});
//   }
//
//   public save(formData: FormData): Observable<any> {
//     return this.httpClient.post<any>(this.productoURL + 'create', formData);
//   }
//
//   public saveImg(productoData: FormData): Observable<any> {
//     return this.httpClient.post<any>(this.productoURL + 'create', productoData);
//   }
//
//   public update(id: number, formData: FormData): Observable<any> {
//     return this.httpClient.put<any>(`${this.productoURL}update/${id}`, formData);
//   }
//
//   public delete(id: number): Observable<any> {
//     return this.httpClient.delete<any>(this.productoURL + `delete/${id}`);
//   }
// }
