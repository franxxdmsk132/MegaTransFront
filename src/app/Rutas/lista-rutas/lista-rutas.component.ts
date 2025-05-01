import {Component, OnInit} from '@angular/core';
import {Rutas} from '../rutas';
import {RutaService} from '../../service/ruta-service';
import {MenuComponent} from '../../menu/menu.component';
import {NgForOf, NgIf} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {EliminarDialogRutasComponent} from './eliminar-dialog-rutas/eliminar-dialog-rutas.component';
import {Router} from '@angular/router';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-lista-rutas',
  templateUrl: './lista-rutas.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    NgForOf,
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    NgIf
  ],
  styleUrls: ['./lista-rutas.component.css']
})
export class ListaRutasComponent implements OnInit {
  rutas: Rutas[] = [];  // Esta variable contendrá las rutas obtenidas
  isLoading: boolean = true
  errorMessage: string | undefined;

  constructor(
    private rutaService: RutaService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getRutas();  // Llamamos a la función para obtener las rutas al iniciar el componente
  }

  // Obtener todas las rutas usando el servicio
  getRutas(): void {
    this.rutaService.getRutas().subscribe({
      next: (data: Rutas[]) => {
        this.rutas = data;  // Asignamos las rutas obtenidas a la variable rutas
        // this.rutaService.showSnackbar('Rutas cargadas correctamente', 'Cerrar');  // Muestra Snackbar de éxito
        this.isLoading = false; // Desactivar spinner

      },
      error: (error: any) => {
        // Verifica si hay un mensaje de error
        if (error.status === 404 && error.error && error.error.mensaje) {
          this.rutaService.showSnackbar(error.error.mensaje, 'Cerrar');  // Mostrar mensaje de error desde el backend
        } else {
          this.rutaService.showSnackbar('Error al cargar las rutas', 'Cerrar');  // Mostrar mensaje genérico de error
        }
      }
    });
  }

  // Función para editar una ruta
  editarRuta(ruta: Rutas): void {
    console.log('Editar ruta:', ruta);
    this.router.navigate(['/actualizar-ruta', ruta.id]);
  }

  // Función para Crear una ruta
  crearRuta(): void {
    this.router.navigate(['/crear-ruta']);
  }

  // Función para eliminar una ruta
  eliminarRuta(id: number | undefined): void {
    if (id !== undefined) {
      const dialogRef = this.dialog.open(EliminarDialogRutasComponent, {
        width: '400px',
        data: {
          title: 'Confirmación de eliminación',
          message: '¿Estás seguro de que deseas eliminar esta ruta?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si el usuario aceptó, procede con la eliminación
          this.rutaService.deleteRuta(id).subscribe({
            next: () => {
              this.rutas = this.rutas.filter((ruta) => ruta.id !== id);  // Eliminar de la lista local
              this.rutaService.showSnackbar('Ruta eliminada correctamente', 'Cerrar');
            },
            error: (error) => {
              this.rutaService.showSnackbar('Error al eliminar la ruta', 'Cerrar');
            }
          });
        }
      });
    } else {
      this.rutaService.showSnackbar('ID de ruta no válido', 'Cerrar');
    }
  }
}
