import {Component, OnInit} from '@angular/core';
import {Rutas} from '../rutas';
import {ActivatedRoute, Router} from '@angular/router';
import {RutaService} from '../../service/ruta-service';
import {MenuComponent} from '../../menu/menu.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-actualizar-rutas',
  templateUrl: './actualizar-rutas.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule
  ],
  styleUrl: './actualizar-rutas.component.css'
})
export class ActualizarRutasComponent implements OnInit{

  ruta: Rutas = { origen: '', destino: '', id: 0 };  // Inicializa con valores predeterminados
  idRuta: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rutaService: RutaService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la ruta desde la URL
    this.route.paramMap.subscribe((params) => {
      this.idRuta = +params.get('id')!; // El "id" será el parámetro de la URL
      this.cargarRuta();
    });
  }

  cargarRuta(): void {
    if (this.idRuta !== null) {
      this.rutaService.getRuta(this.idRuta).subscribe({
        next: (ruta: Rutas) => {
          this.ruta = ruta;
        },
        error: (error) => {
          console.error('Error al cargar la ruta', error);
        }
      });
    }
  }

  actualizarRuta(): void {
    if (this.idRuta !== null) {
      this.rutaService.updateRuta(this.idRuta, this.ruta).subscribe({
        next: (rutaActualizada: Rutas) => {
          console.log('Ruta actualizada:', rutaActualizada);
          this.router.navigate(['/rutas']);  // Redirigir a la lista de rutas después de la actualización
        },
        error: (error) => {
          console.error('Error al actualizar la ruta', error);
        }
      });
    }
  }
}
