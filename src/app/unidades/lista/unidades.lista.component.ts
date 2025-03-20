import { Component, OnInit } from '@angular/core';
import { Unidades } from '../unidades';
import { TokenService } from '../../service/token.service';
import { UnidadesService } from '../../service/unidades.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MenuComponent} from '../../menu/menu.component';
import {Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {forkJoin, map, of} from 'rxjs';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-lista-unidad',
  templateUrl: './unidades.lista.component.html',
  styleUrls: ['./unidades.lista.component.css'],
  imports: [
    MatCard,
    MatCardTitle,
    MatIcon,
    MenuComponent,
    MatFabButton,
    MatCardHeader,
    NgForOf,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatCardSubtitle,
    MatProgressSpinner,
    NgIf
  ],
  standalone: true
})
export class ListaUnidadComponent implements OnInit {
  loading: boolean = true;
  errorMessage: string | undefined;
  unidades: Unidades[] = [];
  unidadesFiltradas: Unidades[] = [];
  columnas: string[] = ['id', 'imagen', 'dimensiones', 'tipo', 'tipo_cajon', 'acciones'];

  constructor(
    private tokenService: TokenService,
    private unidadesService: UnidadesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cargarUnidades2();
    // this.agregarUnidad();
  }

  cargarUnidades(): void {
    this.unidadesService.lista().subscribe(
      data => {
        console.log('Unidades recibidas:', data);
        this.unidades = data.map(unidad => ({
          ...unidad,
          imagenUrl: unidad.imagenUrl ? `${this.unidadesService.imgUrl}${unidad.imagenUrl}` : '/assets/default-img.png'
        }));
        this.unidadesFiltradas = [...this.unidades];
      },
      err => console.log(err)
    );
  }


  cargarUnidades2(): void {
    this.unidadesService.lista().subscribe(
      data => {
        console.log('Unidades recibidas:', data);

        // Crear un array de observables para obtener las imágenes
        const imageRequests = data.map((unidad) => {
          return unidad.imagenUrl
            ? this.unidadesService.getImage(unidad.imagenUrl).pipe(
              // Convertir el blob en una URL de objeto
              map((blob) => ({
                unidad,
                imagenUrl: URL.createObjectURL(blob),
              }))
            )
            : of({ unidad, imagenUrl: '/assets/default-default-img.png' });
        });

        // Usar forkJoin para esperar a que todas las imágenes se carguen
        forkJoin(imageRequests).subscribe(
          (result) => {
            // Asignar las URLs de las imágenes a cada unidad
            this.unidades = result.map(({ unidad, imagenUrl }) => ({
              ...unidad,
              imagenUrl,
            }));
            this.unidadesFiltradas = [...this.unidades];
            this.loading = false; // Establecer loading a false cuando los datos se reciban
          },
          (err) => {
            console.error(err);
            this.errorMessage = 'Error al cargar las unidades'; // Mostrar el mensaje de error
            this.loading = false; // Establecer loading a false en caso de error
          }
        );
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar las unidades'; // Mostrar el mensaje de error
        this.loading = false; // Establecer loading a false en caso de error
      }
    );
  }


  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value.toLowerCase();
    this.unidadesFiltradas = this.unidades.filter(unidad =>
      unidad.tipo?.toLowerCase().includes(filtro) ||
      unidad.tipo_cajon?.toLowerCase().includes(filtro) ||
      `${unidad.largo}x${unidad.ancho}x${unidad.altura}`.includes(filtro)
    );
  }

  editarUnidad(unidad: Unidades): void {
    console.log('Editar unidad:', unidad);
    this.router.navigate(['/unidadesActualizar', unidad.id]); // Redirige a la página de actualización
  }


  eliminarUnidad(id?: number): void {
    if (id) {
      console.log('Eliminar unidad con ID:', id);
    }
  }

  agregarUnidad() {
    console.log('Navegando a /unidadesRegistar'); // Verifica si se imprime en la consola

    this.router.navigate(['/unidadesRegistar']);
  }
}
