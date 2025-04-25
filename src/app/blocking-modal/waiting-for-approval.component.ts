import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-waiting-for-approval',
  imports: [MatDialogModule, MatProgressSpinner],
  template: `
    <h2 mat-dialog-title>Esperando aprobación...</h2>
    <mat-dialog-content>
      <p>Estamos esperando la respuesta del administrador.</p>
      <mat-progress-spinner
        mode="indeterminate"
        diameter="40"
      ></mat-progress-spinner>
    </mat-dialog-content>
  `,
})
export class WaitingForApprovalComponent {}
