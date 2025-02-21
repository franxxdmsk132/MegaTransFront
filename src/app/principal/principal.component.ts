import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { MenuComponent } from '../menu/menu.component';
import { NgIf } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialog} from '@angular/material/dialog';
import {DetalleTransporteService} from '../service/detalle-transporte.service';
import {BuscarCodigoComponent} from './buscar-codigo/buscar-codigo.component';
import {BuscarQrComponent} from './buscar-qr/buscar-qr.component';
import {DetalleEncomiendaService} from '../service/detalle-encomienda.service';
import {DetalleComponent} from '../Encomiendas/detalle/detalle.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    NgIf,
    RouterLink,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardModule,
    MatDividerModule
  ],
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  isLogged = false;
  nombreUsuario = '';
  nombreCompleto = '';
  nombreComercial = '';


  constructor(private tokenService: TokenService,
              private dialog: MatDialog,
              private router: Router,
              private detalleTransporteService: DetalleTransporteService,
              private detalleEncomiendaService: DetalleEncomiendaService) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.nombreCompleto = this.tokenService.getFullName();
      this.nombreComercial = this.tokenService.getNombreComercial();

    } else {
      this.isLogged = false;
      this.nombreCompleto = '';
      this.nombreComercial = '';  // Asegúrate de limpiar el valor en caso de no estar logueado

    }
  }
  openSearchDialog(): void {
    const dialogRef = this.dialog.open(BuscarCodigoComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes hacer la llamada a tu servicio para buscar el número de orden
        console.log('Número de orden:', result);
        // Llamar a tu servicio para buscar el Detalle de transporte por número de orden
        this.buscarPorNumOrden(result);
      }
    });
  }

  // Método para buscar el Detalle de transporte usando el servicio
  buscarPorNumOrden(numOrden: string): void {
    this.detalleTransporteService.buscarPorNumOrden(numOrden).subscribe(
      (response) => {
        // Maneja la respuesta del servidor aquí
        console.log('Detalles de transporte:', response);
        // Aquí puedes hacer lo que necesites con la respuesta, como mostrarla en el UI
      },
      (error) => {
        // Maneja errores si ocurren
        console.error('Error al buscar transporte:', error);
      }
    );
  }
  openQrScanner() {
    const dialogRef = this.dialog.open(BuscarQrComponent, {
      width: '400px',
      disableClose: true  // Evita que el usuario cierre accidentalmente el escáner
    });

    dialogRef.afterClosed().subscribe((qrCode) => {
      if (qrCode) {
        this.obtenerDetalleEncomienda(qrCode);
      }
    });
  }

  obtenerDetalleEncomienda(qrCode: string) {
    this.detalleEncomiendaService.obtenerDetalleEncomiendaPorNumGuia(qrCode).subscribe(
      (detalle) => {
        if (detalle && detalle.id) {  // Verificamos que el objeto tenga un id
          this.mostrarDetalleEncomienda(detalle.id);  // Solo pasamos el ID
        } else {
          console.warn('No se encontraron detalles para este código QR.');
          alert('No se encontraron detalles para este código QR.');
        }
      },
      (error) => {
        console.error('Error al obtener detalles de encomienda:', error);
        alert('Error al obtener detalles. Intenta nuevamente.');
      }
    );
  }

  mostrarDetalleEncomienda(id: number) {
    // Abrimos el dialogo y le pasamos el ID
    this.router.navigate(['/detalleEncomienda', id]);
  }


}
