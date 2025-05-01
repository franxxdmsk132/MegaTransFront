import {Component, OnInit} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from '../service/token.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
  ],
  styleUrl: './soporte.component.css'
})
export class SoporteComponent implements OnInit {

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'  // Agregar este encabezado en cada solicitud
    });
  }
  soporteForm: FormGroup;
  usuarioEnSesion = {nombre: 'Franklin Tapia', email: 'tapiafranklin666@gmail.com'}; // Simulación

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private tokenService: TokenService,
              private snackBar: MatSnackBar,){
    this.soporteForm = this.fb.group({
      tema: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
  }

  enviarSoporte() {
    if (this.soporteForm.valid) {
      const datosSoporte = {
        nombreUsuario: this.tokenService.getFullName(),
        emailUsuario: this.tokenService.getUserName(),
        tema: this.soporteForm.value.tema,
        descripcion: this.soporteForm.value.descripcion
      };

      this.http.post(
        environment.apiUrl +'/soporte',
        datosSoporte,
        {
          headers: this.getAuthHeaders(),
          responseType: 'text'  // 👈 MUY IMPORTANTE
        }
      ).subscribe({
        next: (response) => {
          this.snackBar.open('✅ Solicitud enviada con éxito. ¡Gracias por contactarnos!', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.soporteForm.reset();
        },
        error: (error) => {
          this.snackBar.open('❌ Error al enviar la solicitud. Inténtalo más tarde.', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          console.error(error);
        }
      });


      }
    }

  }
