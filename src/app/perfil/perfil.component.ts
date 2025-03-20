import {Component, OnInit} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';
import {JwtDTO} from '../Seguridad/models/jwt-dto';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {TokenService} from '../service/token.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatButton} from '@angular/material/button';
import {ActualizarPerfilComponent} from './actualizar-perfil/actualizar-perfil.component';
import {MatDialog} from '@angular/material/dialog';
import {CambiarPasswordComponent} from './cambiar-password/cambiar-password.component';
import {MatLabel} from '@angular/material/form-field';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatProgressSpinner,
    NgIf,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatDivider,
    MatCardActions,
    MatButton,
    MatCardSubtitle,
    MatCardTitle
  ],
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  userProfile: JwtDTO | undefined;
  loading: boolean = true;
  errorMessage: string | undefined;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const username = this.tokenService.getUserName();
    if (username) {
      this.authService.getUserProfile(username).subscribe(
        (data) => {
          this.userProfile = data;
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Error al cargar el perfil';
          this.loading = false;
        }
      );
    } else {
      this.errorMessage = 'No se pudo obtener el nombre de usuario';
      this.loading = false;
    }
  }
  abrirDialogoActualizar(usuario:any): void {
    const dialogRef = this.dialog.open(ActualizarPerfilComponent, {
      data:usuario,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.ngOnInit(); // Recargar perfil tras actualización
      }
    });
  }

  abrirDialogoPassword(): void {
    const dialogRef = this.dialog.open(CambiarPasswordComponent, {
      width: '400px',
      data: { username: this.userProfile?.nombreUsuario }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      // if (resultado) {
      //   alert("Contraseña actualizada correctamente");
      // }
    });
  }
}
