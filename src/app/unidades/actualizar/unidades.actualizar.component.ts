import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UnidadesService } from '../../service/unidades.service';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import {MenuComponent} from '../../menu/menu.component';

@Component({
  selector: 'app-actualizar-unidad',
  templateUrl: './unidades.actualizar.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatButton,
    NgIf,
    ReactiveFormsModule,
    MenuComponent,
    MatLabel
  ],
  styleUrls: ['./unidades.actualizar.component.css']
})
export class UnidadesActualizarComponent implements OnInit {
  unidadForm!: FormGroup;
  imagenUrl: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  unidadId!: number;

  constructor(
    private fb: FormBuilder,
    private unidadService: UnidadesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this.unidadId = this.route.snapshot.params['id'];

    this.unidadForm = this.fb.group({
      tipo: ['', Validators.required],
      tipo_cajon: ['', Validators.required],
      altura: [0, Validators.required],
      ancho: [0, Validators.required],
      largo: [0, Validators.required]
    });

    // Cargar la unidad específica
    this.unidadService.obtenerUnidadPorId(this.unidadId).subscribe(
      (unidad) => {
        if (unidad) {
          this.unidadForm.patchValue({
            tipo: unidad.tipo,
            tipo_cajon: unidad.tipo_cajon,
            altura: unidad.altura,
            ancho: unidad.ancho,
            largo: unidad.largo
          });

          if (unidad.imagenUrl) {
            this.unidadService.getImage(unidad.imagenUrl).subscribe(
              (imageBlob) => {
                const imageUrl = URL.createObjectURL(imageBlob);
                this.imagenPreview = imageUrl; // Muestra la imagen
              },
              (err) => {
                console.error('Error al obtener la imagen:', err);
                this.toastrService.error('Error al cargar la imagen', 'Error', { timeOut: 3000 });
              }
            );
          }

        }
      },  (err) => {
        console.error('Error al obtener la unidad:', err);
        if (err.status === 401) {
          this.toastrService.error('No autorizado', 'Error', { timeOut: 3000 });
        } else if (err.status === 404) {
          this.toastrService.error('Unidad no encontrada', 'Error', { timeOut: 3000 });
        } else {
          this.toastrService.error('Error al cargar la unidad', 'Error', { timeOut: 3000 });
        }
        this.router.navigate(['/unidades']);
      }
    );
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

  onUpdate(): void {
    if (this.unidadForm.invalid) {
      this.toastrService.error('Todos los campos son obligatorios', 'Error', { timeOut: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('tipo', this.unidadForm.get('tipo')?.value);
    formData.append('tipo_cajon', this.unidadForm.get('tipo_cajon')?.value);
    formData.append('altura', this.unidadForm.get('altura')?.value);
    formData.append('ancho', this.unidadForm.get('ancho')?.value);
    formData.append('largo', this.unidadForm.get('largo')?.value);

    if (this.imagenUrl) {
      formData.append('imagenUrl', this.imagenUrl);
    }

    this.unidadService.update(this.unidadId, formData).subscribe(
      () => {
        this.toastrService.success('Unidad actualizada', 'Éxito', { timeOut: 3000 });
        this.router.navigate(['/unidades']);
      },
      (err) => {
        this.toastrService.error(err.error.mensaje, 'Error', { timeOut: 3000 });
      }
    );
  }
}
