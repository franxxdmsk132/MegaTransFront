import {Component, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';
import {MatButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {LoteService} from '../../service/lote-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-detalle-lotes',
  templateUrl: './detalle-lotes.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatDivider,
    MatCardTitle,
    MatChipsModule,
    MatCardActions,
    MatButton,
    NgForOf,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
  ],
  styleUrl: './detalle-lotes.component.css'
})
export class DetalleLotesComponent implements OnInit {
  lote: any = {}; // Aquí podrías tiparlo mejor con `Lote`
  isLoading = true;
  errorMessage: string | undefined;
  displayedColumns: string[] = ['numLote', 'fecha', 'estado', 'ruta', 'unidad'];

  constructor(
    private router: Router,
    private loteService: LoteService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    if (!id) {
      this.mostrarMensaje('Error: ID no encontrado', 'error-snackbar');
      this.volver();
      return;
    }

    this.loteService.obtenerLotePorId(id).subscribe({
      next: (data) => {
        if (!data) {
          this.mostrarMensaje('Lote no encontrado', 'error-snackbar');
          this.volver();
        } else {
          this.lote = data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error en la API:", error);
        this.errorMessage = 'Error al cargar la solicitud';
        this.isLoading = false;
        this.mostrarMensaje(this.errorMessage, 'error-snackbar');
      }
    });
  }

  volver(): void {
    this.router.navigate(['lotes/']);
  }

  mostrarMensaje(mensaje: string, clase: string) {
    this.snackBar.open(mensaje, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [clase]
    });
  }
}
