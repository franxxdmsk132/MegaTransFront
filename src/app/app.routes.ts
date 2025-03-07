import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PrincipalComponent} from './principal/principal.component';
import {LoginComponent} from './auth/login/login.component';
import {RegistroComponent} from './auth/registro/registro.component';
import {ListaUnidadComponent} from './unidades/lista/unidades.lista.component';
import {RegistroEmplComponent} from './auth/registroEmpl/registro.empl.component';
import {UnidadesRegistroComponent} from './unidades/registrar/unidades.registro.component';
import {UnidadesActualizarComponent} from './unidades/actualizar/unidades.actualizar.component';
import {CrearDetalleTransporteComponent} from './DetalleTransporte/Crear/detalle-transporte-crear.component';
import {DetalleTransporteListarComponent} from './DetalleTransporte/Lista/detalle-transporte-listar';
import {DetalleTransporteComponent} from './DetalleTransporte/Detalle/detalle-transporte.component';
import {AcercaComponent} from './acerca/acerca.component';
import {PerfilComponent} from './perfil/perfil.component';
import {DetalleComponent} from './Encomiendas/detalle/detalle.component';
import {SoporteComponent} from './soporte/soporte.component';
import {ListaComponent} from './Encomiendas/lista/lista.component';
import {CrearComponent} from './Encomiendas/crear/crear.component';
import {ListarLotesComponent} from './lote/lista-lotes/lista-lotes.component';
import {DetalleLotesComponent} from './lote/detalle-lotes/detalle-lotes.component';
import {CrearLotesComponent} from './lote/crear-lotes/crear-lotes.component';
import {ListaRutasComponent} from './Rutas/lista-rutas/lista-rutas.component';
import {ActualizarRutasComponent} from './Rutas/actualizar-rutas/actualizar-rutas.component';
import {CrearRutasComponent} from './Rutas/crear-rutas/crear-rutas.component';
import {ActualizarLotesComponent} from './lote/actualizar-lotes/actualizar-lotes.component';

export const routes: Routes = [
  {path: '', component: PrincipalComponent},
  {path: 'unidades', component: ListaUnidadComponent},
  {path: 'unidadesRegistar', component: UnidadesRegistroComponent},
  {path: 'unidadesActualizar/:id', component: UnidadesActualizarComponent},
  {path: 'crearDetalleTransporte', component: CrearDetalleTransporteComponent},
  {path: 'listarDetalleTransporte', component: DetalleTransporteListarComponent},
  {path: 'detalleTransporte/:id', component: DetalleTransporteComponent},
  {path: 'detalleEncomienda/:id', component: DetalleComponent},
  {path: 'listaEncomienda', component: ListaComponent},
  {path: 'crearEncomienda', component: CrearComponent},
  {path: 'login', component: LoginComponent},
  {path: 'lotes', component: ListarLotesComponent},
  {path: 'rutas', component: ListaRutasComponent},
  {path: 'actualizar-ruta/:id', component: ActualizarRutasComponent},
  {path: 'crear-ruta', component: CrearRutasComponent},

  {path: 'crearLote', component: CrearLotesComponent},
  {path: 'detalleLotes/:id', component: DetalleLotesComponent},
  {path: 'actualizarLotes/:id', component: ActualizarLotesComponent},
  {path: 'soporte', component: SoporteComponent},
  {path: 'acercaDe', component: AcercaComponent},
  {path: 'perfil', component: PerfilComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'registroEmpleado', component: RegistroEmplComponent},
  // {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutes {
}
