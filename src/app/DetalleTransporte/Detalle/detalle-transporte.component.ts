import {Component, OnInit} from '@angular/core';
import {DetalleTransporte} from '../detalle-transporte';
import {DetalleTransporteService} from '../../service/detalle-transporte.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MenuComponent} from '../../menu/menu.component';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatList, MatListItem} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatLine} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {DatePipe, NgIf} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-Detalle',
  templateUrl: './detalle-transporte.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatGridList,
    MatGridTile,
    MatList,
    MatListItem,
    MatIcon,
    MatLine,
    MatCardActions,
    MatButton,
    MatCardSubtitle,
    NgIf,
    MatDivider,
    DatePipe,
    MatProgressSpinner

  ],
  styleUrl: './detalle-transporte.component.css'
})
export class DetalleTransporteComponent implements  OnInit{

  detalleTransporte: any = {};  // Inicialización con objeto vacío

  constructor(
    private detalleTransporteService: DetalleTransporteService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private snackBar:MatSnackBar
  ) {
  }


  isLoading = true;
  errorMessage: string | undefined;
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    console.log("ID recibido:", id); // Verifica si el ID es correcto

    if (!id) {
      this.snackBar.open('Error id no encontrado', 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'] // Clase CSS opcional para estilos
      });
      this.volver();
      return;
    }

    this.detalleTransporteService.obtenerDetallePorId(id).subscribe(
      data => {
        console.log("Detalle recibido en la vista:", data); // Verifica que se está asignando correctamente
        this.detalleTransporte = data;
        this.isLoading = false;  // Oculta el indicador de carga
      },
      error => {
        console.error("Error en la API:", error);
        this.errorMessage = 'Error al cargar la solicitud ';
        this.toastr.error(error.error?.message || 'Error desconocido', 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
        this.volver();
      }
    );
  }


  volver(): void {
    this.router.navigate(['listarDetalleTransporte/']);
  }
}
