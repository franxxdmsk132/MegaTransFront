import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-waiting-for-approval',
  imports: [MatDialogModule, MatProgressSpinner],
  template: `
    <h2 mat-dialog-title>¡Estamos trabajando para usted!</h2>
    <mat-dialog-content class="text-center">
      <p>Estamos procesando su solicitud.</p>
      <p>Un administrador la revisará y en breve recibirá una respuesta.</p>
      <p>¡Gracias por confiar en nosotros!</p>
      <div style="margin-top: 20px;">
        <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
      </div>
    </mat-dialog-content>

  `,
})
export class WaitingForApprovalComponent {}
