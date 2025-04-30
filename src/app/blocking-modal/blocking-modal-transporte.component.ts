import {AdminRequestTransporte} from '../service/websocket.service';
import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-blocking-modal-transporte',
  template: `
    <h2 mat-dialog-title>Solicitud de usuario</h2>
    <mat-dialog-content>
      <p>
        El usuario <strong>{{ data.username }}</strong> ha enviado una
        solicitud de encomienda.
      </p>
      <p>🔢#Guia: {{ data.numOrden }}</p>
      <p>📅Fecha: {{ data.fechaCreacion | date : 'medium' }}</p>
      <p>🛣Servicio: {{ data.tipoServicio }}</p>
      <p>🚚Tipo Unidad: {{data.tipo_unidad}} </p>
      <p>👥Personal: {{data.cantidad_estibaje}} </p>

      <p>📍Origen:
        <a href="https://www.google.com/maps?q={{data.latitudO}},{{data.longitudO}}" target="_blank">
          Ver en mapa
        </a>
      </p>
      <p>📍Destino:
        <a href="https://www.google.com/maps?q={{data.latitudD}},{{data.longitudD}}" target="_blank">
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
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
  ]
})
export class BlockingModalTransporteComponent {
  public data: AdminRequestTransporte=inject(MAT_DIALOG_DATA);
  constructor(public dialogRef : MatDialogRef<BlockingModalTransporteComponent>){}

  onAccept(){
    this.dialogRef.close('accepted');
  }
  onDeny(){
    this.dialogRef.close('denied');
  }
}
