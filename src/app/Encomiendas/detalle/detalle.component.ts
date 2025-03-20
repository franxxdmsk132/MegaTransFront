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
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {DetalleEncomienda} from '../detalle-encomienda';
import {EstadoEncomiendaComponent} from '../lista/estado-encomienda/estado-encomienda.component';
import {MatTableDataSource} from '@angular/material/table';
import {TokenService} from '../../service/token.service';

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
  qrCodeUrl: string | null = null; // Variable para almacenar la URL del QR
  isLogged = false;
  isAdmin = false;
  isEmpl = false;
  detalleEncomienda: any = {};
  isLoading = true;
  errorMessage: string | undefined;
  dataSource = new MatTableDataSource<DetalleEncomienda>();

  constructor(
    private detalleEncomiendaService: DetalleEncomiendaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog : MatDialog,
    private tokenService : TokenService,){}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.isAdmin = this.isLogged && this.tokenService.isAdmin();
    this.isEmpl = this.isLogged && this.tokenService.isEmpl();
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
        // Cargar QR si existe
        if (this.detalleEncomienda.qrCodePath) {
          this.detalleEncomiendaService.getImage(this.detalleEncomienda.qrCodePath).subscribe(
            blob => {
              this.detalleEncomienda.qrCodePath = URL.createObjectURL(blob);
            },
            error => {
              console.error("Error al cargar el QR:", error);
              this.detalleEncomienda.qrCodePath = null; // O una imagen por defecto
            }
          );
        }
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
  // Método para abrir el dialog de cambio de estado
  abrirDialogoEstado(detalle: DetalleEncomienda): void {
    const dialogRef = this.dialog.open(EstadoEncomiendaComponent, {
      width: '300px',
      data: { id: detalle.id, estado: detalle.estado } // Enviar el ID y el estado actual
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar el estado en la lista si se ha cambiado con éxito
        const index = this.dataSource.data.findIndex(d => d.id === detalle.id);
        if (index !== -1) {
          this.dataSource.data[index].estado = detalle.estado;
        }
      }
      this.volver()
    });
  }
}
