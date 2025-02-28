import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { MenuComponent } from './menu/menu.component';
import {PrincipalComponent} from './principal/principal.component';
import { AppRoutes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {ListaUnidadComponent} from './unidades/lista/unidades.lista.component';
import {RegistroEmplComponent} from './auth/registroEmpl/registro.empl.component';
import {UnidadesRegistroComponent} from './unidades/registrar/unidades.registro.component';
import {UnidadesActualizarComponent} from './unidades/actualizar/unidades.actualizar.component';
import {DetalleTransporteListarComponent} from './DetalleTransporte/Lista/detalle-transporte-listar';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {CrearDetalleTransporteComponent} from './DetalleTransporte/Crear/detalle-transporte-crear.component';
import {BuscarCodigoComponent} from './principal/buscar-codigo/buscar-codigo.component';
import {DetalleTransporteComponent} from './DetalleTransporte/Detalle/detalle-transporte.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {AcercaComponent} from './acerca/acerca.component';
import {PerfilComponent} from './perfil/perfil.component';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CambiarPasswordComponent} from './perfil/cambiar-password/cambiar-password.component';
import {MatLabel} from '@angular/material/form-field';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {DetalleEncomiendaService} from './service/detalle-encomienda.service';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonToggle, MatButtonToggleModule} from '@angular/material/button-toggle';
import {ListarLotesComponent} from './lote/lista-lotes/lista-lotes.component';
import {CrearLotesComponent} from './lote/crear-lotes/crear-lotes.component';
import {DetalleLotesComponent} from './lote/detalle-lotes/detalle-lotes.component';
import {MatChipsModule} from '@angular/material/chips';
import {ListaRutasComponent} from './Rutas/lista-rutas/lista-rutas.component';
import {ActualizarRutasComponent} from './Rutas/actualizar-rutas/actualizar-rutas.component';
import {CrearRutasComponent} from './Rutas/crear-rutas/crear-rutas.component';

@NgModule({
  declarations: [  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutes,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LoginComponent,     // Componentes standalone aquí
    RegistroComponent,
    MenuComponent,
    PrincipalComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatLabel,
    ListaUnidadComponent,
    RegistroEmplComponent,
    UnidadesRegistroComponent,
    UnidadesActualizarComponent,
    ReactiveFormsModule,
    DetalleTransporteListarComponent,
    CrearDetalleTransporteComponent,
    MatSortModule,
    BuscarCodigoComponent,
    DetalleTransporteComponent,
    MatGridListModule,
    MatButtonModule,
    AcercaComponent,
    PerfilComponent,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSnackBarModule,
    CambiarPasswordComponent,
    ZXingScannerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatButtonToggle,
    ListarLotesComponent,
    DetalleLotesComponent,
    MatChipsModule,
    ListaRutasComponent,
    ActualizarRutasComponent,
    CrearRutasComponent

  ],
  providers: [],
})
export class AppModule {}
