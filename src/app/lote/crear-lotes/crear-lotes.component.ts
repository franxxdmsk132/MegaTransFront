import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoteService } from '../../service/lote-service';
import { Lote } from '../Lote';
import { MenuComponent } from '../../menu/menu.component';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import { MatButton } from '@angular/material/button';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
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
    MatChip,
    MatIcon,
    MatChipListbox,
    MatTable,
    MatCell,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef

  ],
  styleUrls: ['./crear-lotes.component.css']
})
export class CrearLotesComponent implements OnInit {
  loteForm: FormGroup;
  unidadesDisponibles: any [] =[];
  rutasDisponibles: any[] = []; // Almacena las rutas disponibles
  encomiendasProcesando: any[] = []; // Almacena encomiendas en estado "Procesando"
  encomiendasSeleccionadas: any[] = []; // Para almacenar las encomiendas seleccionadas
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  displayedColumns: string[] = ['numGuia', 'ruta', 'remitente', 'destinatario', 'peso', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    private unidadesService : UnidadesService,
    private rutasService: RutaService,
    private detalleEncomiendaService: DetalleEncomiendaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loteForm = this.fb.group({
      ruta: ['', Validators.required], // Guardamos el ID de la ruta
      unidad: ['', Validators.required],
      encomiendaIds: [[]], // Se enviarán los IDs de las encomiendas seleccionadas
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
  // ✅ Método para agregar una encomienda a la selección
  agregarEncomienda(encomienda: any) {
    if (!this.encomiendasSeleccionadas.includes(encomienda)) {
      this.encomiendasSeleccionadas.push(encomienda);
    }
  }
  // ✅ Método para quitar una encomienda seleccionada
  eliminarEncomienda(encomienda: any) {
    this.encomiendasSeleccionadas = this.encomiendasSeleccionadas.filter(e => e.id !== encomienda.id);
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
        encomiendaIds: this.encomiendasSeleccionadas.map(e => e.id), // Enviar solo los IDs
      };

      this.loteService.crearLote(lote).subscribe({
        next: () => {
          this.snackBar.open('Lote creado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/lotes']);
        },
        error: (err) => {
          console.error('Error al crear el lote', err);
          this.snackBar.open('Error al crear el lote', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Por favor, completa todos los campos', 'Cerrar', { duration: 3000 });
    }
  }
}
