import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Lote} from '../Lote';
import {LoteService} from '../../service/lote-service';
import {MenuComponent} from '../../menu/menu.component';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {RutaService} from '../../service/ruta-service';
import {UnidadesService} from '../../service/unidades.service';
import {DetalleEncomiendaService} from '../../service/detalle-encomienda.service';
import {MatChip, MatChipListbox, MatChipRemove} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-actualizar-lotes',
  templateUrl: './actualizar-lotes.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatCard,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatButton,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatLabel,
    MatChip,
    MatChipListbox,
    MatChipRemove,
    MatIcon,
    MatInput
  ],
  styleUrl: './actualizar-lotes.component.css'
})
export class ActualizarLotesComponent implements OnInit {
  loteForm: FormGroup;
  idLote!: number;
  lote!: Lote;
  rutasDisponibles: any[] = []; // Almacena las rutas disponibles
  unidadesDisponibles: any [] =[];
  encomiendasProcesando: any[] = []; // Almacena encomiendas en estado "Procesando"
  encomiendasSeleccionadas: any[] = []; // Para almacenar las encomiendas seleccionadas
  displayedColumns: string[] = ['numGuia', 'ruta', 'remitente', 'destinatario', 'acciones'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loteService: LoteService,
    private fb: FormBuilder,
    private rutaService: RutaService,
    private unidadesService:UnidadesService,
    private detalleEncomiendaService:DetalleEncomiendaService
  ) {
    this.loteForm = this.fb.group({
      encargado: ['', Validators.required],
      ruta: ['', Validators.required], // Guardamos el ID de la ruta
      unidad: ['', Validators.required],
      encomiendaIds: [[]], // Se enviarán los IDs de las encomiendas seleccionadas
    });
  }
  cargarUnidades() {
    this.unidadesService.lista().subscribe({
      next: (unidades) => (this.unidadesDisponibles = unidades),
      error: (err) => console.error('Error al obtener unidades', err),
    });
  }
  ngOnInit(): void {
    this.idLote = Number(this.route.snapshot.paramMap.get('id')); // Obtiene el ID de la URL
    this.cargarLote();
    this.cargarUnidades();
    this.cargarRutas();
    this.cargarEncomiendasProcesando();
  }
  cargarLote(): void {
    this.loteService.obtenerLotePorId(this.idLote).subscribe(
      (lote) => {
        this.lote = lote;
        console.log(this.lote, "Lote Recibido");

        this.loteForm.patchValue({
          numLote: lote.numLote,
          fecha: lote.fecha,
          estado: lote.estado,
          unidad: lote.unidad?.id,
          encargado: lote.encargado,
          encomiendaIds: lote.encomiendaIds,
          numerosGuia: lote.numerosGuia,
          ruta: lote.ruta,
        });
      },
      (error) => {
        console.error('Error al obtener el lote:', error);
      }
    );
  }
  cargarRutas() {
    this.rutaService.getRutas().subscribe({
      next: (rutas) => (this.rutasDisponibles = rutas),
      error: (err) => console.error('Error al obtener rutas', err),
    });
  }
  actualizarLote(): void {
    if (this.loteForm.valid) {
      const loteActualizado: Lote = { ...this.lote, ...this.loteForm.value };

      this.loteService.actualizarLote(this.idLote, loteActualizado).subscribe(
        () => {
          console.log('Lote actualizado con éxito', loteActualizado);
          this.router.navigate(['/lotes']); // Redirige a la lista de lotes después de actualizar
        },
        (error) => {
          console.error('Error al actualizar el lote:', error);
        }
      );
    }
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
}
