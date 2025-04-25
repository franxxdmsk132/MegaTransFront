import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationUserRequestService } from './service/notification-user-request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'MegaTrans';
  private readonly _notificationSvc: NotificationUserRequestService = inject(NotificationUserRequestService);

  constructor() {}
}
