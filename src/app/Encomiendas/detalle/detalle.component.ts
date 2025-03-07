import {Component, Inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {DetalleEncomiendaService} from '../../service/detalle-encomienda.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatFabButton} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-detalle',
  imports: [
    MenuComponent,
    DatePipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatDivider,
    MatProgressSpinner,
    NgIf,
    NgForOf
  ],
  templateUrl: './detalle.component.html',
  standalone: true,
  styleUrl: './detalle.component.css'
})
export class DetalleComponent implements OnInit {

  detalleEncomienda: any = {};
  isLoading = true;
  errorMessage: string | undefined;

  constructor(
    private detalleEncomiendaService: DetalleEncomiendaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar){}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    console.log("ID recibido:", id);

    if (!id) {
      this.snackBar.open('Error id no encontrado', 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      this.volver();
      return;
    }
    this.detalleEncomiendaService.obtenerDetalleEncomienda(id).subscribe(
      data =>{
        console.log("Detalle recibido en la vista:", data);
        this.detalleEncomienda = data;
        this.isLoading = false;
      },
      error => {
        console.error("Error en la API:", error);
        this.errorMessage = 'Error al cargar la solicitud ';
        this.snackBar.open('Error al cargar la solicitud ' , 'OK',{
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.volver()
      }
    );

  }
  volver(): void {
    this.router.navigate(['listaEncomienda/']);
  }
}
