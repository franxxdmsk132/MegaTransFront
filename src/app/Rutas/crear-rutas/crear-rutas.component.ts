import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RutaService } from '../../service/ruta-service';
import { Rutas } from '../rutas';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MenuComponent} from '../../menu/menu.component';
import {FormsModule} from '@angular/forms';  // Importa correctamente la interfaz Rutas

@Component({
  selector: 'app-crear-rutas',
  templateUrl: './crear-rutas.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule
  ],
  styleUrls: ['./crear-rutas.component.css']  // Corregido 'styleUrls'
})
export class CrearRutasComponent implements OnInit {
  ruta: Rutas = {origen: '', destino: '' };  // Inicializa con valores predeterminados

  constructor(private rutaService: RutaService, private router: Router,
              private snackBar: MatSnackBar,) {}

  ngOnInit(): void {
    // Inicialización si es necesario
  }

  // Método para crear una nueva ruta
  crearRuta(): void {
    this.rutaService.addRuta(this.ruta).subscribe({
      next: (respuesta: any) => {
        console.log('Ruta creada:', respuesta);  // Aquí puedes hacer un log para depuración
        this.router.navigate(['/rutas']);  // Navegar a la lista de rutas
      },
      error: (error) => {
        console.error('Error al crear la ruta:', error);
        // Aquí podrías usar Snackbar o alguna otra forma de mostrar el error
        this.showSnackbar(error.error.message || 'Error al crear la ruta', 'Error');
      }
    });
  }

  // Método para mostrar mensajes de error con Snackbar
  showSnackbar(message: string, action: string): void {
    // Asegúrate de tener MatSnackBar configurado en tu módulo
    this.snackBar.open(message, action, {
      duration: 3000,  // Duración del Snackbar (en milisegundos)
      verticalPosition: 'top',  // Posición vertical
      horizontalPosition: 'right',  // Posición horizontal
    });
  }
}
