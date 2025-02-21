import {Component, Inject} from '@angular/core';
import {DetalleTransporteService} from '../../../service/detalle-transporte.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-estado-dialog',
  templateUrl: './estado-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatLabel
  ],
  styleUrl: './estado-dialog.component.css'
})
export class EstadoDialogComponent {

  nuevoEstado: string;

  constructor(
    public dialogRef: MatDialogRef<EstadoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, estado: string },
    private detalleTransporteService: DetalleTransporteService
  ) {
    this.nuevoEstado = data.estado;  // Establecer el estado actual
  }

  cambiarEstado(): void {
    this.detalleTransporteService.actualizarEstado(this.data.id, this.nuevoEstado).subscribe({
      next: (response) => {
        console.log(response);
        this.dialogRef.close(true); // Cerrar el dialog con éxito
      },
      error: (error) => {
        console.error(error);
        this.dialogRef.close(false); // Cerrar el dialog con error
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(); // Cerrar el dialog sin hacer cambios
  }
}
