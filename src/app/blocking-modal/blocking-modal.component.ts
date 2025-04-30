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
        solicitud de encomienda.
      </p>
      <p>🔢#Guia: {{ data.numGuia }}</p>
      <p>📅Fecha: {{ data.fechaCreacion | date : 'medium' }}</p>
      <p>🛣️Ruta: {{ data.ruta }}</p>
      <p>📍Origen:
        <a href="https://www.google.com/maps?q={{data.latitudOrg}},{{data.longitudOrg}}" target="_blank">
          Ver en mapa
        </a>
      </p>
      <p>📍Destino:
        <a href="https://www.google.com/maps?q={{data.latitudDestino}},{{data.longitudDestino}}" target="_blank">
          Ver en mapa
        </a>
      </p>
      <p>
        📞Teléfono:
        <a [href]="'https://wa.me/593' + data.telf.slice(1)" target="_blank">
          {{ data.telf }}
        </a>
      </p>


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
