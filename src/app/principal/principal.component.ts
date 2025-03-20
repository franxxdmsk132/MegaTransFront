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
import {AuthService} from '../service/auth.service';
import {VersionService} from '../service/version-service';
import {UpdateDialogComponentComponent} from './update-dialog-component/update-dialog-component.component';

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
    MatCardContent,
    MatCardModule,
    MatDividerModule
  ],
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  currentVersion: string = '1.0.0' ; // Versión actual de la app (configura esto dinámicamente si es necesario)
  isLogged = false;
  isAdmin =false;
  nombreUsuario = '';
  nombreCompleto = '';
  nombreComercial = '';
  usuarioCount = 0;


  constructor(private tokenService: TokenService,
              private dialog: MatDialog,
              private router: Router,
              private detalleTransporteService: DetalleTransporteService,
              private detalleEncomiendaService: DetalleEncomiendaService,
              private authService: AuthService,
              private versionService: VersionService,) { }

  ngOnInit(): void {
    this.checkAppVersion(); // Verificamos la versión al iniciar
    this.authService.getCountUsuarios().subscribe(
      countUsuarios => {
        this.usuarioCount = countUsuarios;
      },
      error => {
        console.log(error,"Error al Obtener el conteo de usuarios");
      }
    )
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.nombreCompleto = this.tokenService.getFullName();
      this.nombreComercial = this.tokenService.getNombreComercial();

    } else {
      this.isLogged = false;
      this.nombreCompleto = '';
      this.nombreComercial = '';  // Asegúrate de limpiar el valor en caso de no estar logueado

    }
    this.isAdmin = this.isLogged && this.tokenService.isAdmin();
  }

  // Método para verificar la versión de la aplicación
  checkAppVersion(): void {
    this.versionService.getVersion().subscribe(
      async (response: any) => {
        const serverVersion = response.version; // Accede a la propiedad 'version'
        if (serverVersion !== this.currentVersion) {
          const dialogRef = await this.dialog.open(UpdateDialogComponentComponent, {
            width: '300px',
            data: { message: 'Tu aplicación está desactualizada. Por favor, actualiza a la última versión.' }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              // Si el usuario acepta, redirige a la tienda de aplicaciones
              window.open('https://camionesmegatrans.com/', '_system');
            }
          });
        }
      },
      error => {
        console.error('Error al verificar la versión:', error);
      }
    );
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
