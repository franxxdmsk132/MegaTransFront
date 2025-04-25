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
  private subscription: StompSubscription | undefined;
  private userSubscription: StompSubscription | undefined;
  private readonly _BASE_URL = environment.wsUrl;
  private readonly _tokenSvc = inject(TokenService);
  private messageSubject: Subject<AdminRequest> = new Subject<AdminRequest>();
  public message$: Observable<AdminRequest> =
    this.messageSubject.asObservable();
  private messageAdminSubject: Subject<AdminRequest> = new Subject<AdminRequest>();
  public adminMessage$: Observable<AdminRequest> =
    this.messageAdminSubject.asObservable();

  constructor() {
    {
      this.connection = new Client({
        brokerURL: `${this._BASE_URL}`,
        onConnect: () => {
          this.listen();
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

  public listen(): void {
    if (this._tokenSvc.isAdmin()) {
      this.subscription = this.connection.subscribe(
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
            this.destroyListenAdminResponseListener();
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.connection) {
      this.connection.deactivate();
    }
  }

  private destroyListenAdminResponseListener(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
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
  email?: string;
  fechaCreacion?: string;
}
