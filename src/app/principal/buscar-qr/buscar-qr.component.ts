import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ZXingScannerModule} from '@zxing/ngx-scanner';

@Component({
  selector: 'app-buscar-qr',
  templateUrl: './buscar-qr.component.html',
  standalone: true,
  imports: [
    ZXingScannerModule
  ],
  styleUrl: './buscar-qr.component.css'
})
export class BuscarQrComponent {

  id!:number ;
  constructor(public dialogRef: MatDialogRef<BuscarQrComponent>) {}

  onCodeScanned(event: string) {
    this.dialogRef.close(event); // Cierra el diálogo y envía el código escaneado
  }
}
