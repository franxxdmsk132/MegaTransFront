import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LoginUsuario} from '../../models/login-usuario';
import {TokenService} from '../../service/token.service';
import {AuthService} from '../../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {MenuComponent} from '../../menu/menu.component';
import {NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    MenuComponent,
    RouterLink,
    NgIf,
    MatCard,
    MatCardHeader,
    MatTabGroup,
    MatTab,
    MatAnchor,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatError,
    MatCardContent
  ],
  standalone: true
})
export class LoginComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  loginUsuario!: LoginUsuario;
  nombreUsuario: string ="";
  password: string ="";
  roles: string[] = [];
  errMsj: string ="";

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        this.isLogged = true;

        this.tokenService.setToken(data.token ?? '');
        this.tokenService.setUserName(data.nombreUsuario ?? '');
        this.tokenService.setFullName(data.nombre ?? '', data.apellido ?? ''); // Guardar nombre completo
        this.tokenService.setIdentificacion(data.identificacion ?? '');
        this.tokenService.setTelefono(data.telefono ?? '');
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        this.toastr.success('Bienvenido ' + data.nombreUsuario, 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/']);
      },
      err => {
        this.isLogged = false;
        this.errMsj = err.error.message;
        this.toastr.error(this.errMsj, 'Fail', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        // console.log(err.error.message);
      }
    );
  }

}
