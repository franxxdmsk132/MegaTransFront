import {Component, OnInit} from '@angular/core';
import {UnidadesService} from '../../service/unidades.service';
import {Router, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MenuComponent} from '../../menu/menu.component';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-nueva-unidad',
  templateUrl: './unidades.registro.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatCard,
    MatCardTitle,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgIf,
    MatButton,
    MatLabel,
    MatError,
    RouterLink,
    MatHint

  ],
  styleUrls: ['./unidades.registro.component.css']
})
export class UnidadesRegistroComponent implements OnInit {
  unidadForm!: FormGroup;
  imagenUrl: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;

  altura: number= 0;
  largo: number = 0;
  ancho: number = 0;
  tipo: string = '';
  tipo_cajon: string = '';


  constructor(
    private fb: FormBuilder,
    private unidadService: UnidadesService,
    private router: Router,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.unidadForm = this.fb.group({
      tipo: ['', Validators.required],
      tipo_cajon: ['', Validators.required],
      altura: [0, Validators.required],
      ancho: [0, Validators.required],
      largo: [0, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
      this.imagenUrl = file; // Guarda el archivo en la variable 'imagen'
      const reader = new FileReader();
      reader.readAsDataURL(file); // Lee el archivo como URL de datos
      reader.onload = () => {
        this.imagenPreview = reader.result as string; // Muestra la imagen como vista previa
      };
    }
  }


  onCreate(): void {
    if (!this.imagenUrl) {
      this.toastrService.error('La imagen es obligatoria', 'Fail', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    const formData = new FormData();
    formData.append('tipo', this.unidadForm.get('tipo')?.value);
    formData.append('tipo_cajon', this.unidadForm.get('tipo_cajon')?.value);
    formData.append('altura', this.unidadForm.get('altura')?.value);
    formData.append('ancho', this.unidadForm.get('ancho')?.value);
    formData.append('largo', this.unidadForm.get('largo')?.value);
    formData.append('imagenUrl', this.imagenUrl);

    // Log para verificar contenido del FormData
    for (let [key, value] of formData.entries()) {
      console.log(key + ": " + value);
    }

    this.unidadService.save(formData).subscribe(
      data => {
        this.toastrService.success('Unidad Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/unidades']);
      },
      err => {
        this.toastrService.error(err.error.mensaje, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

}
