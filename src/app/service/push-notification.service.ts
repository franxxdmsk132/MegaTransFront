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
import { AdminRequest,AdminRequestTransporte, WebsocketService } from './websocket.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BlockingModalComponent } from '../blocking-modal/blocking-modal.component';
import {BlockingModalTransporteComponent} from '../blocking-modal/blocking-modal-transporte.component';

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
    // PushNotifications.addListener(
    //   'pushNotificationActionPerformed',
    //   (action: ActionPerformed) => {
    //     const rawData = action.notification?.data?.data;
    //
    //     if (!rawData) {
    //       alert('Su solicitud ya fue revisada!');
    //       //alert('No se encontró la data en la notificación');
    //       return;
    //     }
    //
    //     try {
    //       const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    //
    //       // Detectar si es encomienda o transporte
    //       const isTransporte = parsedData.hasOwnProperty('transporte');
    //       //
    //       // const dialogRef = this._dialog.open(BlockingModalComponent, {
    //       //   data: parsedData,
    //       //   disableClose: true,
    //       // });
    //       //
    //       // dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
    //       //   parsedData.estado = result === 'accepted';
    //       //   if (isTransporte) {
    //       //     this._wsSvc.sendTransporteResponse(parsedData as AdminRequestTransporte);
    //       //     console.log('🚚 Solicitud de TRANSPORTE abierta desde notificación');
    //       //
    //       //   } else {
    //       //     this._wsSvc.sendResponse(parsedData as AdminRequest);
    //       //     console.log('📦 Solicitud de ENCOMIENDA abierta desde notificación');
    //       //
    //       //   }
    //       // });
    //       if (isTransporte) {
    //         console.log('🚚 Solicitud de TRANSPORTE abierta desde notificación');
    //         const dialogRef = this._dialog.open(BlockingModalTransporteComponent, {
    //           data: parsedData,
    //           disableClose: true,
    //         });
    //
    //         dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
    //           parsedData.estado = result === 'accepted';
    //           this._wsSvc.sendTransporteResponse(parsedData as AdminRequestTransporte);
    //         });
    //
    //       } else {
    //         console.log('📦 Solicitud de ENCOMIENDA abierta desde notificación');
    //         const dialogRef = this._dialog.open(BlockingModalComponent, {
    //           data: parsedData,
    //           disableClose: true,
    //         });
    //
    //         dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
    //           parsedData.estado = result === 'accepted';
    //           this._wsSvc.sendResponse(parsedData as AdminRequest);
    //         });
    //       }
    //
    //
    //     } catch (error) {
    //       alert(`Error al parsear la data de la notificación: ${error}`);
    //     }
    //
    //   }
    // );

    //6.1
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        const rawData = action.notification?.data?.data;

        if (!rawData) {
          alert('Su solicitud ya fue revisada o no se encontró la data.');
          return;
        }

        try {
          const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
          console.log('📦 Datos parseados:', parsedData);

          const isTransporte = 'transporte' in parsedData && parsedData.transporte !== undefined;

          if (isTransporte) {
            console.log('🚚 Abriendo modal de TRANSPORTE');
            const dialogRef = this._dialog.open(BlockingModalTransporteComponent, {
              data: parsedData,
              disableClose: true,
            });

            dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
              parsedData.estado = result === 'accepted';
              this._wsSvc.sendTransporteResponse(parsedData as AdminRequestTransporte);
            });

          } else {
            console.log('📦 Abriendo modal de ENCOMIENDA');
            const dialogRef = this._dialog.open(BlockingModalComponent, {
              data: parsedData,
              disableClose: true,
            });

            dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
              parsedData.estado = result === 'accepted';
              this._wsSvc.sendResponse(parsedData as AdminRequest);
            });
          }
        } catch (error) {
          alert(`Error al parsear la notificación: ${error}`);
        }
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
