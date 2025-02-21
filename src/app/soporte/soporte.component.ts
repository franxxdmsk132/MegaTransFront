import {Component, OnInit} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';

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
  soporteForm: FormGroup;
  usuarioEnSesion = { nombre: 'Franklin Tapia', email: 'franklin@example.com' }; // Simulación

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.soporteForm = this.fb.group({
      tema: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  enviarSoporte() {
    // if (this.soporteForm.valid) {
    //   const datosSoporte = {
    //     nombreUsuario: this.usuarioEnSesion.nombre,
    //     emailUsuario: this.usuarioEnSesion.email,
    //     tema: this.soporteForm.value.tema,
    //     descripcion: this.soporteForm.value.descripcion
    //   };
    //
    //   this.http.post('https://tu-backend.com/api/enviar-soporte', datosSoporte)
    //     .subscribe(response => {
    //       console.log('Soporte enviado:', response);
    //       alert('¡Solicitud enviada con éxito!');
    //       this.soporteForm.reset();
    //     }, error => {
    //       console.error('Error enviando soporte', error);
    //       alert('Error al enviar la solicitud.');
    //     });
    // }
  }
}
