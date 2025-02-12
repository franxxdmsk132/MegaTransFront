import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {DetalleTransporte} from '../detalle-transporte';
import {DetalleTransporteService} from '../../service/detalle-transporte.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatToolbar} from '@angular/material/toolbar';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MenuComponent} from '../../menu/menu.component';
import {AuthService} from '../../service/auth.service';
import {JwtDTO} from '../../models/jwt-dto';
import {MatSort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-Detalle-transporte-listar',
  templateUrl: './detalle-transporte-listar.html',
  standalone: true,
  imports: [
    MatPaginator,
    NgIf,
    MatRow,
    MatRowDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatCell,
    MatHeaderCell,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatCard,
    MatToolbar,
    MatProgressSpinner,
    MatTable,
    MenuComponent,
    MatCardActions,
    MatButton,
    MatCardHeader,
    MatCardContent,
    MatCard,
    NgForOf,
    MatSort,
    MatSortModule
  ],
  styleUrls: ['./detalle-transporte-listar.css']
})
export class DetalleTransporteListarComponent implements OnInit {
  dataSource = new MatTableDataSource<DetalleTransporte>();
  displayedColumns: string[] = [
    'cantidadEstibaje', 'descripcionProducto', 'estado', 'tipoServicio', 'estibaje', 'fecha',
    'numOrden', 'pago', 'dirOrigen', 'dirDestino', 'unidad', 'cliente', 'acciones'
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private detalleTransporteService: DetalleTransporteService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.obtenerDetallesTransporte();

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  obtenerDetallesTransporte(): void {
    this.detalleTransporteService.obtenerDetallesTransporte().subscribe({
      next: (detalles) => {
        console.log('Detalles de transporte recibidos:', detalles);
        this.dataSource.data = detalles;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error al obtener detalles de transporte', error);
      }
    });
  }



  eliminarDetalle(id: number): void {
    if (confirm('¿Estás seguro de eliminar este Detalle de transporte?')) {
      this.detalleTransporteService.eliminarDetalleTransporte(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(dt => dt.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar Detalle de transporte', error);
        }
      });
    }
  }

  visualizarDetalle(detalle: DetalleTransporte): void {
    console.log("Visualizando Detalle:", detalle);
    // Aquí podrías redirigir a una página de detalles o abrir un modal
  }

}
