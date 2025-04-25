import { inject, Injectable } from '@angular/core';
import {
  PushNotifications,
  PushNotificationSchema,
  Token,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { AdminRequest, WebsocketService } from './websocket.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BlockingModalComponent } from '../blocking-modal/blocking-modal.component';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private readonly _BASE_URL = environment.apiUrl;
  private readonly _http = inject(HttpClient);
  private readonly _tokenSvc = inject(TokenService);
  private readonly _wsSvc = inject(WebsocketService);
  private readonly _dialog = inject(MatDialog);

  constructor() {}

  initPush() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      this.sendTokenToServer(token.value);
    });

    // 4. Manejar errores de registro
    PushNotifications.addListener('registrationError', (err) => {
      console.error('❌ Error de registro FCM', err);
    });

    // 5. Notificación recibida en foreground
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('🔔 Notificación recibida:', notification);
      }
    );

    // 6. Notificación abierta desde background
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        const rawData = action.notification?.data?.data;

        if (!rawData) {
          alert('No se encontró la data en la notificación');
          return;
        }

        let message: AdminRequest;

        try {
          message = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        } catch (error) {
          alert(`Error al parsear la data de la notificación ${error}`);
          return;
        }

        const dialogRef = this._dialog.open(BlockingModalComponent, {
          data: message,
          disableClose: true,
        });
  
        dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
          message.estado = result === 'accepted';
          this._wsSvc.sendResponse(message);
        });
      }
    );
  }

  private sendTokenToServer(token: string) {
    this._http
      .post(
        `${
          this._BASE_URL
        }/auth/saveTokenFMC?tokenFMC=${token}&username=${this._tokenSvc.getUserName()}`,
        {}
      )
      .subscribe({
        next: () => console.log('✅ Token FCM guardado en el backend'),
        error: (err) => console.error('❌ Error al enviar token FCM', err),
      });
  }
}
