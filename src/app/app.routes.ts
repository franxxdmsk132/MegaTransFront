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

export const routes: Routes = [
  {path: '', component: PrincipalComponent},
  {path: 'unidades', component: ListaUnidadComponent},
  { path: 'unidadesRegistar', component: UnidadesRegistroComponent },
  { path: 'unidadesActualizar/:id', component: UnidadesActualizarComponent },
  { path: 'crearDetalleTransporte', component: CrearDetalleTransporteComponent },

  {path: 'login', component: LoginComponent},
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
