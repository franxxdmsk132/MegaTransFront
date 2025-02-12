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

  constructor(private tokenService: TokenService,
              private dialog: MatDialog,
              private router: Router,
              private detalleTransporteService: DetalleTransporteService,) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.nombreCompleto = this.tokenService.getFullName();
    } else {
      this.isLogged = false;
      this.nombreCompleto = '';
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
}
