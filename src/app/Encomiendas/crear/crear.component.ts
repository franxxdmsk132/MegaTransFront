import {Component, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TokenService} from '../../service/token.service';
import {DetalleEncomiendaService} from '../../service/detalle-encomienda.service';
import {MatButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    MatRadioButton,
    MatRadioGroup,
    NgIf,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatCardTitle,
    MatError,
    NgForOf
  ],
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit {

  detalleEncomienda: FormGroup;
  fragilChecked: boolean = false;
  currentDate: string

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private token: TokenService,
    private detalleEncomiendaService: DetalleEncomiendaService
  ) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.detalleEncomienda = this.fb.group({
      dirRemitente: ['', Validators.required],
      nombreD: ['', Validators.required],
      apellidoD: ['', Validators.required],
      identificacionD: ['', Validators.required],
      telfbeneficiario: ['', Validators.required],
      telfEncargado: ['', Validators.required],
      correoD: ['', Validators.required],
      referenciaD: ['', Validators.required],
      tipoEntrega: ['', Validators.required],
      ruta: ['', Validators.required],
      estado: ['RECOLECCION', Validators.required],
      fecha: [this.currentDate, Validators.required],
      productosDto: this.fb.array([this.createProducto()])  // Aquí cambiamos a FormArray
    });

  }

// Crear un nuevo grupo de formulario para un producto
  createProducto(): FormGroup {
    return this.fb.group({
      tipoProducto: ['', Validators.required],
      alto: ['', Validators.required],
      ancho: ['', Validators.required],
      largo: ['', Validators.required],
      peso: ['', Validators.required],
      fragil: [false]
    });
  }

  // Obtener el FormArray de productos
  get productos() {
    return (this.detalleEncomienda.get('productosDto') as FormArray);
  }

  // Agregar un nuevo producto
  addProducto() {
    this.productos.push(this.createProducto());
  }

  // Eliminar un producto
  removeProducto(index: number) {
    this.productos.removeAt(index);
  }

  onSubmit(): void {
    if (this.detalleEncomienda.valid) {
      console.log('Datos a enviar:', this.detalleEncomienda.value);
      this.detalleEncomiendaService.crearDetalleEncomienda(this.detalleEncomienda.value).subscribe({
        next: (response) => {
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Error al crear el Detalle de transporte', err);
        }
      });
    }
  }

  ngOnInit(): void {
  }

}
