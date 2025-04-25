import { inject, Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminRequest, WebsocketService } from './websocket.service';
import { BlockingModalComponent } from '../blocking-modal/blocking-modal.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationUserRequestService implements OnDestroy {
  private sub: Subscription | undefined;
  private readonly dialog = inject(MatDialog);
  private readonly _wsSvc = inject(WebsocketService);

  constructor() {
    this.initListen();
  }

  private initListen(): void {
    this.sub = this._wsSvc.message$.subscribe((message) => {
      this.mostrarModal(message);
    });
  }

  private mostrarModal(message: AdminRequest): void {
    const dialogRef = this.dialog.open(BlockingModalComponent, {
      data: message,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
      message.estado = result === 'accepted';
      this._wsSvc.sendResponse(message);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
