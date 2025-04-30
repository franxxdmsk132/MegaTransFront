import { inject, Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminRequest,AdminRequestTransporte, WebsocketService } from './websocket.service';
import { BlockingModalComponent } from '../blocking-modal/blocking-modal.component';
import {BlockingModalTransporteComponent} from '../blocking-modal/blocking-modal-transporte.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationUserRequestService implements OnDestroy {
  private sub: Subscription | undefined;
  private subEncomienda: Subscription | undefined;
  private subTransporte: Subscription | undefined;

  private readonly dialog = inject(MatDialog);
  private readonly _wsSvc = inject(WebsocketService);

  constructor() {
    this.initListen();
  }

  private initListen(): void {
    this.subEncomienda = this._wsSvc.message$.subscribe((message) => {
      this.mostrarModalEncomienda(message);
    });

    this.subTransporte = this._wsSvc.transporteMessage$.subscribe((message) => {
      this.mostrarModalTransporte(message);
    });
  }


  private mostrarModalEncomienda(message: AdminRequest): void {
    const dialogRef = this.dialog.open(BlockingModalComponent, {
      data: message,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
      message.estado = result === 'accepted';
      this._wsSvc.sendResponse(message);
    });
  }
  private mostrarModalTransporte(message: AdminRequestTransporte): void {
    const dialogRef = this.dialog.open(BlockingModalTransporteComponent, {
      data: message,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: 'accepted' | 'denied') => {
      message.estado = result === 'accepted';
      this._wsSvc.sendTransporteResponse(message);
    });
  }



  ngOnDestroy(): void {
    this.subEncomienda?.unsubscribe();
    this.subTransporte?.unsubscribe();
  }

}
