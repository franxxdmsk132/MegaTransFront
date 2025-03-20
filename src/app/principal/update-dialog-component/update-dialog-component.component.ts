import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-update-dialog-component',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './update-dialog-component.component.html',
  standalone: true,
  styleUrl: './update-dialog-component.component.css'
})
export class UpdateDialogComponentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateDialogComponentComponent>
  ) {}

  closeDialog(shouldUpdate: boolean) {
    this.dialogRef.close(shouldUpdate);  // Devuelve 'true' o 'false' según la acción del usuario
  }
}
