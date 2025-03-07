import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {LoteService} from '../../../service/lote-service';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-estado-lote',
  templateUrl: './estado-lote.component.html',
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
  styleUrl: './estado-lote.component.css'
})
export class EstadoLoteComponent {
  nuevoEstado: string

  constructor(
    public dialogRef: MatDialogRef<EstadoLoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, estado: string },
    private loteService: LoteService
  ) {
    this.nuevoEstado = data.estado;
  }

  cambiarEstado(): void {
    this.loteService.actualizarEstadoLote2(this.data.id, this.nuevoEstado).subscribe({
      next: (response) => {
        console.log(response);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.log(error);
        this.dialogRef.close(false);
      }
    });
  }
  cancelar(): void {
    this.dialogRef.close(true);
  }

}
