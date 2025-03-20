import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoteService} from '../../service/lote-service';
import {Lote} from '../Lote';
import {MenuComponent} from '../../menu/menu.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CommonModule, NgForOf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
// import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {DetalleEncomiendaService} from '../../service/detalle-encomienda.service';
import {RutaService} from '../../service/ruta-service';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCard} from '@angular/material/card';
import {MatChip, MatChipListbox, MatChipsModule} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {UnidadesService} from '../../service/unidades.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-crear-lotes',
  templateUrl: './crear-lotes.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ReactiveFormsModule,
    MatFormField,
    MatChipsModule,
    MatLabel,
    MatButton,
    MatSelect,
    MatCard,
    MatOption,
    NgForOf,
    MatTable,
    MatCell,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatInput,
    MatDivider,
    FormsModule,
    MatIcon,
    MatIconButton

  ],
  styleUrls: ['./crear-lotes.component.css']
})
export class CrearLotesComponent implements OnInit {
  loteForm: FormGroup;
  unidadesDisponibles: any [] = [];
  rutasDisponibles: any[] = []; // Almacena las rutas disponibles
  encomiendasProcesando: any[] = []; // Almacena encomiendas en estado "Procesando"
  encomiendasSeleccionadas: any[] = []; // Para almacenar las encomiendas seleccionadas
  // readonly separatorKeysCodes = [ENTER, COMMA] as const;
  displayedColumns: string[] = ['id', 'numGuia', 'ruta', 'remitente', 'destinatario', 'fecha', 'acciones'];
  filteredEncomiendas: any = [];

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    private unidadesService: UnidadesService,
    private rutasService: RutaService,
    private detalleEncomiendaService: DetalleEncomiendaService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.loteForm = this.fb.group({
      ruta: ['', Validators.required], // Guardamos el ID de la ruta
      unidad: ['', Validators.required],
      encargado: ['', Validators.required],
      encomiendaIds: [[], Validators.required], // Se enviarán los ID de las encomiendas seleccionadas
    });
  }

  ngOnInit(): void {
    this.cargarRutas();
    this.cargarEncomiendasProcesando();
    this.cargarUnidades();
  }

  // ✅ Cargar unidades desde el servicio
  cargarUnidades() {
    this.unidadesService.lista().subscribe({
      next: (unidades) => (this.unidadesDisponibles = unidades),
      error: (err) => console.error('Error al obtener unidades', err),
    });
  }

  // ✅ Cargar rutas desde el servicio
  cargarRutas() {
    this.rutasService.getRutas().subscribe({
      next: (rutas) => (this.rutasDisponibles = rutas),
      error: (err) => console.error('Error al obtener rutas', err),
    });
  }

  // ✅ Cargar encomiendas con estado "Procesando"
  cargarEncomiendasProcesando() {
    this.detalleEncomiendaService.getAllDetalleEncomiendasRecolectadas().subscribe({
      next: (encomiendas) => (this.encomiendasProcesando = encomiendas),
      error: (err) => console.error('Error al obtener encomiendas', err),
    });
  }

// Método para agregar una encomienda a la tabla de seleccionadas
  agregarEncomienda(encomienda: any) {
    // Verifica si la encomienda ya está seleccionada para no duplicarla
    if (!this.encomiendasSeleccionadas.some(e => e.numGuia === encomienda.numGuia)) {
      this.encomiendasSeleccionadas.push(encomienda);
      this.encomiendasSeleccionadas = [...this.encomiendasSeleccionadas]; // Esto fuerza la detección de cambios
    }
  }

  agregarEncomienda3(encomienda: any) {
    // Remueve de encomiendas disponibles
    this.encomiendasProcesando = this.encomiendasProcesando.filter(e => e.numGuia !== encomienda.numGuia);

    // Agrega a encomiendas seleccionadas si no está duplicada
    if (!this.encomiendasSeleccionadas.some(e => e.numGuia === encomienda.numGuia)) {
      this.encomiendasSeleccionadas.push(encomienda);
      this.encomiendasSeleccionadas = [...this.encomiendasSeleccionadas]; // Esto fuerza la detección de cambios

      // Actualiza el campo encomiendaIds en el formulario con los IDs de las encomiendas seleccionadas
      this.loteForm.patchValue({
        encomiendaIds: this.encomiendasSeleccionadas.map(e => e.id) // Actualiza el campo encomiendaIds
      });
    }
  }

  agregarEncomienda2(encomienda: any) {
    // Remueve de encomiendas disponibles
    this.encomiendasProcesando = this.encomiendasProcesando.filter(e => e.numGuia !== encomienda.numGuia);
    // Agrega a encomiendas seleccionadas
    if (!this.encomiendasSeleccionadas.some(e => e.numGuia === encomienda.numGuia)) {
      this.encomiendasSeleccionadas.push(encomienda);
      this.encomiendasSeleccionadas = [...this.encomiendasSeleccionadas]; // Esto fuerza la detección de cambios
    }
  }

// Método para eliminar una encomienda de la tabla de seleccionadas
  eliminarEncomienda(encomienda: any) {
    this.encomiendasSeleccionadas = this.encomiendasSeleccionadas.filter(e => e.id !== encomienda.id);
  }

  eliminarEncomienda2(encomienda: any) {
    // Remueve de encomiendas seleccionadas
    this.encomiendasSeleccionadas = this.encomiendasSeleccionadas.filter(e => e.numGuia !== encomienda.numGuia);
    // Agrega de nuevo a encomiendas disponibles
    if (!this.encomiendasSeleccionadas.some(e => e.numGuia === encomienda.numGuia)) {
      this.encomiendasProcesando.push(encomienda);
      this.encomiendasProcesando = [...this.encomiendasProcesando]; // Esto fuerza la detección de cambios
    }
  }

  // Método para obtener la fecha actual en formato YYYY-MM-DD
  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Devuelve la fecha en formato 'YYYY-MM-DD'
  }

  // Método para crear el lote
  // ✅ Método para crear el lote
  crearLote() {
    if (this.loteForm.valid) {
      const lote: Lote = {
        ...this.loteForm.value,
        encomiendaIds: this.encomiendasSeleccionadas.map(e => e.id), // Enviar solo los ID
      };
      console.log('Datos del lote a enviar:', lote);


      this.loteService.crearLote(lote).subscribe({
        next: () => {
          this.snackBar.open('Lote creado con éxito', 'Cerrar', {duration: 3000});
          this.router.navigate(['/lotes']);
        },
        error: (err) => {
          console.error('Error al crear el lote', err);
          this.snackBar.open('Error al crear el lote', 'Cerrar', {duration: 3000});
        }
      });
    } else {
      this.snackBar.open('Por favor, completa todos los campos', 'Cerrar', {duration: 3000});
    }
  }

  crearLote2() {
    const lote: Lote = {
      ...this.loteForm.value,
      encomiendaIds: this.encomiendasSeleccionadas.map(e => e.id),
    };
    console.log('Datos del lote a enviar:', lote);
  }

  // Método para filtrar las columnas
  filterColumn(column: string, value: string) {
    if (!value) {
      // Si el valor de búsqueda está vacío, mostramos todas las encomiendas
      this.filteredEncomiendas = [...this.encomiendasProcesando];
    } else {
      // Filtrar las encomiendas según el valor ingresado
      this.filteredEncomiendas = this.encomiendasProcesando.filter(encomienda => {
        switch (column) {
          case 'ruta':
            return encomienda.ruta.toLowerCase().includes(value.toLowerCase());
          case 'remitente':
            const remitente = (encomienda.usuario.nombre + ' ' + encomienda.usuario.apellido).toLowerCase();
            return remitente.includes(value.toLowerCase());
          case 'fecha':
            // Filtrar por fecha (compara las fechas como cadenas o transforma a Date para hacer la comparación)
            const fecha = encomienda.fecha ? new Date(encomienda.fecha).toISOString().split('T')[0] : '';
            return fecha.includes(value); // Ajusta el formato según necesites
          default:
            return true;
        }
      });
    }
  }

}
