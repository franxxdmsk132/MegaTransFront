import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationUserRequestService } from './service/notification-user-request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MegaTrans';
  private readonly _notificationSvc: NotificationUserRequestService = inject(NotificationUserRequestService);

  constructor() {}
  // constructor() {}
  //
  // async ngOnInit() {
  //   // Solicitar permisos de notificaciones
  //   let permStatus = await PushNotifications.requestPermissions();
  //
  //   if (permStatus.receive === 'granted') {
  //     // Registrar el dispositivo para recibir notificaciones
  //     await PushNotifications.register();
  //   }
  //
  //   // Escuchar cuando se recibe una notificación
  //   PushNotifications.addListener('pushNotificationReceived', (notification) => {
  //     console.log('Notificación recibida:', notification);
  //     alert(`Nueva notificación: ${notification.title}`);
  //   });
  //
  //   // Escuchar cuando se toca una notificación
  //   PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
  //     console.log('Notificación interactuada:', notification);
  //   });
  //
  //   // Obtener el token de notificación
  //   PushNotifications.addListener('registration', (token) => {
  //     console.log('Token de notificación:', token.value);
  //   });
  // }
}
