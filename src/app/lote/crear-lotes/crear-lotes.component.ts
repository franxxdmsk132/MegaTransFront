import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoteService } from '../../service/lote-service';
import { Lote } from '../Lote';
import { MenuComponent } from '../../menu/menu.component';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-crear-lotes',
  templateUrl: './crear-lotes.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgIf,
    MatLabel,
    MatError,
    MatButton
  ],
  styleUrls: ['./crear-lotes.component.css']
})
export class CrearLotesComponent implements OnInit {
  loteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loteForm = this.fb.group({
      numLote: ['', Validators.required],
      fecha: [this.getCurrentDate(), Validators.required], // Establece la fecha actual como valor por defecto
      estado: ['', Validators.required],
      ruta: ['', Validators.required],
      unidad: ['', Validators.required],
      encomiendaIds: [[]], // Inicializa como un array vacío
      numerosGuia: [[]] // Inicializa como un array vacío
    });
  }

  ngOnInit(): void {}

  // Método para obtener la fecha actual en formato YYYY-MM-DD
  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Devuelve la fecha en formato 'YYYY-MM-DD'
  }

  // Método para crear el lote
  crearLote() {
    if (this.loteForm.valid) {
      const lote: Lote = this.loteForm.value;

      this.loteService.crearLote(lote).subscribe({
        next: (response) => {
          this.snackBar.open('Lote creado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/lotes']); // Redirige a la lista de lotes o la página que necesites
        },
        error: (err) => {
          console.error('Error al crear el lote', err);
          this.snackBar.open('Error al crear el lote', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      console.log('Formulario no válido', this.loteForm.errors);
      this.snackBar.open('Por favor, completa todos los campos', 'Cerrar', { duration: 3000 });
    }
  }
}
