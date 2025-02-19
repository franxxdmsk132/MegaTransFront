import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NuevoUsuario} from '../../models/nuevo-usuario';
import {TokenService} from '../../service/token.service';
import {AuthService} from '../../service/auth.service';
import {identifierName} from '@angular/compiler';
import {MenuComponent} from '../../menu/menu.component';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    MatLabel,
    MatError
  ],
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  // nuevoUsuario: NuevoUsuario;
  nombre: string = "";
  apellido: string = "";
  telefono: string = "";
  nombreComercial: string = "";
  nombreUsuario: string = "";
  identificacion: string = "";
  password: string = "";
  errMsj: string = "";
  isLogged = false;
  registroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    }
  }


  onRegister(): void {
    if (!this.nombreUsuario || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.nombreUsuario)) {
      this.snackBar.open('Ingrese un correo válido.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'] // Clase CSS opcional para estilos
      });
      return;
    }
    // // Validación de identificación (solo números y 10 dígitos)
    // if (!/^\d{13}$/.test(this.identificacion)) {
    //   this.snackBar.open('La identificación debe tener exactamente 10 números.', 'Cerrar', {
    //     duration: 3000,
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //     panelClass: ['error-snackbar']
    //   });
    //   return;
    // }

    // Validación de teléfono (solo números y 10 dígitos)
    if (!/^\d{10}$/.test(this.telefono)) {
      this.snackBar.open('El teléfono debe tener exactamente 10 números.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }


    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido', this.apellido);
    formData.append('identificacion', this.identificacion);
    formData.append('telefono', this.telefono);
    formData.append('nombreComercial', this.nombreComercial);
    formData.append('nombreUsuario', this.nombreUsuario);
    formData.append('password', this.password);


    this.authService.nuevo(formData).subscribe(
      (data: any) => {
        this.snackBar.open('Cuenta Creada', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'] // Clase CSS opcional para estilos
        });
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.errMsj = err.error.mensaje;
        this.snackBar.open(this.errMsj, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  protected readonly identifierName = identifierName;
  protected readonly onformdata = onformdata;
}
