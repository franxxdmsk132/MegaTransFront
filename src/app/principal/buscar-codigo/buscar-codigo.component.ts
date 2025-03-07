import {Component} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {DetalleTransporteService} from '../../service/detalle-transporte.service';
import {catchError, of} from 'rxjs';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-buscar-codigo',
  templateUrl: './buscar-codigo.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatError,
    NgIf,
    MatSelect,
    MatOption
  ],
  styleUrl: './buscar-codigo.component.css'
})
export class BuscarCodigoComponent {

  numOrden: string = '';
  errorMessage = ''
  transporteDetalle: any = null;  // Para almacenar los detalles del transporte encontrado
  nuevoEstado: string = '';

  constructor(public dialogRef: MatDialogRef<BuscarCodigoComponent>,
              private detalleTransporteService: DetalleTransporteService,
              private snackBar: MatSnackBar) {
  }

  // Método para cerrar el diálogo
  closeDialog(): void {
    this.dialogRef.close();
  }

  // Método para enviar el número de orden al componente principal
  sendNumOrden(): void {
    this.dialogRef.close(this.numOrden);
  }

  // Método para realizar la búsqueda cuando el usuario presiona el botón de buscar
  buscar(): void {
    if (!this.numOrden) {
      this.errorMessage = 'Por favor ingrese un número de orden.';
      this.transporteDetalle = null;
    } else {
      this.errorMessage = '';  // Limpia el mensaje de error
      this.detalleTransporteService.buscarPorNumOrden(this.numOrden).pipe(
        catchError((error) => {
          // Manejo de error si la petición falla
          this.errorMessage = 'No se encontró el número de orden.';
          this.transporteDetalle = null;
          return of(null); // Retorna un observable vacío para evitar errores
        })
      ).subscribe(
        (response) => {
          if (response && response.detalle) {
            // Si la respuesta es válida, asignamos los detalles del transporte
            this.transporteDetalle = response.detalle;
          } else {
            // Si no se obtiene Detalle, mostramos el mensaje de error
            this.errorMessage = 'No se encontró el número de orden. Código Incorrecto';
            this.transporteDetalle = null;
          }
        }
      );
    }
  }

  // Método para actualizar el estado del transporte
  actualizarEstado(): void {
    if (this.transporteDetalle && this.nuevoEstado) {
      this.detalleTransporteService.actualizarEstado(this.transporteDetalle.id, this.nuevoEstado).subscribe(
        (response) => {
          if (response) {
            // Actualiza el estado localmente si la actualización fue exitosa
            this.transporteDetalle.estado = this.nuevoEstado;

            // Mostrar mensaje de éxito usando SnackBar
            this.snackBar.open('Estado actualizado con éxito', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });

            // Cerrar el diálogo
            this.dialogRef.close();
          }
        }
      );
    }
  }


}
