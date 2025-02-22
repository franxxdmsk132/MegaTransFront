import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LoginUsuario} from '../../models/login-usuario';
import {TokenService} from '../../service/token.service';
import {AuthService} from '../../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {MenuComponent} from '../../menu/menu.component';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {Mensaje} from '../../models/mensaje';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIcon, MatIconModule} from '@angular/material/icon';

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
    MatCardContent,
    NgClass,
    NgOptimizedImage,
    MatIconButton,
    MatIcon,
    MatIconModule,
    MatSuffix
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
  hidePassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
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
        this.tokenService.setFullName(data.nombre ?? '', data.apellido ?? '');
        this.tokenService.setIdentificacion(data.identificacion ?? '');
        this.tokenService.setTelefono(data.telefono ?? '');
        this.tokenService.setNombreComercial(data.nombreComercial ?? '');
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;

        // Mostrar un mensaje de éxito con toastr
        this.snackBar.open('Login exitoso', 'Cerrar', {
          duration: 3000, // Duración del snackbar (en milisegundos)
          horizontalPosition: 'center', // Posición horizontal (puedes usar 'start', 'center', 'end')
          verticalPosition: 'top', // Posición vertical (puedes usar 'top' o 'bottom')
          panelClass: ['snack-success'] // Clase personalizada para darle estilo al snackbar
        });


        this.router.navigate(['/']);
      },
      err => {
        this.isLogged = false;

        // Mostrar el mensaje de error desde el backend
        const errorMessage = err.error.mensaje || 'Error desconocido';

        // Mostrar el mensaje de error
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-error'] // Clase personalizada para el error
        });

      }
    );
  }


}
