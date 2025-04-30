import { inject, Injectable, OnDestroy } from '@angular/core';
import { Client, StompHeaders, StompSubscription } from '@stomp/stompjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import { Observable, Subject } from 'rxjs';

export type ListenerCallBack = (message: AdminRequest) => void;

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private connection: Client;
  private subscriptionEncomienda: StompSubscription | undefined;
  private subscriptionTransporte: StompSubscription | undefined;
  private userSubscription: StompSubscription | undefined;
  private userSubscriptionTransporte: StompSubscription | undefined;
  private readonly _BASE_URL = environment.wsUrl;
  private readonly _tokenSvc = inject(TokenService);
  private messageSubject: Subject<AdminRequest> = new Subject<AdminRequest>();
  public message$: Observable<AdminRequest> =
    this.messageSubject.asObservable();
  private messageAdminSubject: Subject<AdminRequest> = new Subject<AdminRequest>();
  public adminMessage$: Observable<AdminRequest> =
    this.messageAdminSubject.asObservable();

  private transporteMessageSubject: Subject<AdminRequestTransporte> = new Subject<AdminRequestTransporte>();
  public transporteMessage$: Observable<AdminRequestTransporte> =
    this.transporteMessageSubject.asObservable();

  private transporteAdminMessageSubject: Subject<AdminRequestTransporte> = new Subject<AdminRequestTransporte>();
  public transporteAdminMessage$: Observable<AdminRequestTransporte> =
    this.transporteAdminMessageSubject.asObservable();


  constructor() {
    {
      this.connection = new Client({
        brokerURL: `${this._BASE_URL}`,
        onConnect: () => {
          this.listen();
          this.listenTransporte();
        },
      });
    }

    this.connection.activate();
  }

  public sendRequest(message: AdminRequest): void {
    if (this.connection) {
      console.log('Enviando mensaje:', message);
      this.connection.publish({
        destination: '/app/user/request',
        body: JSON.stringify(message),
        headers: this.getHeaders(),
      });
      this.listenAdminResponse();
      localStorage.setItem('message', JSON.stringify(message));
    }
  }
  public sendTransporteRequest(message: AdminRequestTransporte): void {
    if (this.connection) {
      console.log('Enviando solicitud de transporte:', message);
      this.connection.publish({
        destination: '/app/transporte/request',
        body: JSON.stringify(message),
        headers: this.getHeaders(),
      });
      this.listenAdminTransporteResponse();
      localStorage.setItem('transporteMessage', JSON.stringify(message));
    }
  }


  /**
   *
   * @param task Mensaje a enviar al servidor.
   * @description Este método envía un mensaje al servidor a través de WebSocket, unicamente el administrador.
   */
  public sendResponse(task: AdminRequest): void {
    if (this.connection && this._tokenSvc.isAdmin()) {
      console.log('Enviando mensaje:', task);
      this.connection.publish({
        destination: '/app/admin/response',
        body: JSON.stringify(task),
        headers: this.getHeaders(),
      });
    }
  }
  public sendTransporteResponse(task: AdminRequestTransporte): void {
    if (this.connection && this._tokenSvc.isAdmin()) {
      console.log('Enviando mensaje:', task);
      this.connection.publish({
        destination: '/app/admin/transporte/response',
        body: JSON.stringify(task),
        headers: this.getHeaders(),
      });
    }
  }

  public listen(): void {
    if (this._tokenSvc.isAdmin()) {
      this.subscriptionEncomienda = this.connection.subscribe(
        '/specific/request',
        (message) => {
          try {
            const parsed = JSON.parse(message.body);
            console.log('📩 Mensaje recibido:', parsed);
            this.messageSubject.next(parsed);
          } catch (error) {
            console.error('Error al procesar mensaje:', error);
          }
        }
      );
    }
  }
  public listenTransporte(): void {
    if (this._tokenSvc.isAdmin()) {
      this.subscriptionTransporte = this.connection.subscribe(
        '/specific/transporte/request',
        (message) => {
          try {
            const parsed = JSON.parse(message.body);
            console.log('📩 Mensaje recibido:', parsed);
            this.transporteMessageSubject.next(parsed); // <<< AQUÍ
          } catch (error) {
            console.error('Error al procesar mensaje:', error);
          }
        }
      );
    }
  }

  public listenAdminResponse() {
    this.userSubscription = this.connection.subscribe(
      '/specific/response',
      (message) => {
        const storedMessage = localStorage.getItem('message');
        if (!storedMessage) {
          console.error('No se encontró el mensaje en localStorage.');
          return;
        }
        const adminRequest: AdminRequest = JSON.parse(storedMessage);
        try {
          const parsed = JSON.parse(message.body);
          if (adminRequest && adminRequest.encomienda === parsed.encomienda) {
            this.messageAdminSubject.next(parsed);
            this.destroyListenAdminResponseEncomienda();
          }
          localStorage.removeItem('message');
        } catch (error) {
          console.error('Error al procesar mensaje:', error);
        }
      }
    );
  }
  public listenAdminTransporteResponse() {
    this.userSubscriptionTransporte = this.connection.subscribe(
      '/specific/transporte/response',
      (message) => {
        const storedMessage = localStorage.getItem('transporteMessage');
        if (!storedMessage) {
          console.error('No se encontró el mensaje en localStorage.');
          return;
        }
        const adminTransporteRequest: AdminRequestTransporte = JSON.parse(storedMessage);
        try {
          const parsed = JSON.parse(message.body);
          if (adminTransporteRequest && adminTransporteRequest.transporte === parsed.transporte) {
            this.transporteAdminMessageSubject.next(parsed);
            this.destroyListenAdminResponseTransporte();
          }
          localStorage.removeItem('message');
        } catch (error) {
          console.error('Error al procesar mensaje:', error);
        }
      }
    );
  }


  ngOnDestroy(): void {
    this.destroyConnection();
  }

  private getHeaders(): StompHeaders {
    const token = this._tokenSvc.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private destroyConnection(): void {
    if (this.subscriptionEncomienda) {
      this.subscriptionEncomienda.unsubscribe();
    }
    if (this.subscriptionTransporte) {
      this.subscriptionTransporte.unsubscribe();
    }


    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.connection) {
      this.connection.deactivate();
    }
  }

  private destroyListenAdminResponseEncomienda(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private destroyListenAdminResponseTransporte(): void {
    if (this.userSubscriptionTransporte) {
      this.userSubscriptionTransporte.unsubscribe();
    }
  }


}

/**
 * Interface necesaria unicamente para la solicitud.
 */
export interface AdminRequest {
  id?: number;
  encomienda?: number;
  estado: boolean;
  username: string;
  ruta: string;
  numGuia: string;
  latitudOrg: number;
  longitudOrg : number;
  latitudDestino: number;
  longitudDestino : number;
  email?: string;
  telf:string;
  fechaCreacion?: string;
}
export interface AdminRequestTransporte {
  id?: number;
  cantidad_estibaje:number,
  transporte?: number;
  estado: boolean;
  username: string;
  pago: string;
  numOrden: string;
  latitudO: number;
  longitudO : number;
  latitudD: number;
  longitudD : number;
  email?: string;
  telf:string;
  fechaCreacion?: string;
  tipoServicio:string;
  tipo_unidad:string;
}

