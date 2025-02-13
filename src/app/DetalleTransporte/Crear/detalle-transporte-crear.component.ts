import {C} from '@angular/cdk/keycodes';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DetalleTransporteService} from '../../service/detalle-transporte.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MenuComponent} from '../../menu/menu.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-Detalle-transporte-crear',
  templateUrl: './detalle-transporte-crear.component.html',
  styleUrls: ['./detalle-transporte-crear.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MenuComponent,
    MatRadioGroup,
    MatRadioButton,
    MatCheckbox
  ],
  standalone: true
})
export class CrearDetalleTransporteComponent implements OnInit {
  detalleForm: FormGroup;
  estibajeChecked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private detalleTransporteService: DetalleTransporteService,
    private router: Router
  ) {
    this.detalleForm = this.fb.group({
      cantidadEstibaje: [0, Validators.required],
      descripcionProducto: ['', Validators.required],
      tipoServicio: ['', Validators.required],
      estibaje: [false],
      pago: ['', Validators.required],
      direccionOrigen: this.fb.group({
        barrio: ['', Validators.required],
        callePrincipal: ['', Validators.required],
        calleSecundaria: [''],
        ciudad: ['', Validators.required],
        latitud: ['', Validators.required],
        longitud: ['', Validators.required],
        referencia: [''],
        telefono: ['', Validators.required]
      }),
      direccionDestino: this.fb.group({
        barrio: ['', Validators.required],
        callePrincipal: ['', Validators.required],
        calleSecundaria: [''],
        ciudad: ['', Validators.required],
        latitud: ['', Validators.required],
        longitud: ['', Validators.required],
        referencia: [''],
        telefono: ['', Validators.required]
      }),
      unidadId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Inicializar el estado del estibaje y actualizar la habilitación del campo cantidadEstibaje
    this.estibajeChecked = this.detalleForm.get('estibaje')?.value;
    this.updateCantidadEstibajeState();
  }

  onEstibajeChange(): void {
    this.estibajeChecked = this.detalleForm.get('estibaje')?.value;
    this.updateCantidadEstibajeState();
  }

  // Método que habilita/deshabilita el campo cantidadEstibaje
  updateCantidadEstibajeState(): void {
    const cantidadEstibajeControl = this.detalleForm.get('cantidadEstibaje');
    if (this.estibajeChecked) {
      cantidadEstibajeControl?.enable();
    } else {
      cantidadEstibajeControl?.disable();
      cantidadEstibajeControl?.setValue(0); // Ponemos a 0 si no está marcado
    }
  }

  onSubmit(): void {
    if (this.detalleForm.valid) {
      console.log('Datos a enviar:', this.detalleForm.value);
      this.detalleTransporteService.crearDetalleTransporte(this.detalleForm.value).subscribe({

        next: (response) => {
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Error al crear el Detalle de transporte', err);
        }
      });
    }
  }
}
