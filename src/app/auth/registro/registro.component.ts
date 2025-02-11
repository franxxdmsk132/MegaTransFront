import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {NuevoUsuario} from '../../models/nuevo-usuario';
import {TokenService} from '../../service/token.service';
import {AuthService} from '../../service/auth.service';
import {identifierName} from '@angular/compiler';
import {MenuComponent} from '../../menu/menu.component';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule,
    RouterLink,
    NgIf,
    MatCard,
    MatCardHeader,
    MatTabGroup,
    MatTab,
    MatAnchor,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    MatLabel
  ],
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  // nuevoUsuario: NuevoUsuario;
  nombre: string = "";
  apellido: string = "";
  telefono: string = "";
  nombreUsuario: string = "";
  identificacion: string = "";
  password: string = "";
  errMsj: string ="";
  isLogged = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    }
  }


  onRegister(): void {
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido', this.apellido);
    formData.append('identificacion', this.identificacion);
    formData.append('telefono', this.telefono);
    formData.append('nombreUsuario', this.nombreUsuario);
    formData.append('password', this.password);


    this.authService.nuevo(formData).subscribe(
      (data: any) => { // O mejor, usa una interfaz específica en lugar de "any"
        this.toastr.success('Cuenta Creada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.errMsj = err.error.mensaje;
        this.toastr.error(this.errMsj, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  protected readonly identifierName = identifierName;
}
