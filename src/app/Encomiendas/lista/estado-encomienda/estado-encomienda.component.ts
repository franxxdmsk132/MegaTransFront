import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {DetalleTransporteService} from '../../../service/detalle-transporte.service';
import {DetalleEncomiendaService} from '../../../service/detalle-encomienda.service';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-estado-encomienda',
  templateUrl: './estado-encomienda.component.html',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect
  ],
  styleUrl: './estado-encomienda.component.css'
})
export class EstadoEncomiendaComponent {

  nuevoEstado: string;

  constructor(
    public dialogRef: MatDialogRef<EstadoEncomiendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, estado: string },
    private detalleEncomiendaService: DetalleEncomiendaService
  ) {
    this.nuevoEstado = data.estado;  // Establecer el estado actual
  }

  cambiarEstado(): void {
    this.detalleEncomiendaService.actualizarEstado(this.data.id, this.nuevoEstado).subscribe({
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
