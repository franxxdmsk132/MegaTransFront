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
  selector: 'app-eliminar-dialog-rutas',
  templateUrl: './eliminar-dialog-rutas.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  styleUrl: './eliminar-dialog-rutas.component.css'
})
export class EliminarDialogRutasComponent {

  constructor(
    public dialogRef: MatDialogRef<EliminarDialogRutasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true); // Si se confirma, cerramos el diálogo y pasamos true
  }

  onCancel(): void {
    this.dialogRef.close(false); // Si se cancela, cerramos el diálogo y pasamos false
  }
}
