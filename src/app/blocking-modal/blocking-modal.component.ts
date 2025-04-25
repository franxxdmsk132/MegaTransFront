import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NotificationUserRequestService } from '../service/notification-user-request.service';
import { AdminRequest } from '../service/websocket.service';

@Component({
  selector: 'app-blocking-modal',
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Solicitud de usuario</h2>
    <mat-dialog-content>
      <p>
        El usuario <strong>{{ data.username }}</strong> ha enviado una
        solicitud.
      </p>
      <p>Fecha: {{ data.fechaCreacion | date : 'medium' }}</p>
      <p>¿Desea aprobar esta solicitud?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onDeny()">Denegar</button>
      <button mat-button color="primary" (click)="onAccept()">Aprobar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        min-width: 300px;
      }
    `,
  ],
})
export class BlockingModalComponent {
  public data: AdminRequest = inject(MAT_DIALOG_DATA);
  constructor(public dialogRef: MatDialogRef<BlockingModalComponent>) {}

  onAccept(): void {
    this.dialogRef.close('accepted');
  }

  onDeny(): void {
    this.dialogRef.close('denied');
  }
}
