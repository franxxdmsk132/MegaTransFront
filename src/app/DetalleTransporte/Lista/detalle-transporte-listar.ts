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
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatToolbar} from '@angular/material/toolbar';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MenuComponent} from '../../menu/menu.component';
import {AuthService} from '../../service/auth.service';
import {JwtDTO} from '../../Seguridad/models/jwt-dto';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {Router} from '@angular/router';
import {TokenService} from '../../service/token.service';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {EstadoDialogComponent} from './estado-dialog/estado-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-Detalle-transporte-listar',
  templateUrl: './detalle-transporte-listar.html',
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    MatCard,
    MenuComponent,
    MatCardActions,
    MatButton,
    MatCardHeader,
    MatCardContent,
    MatCard,
    NgForOf,
    MatSortModule,
    MatCardTitle,
    MatTabGroup,
    MatTab,
    ReactiveFormsModule,
    MatTabLabel,
    MatFabButton,
    MatProgressSpinner,

  ],
  styleUrls: ['./detalle-transporte-listar.css']
})
export class DetalleTransporteListarComponent implements OnInit {
  isAdmin = false;
  isEmpl = false
  isDesp = false

  isLogged = false;
  isLoading = true;
  errorMessage: string | undefined;
  isLoadingScroll: boolean = false; // Nueva variable para el spinner del scroll
  dataFiltrada: DetalleTransporte[] = [];
  dataSource = new MatTableDataSource<DetalleTransporte>();
  displayedColumns: string[] = [
    'cantidadEstibaje', 'descripcionProducto', 'estado', 'tipoServicio', 'estibaje', 'fecha',
    'numOrden', 'pago', 'dirOrigen', 'dirDestino', 'unidad', 'cliente', 'acciones'
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentUserName: JwtDTO = new JwtDTO();

  constructor(
    private detalleTransporteService: DetalleTransporteService,
    private tokenService: TokenService,
    private router: Router,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.obtenerDetallesTransporte();
    this.isLogged = !!this.tokenService.getToken();
    this.isAdmin = this.isLogged && this.tokenService.isAdmin();
    this.isEmpl = this.isLogged && this.tokenService.isEmpl();
    this.isDesp= this.isLogged && this.tokenService.isDesp();


  }

  //
  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  // }
  selectedTabIndex = 0;


  obtenerDetallesTransporte(): void {
    this.detalleTransporteService.obtenerDetallesTransporte().subscribe({
      next: (detalles) => {
        console.log('Detalles de transporte recibidos:', detalles);
        // Ordenar los detalles por numOrden de forma descendente
        detalles.sort((a, b) => this.extraerNumeroOrden(b.numOrden) - this.extraerNumeroOrden(a.numOrden)); // Orden descendente
        this.dataSource.data = detalles;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
        this.filtrarPorEstado();  // Aplicar filtro después de cargar los datos
      },
      error: (error) => {
        this.errorMessage = 'No se pudo obtener las solicitudes';
        console.error('Error al obtener detalles de transporte', error);
        this.isLoading = false;
      }
    });
  }

  obtenerExcel() {
    this.detalleTransporteService.obtenerDetallesTransporteExcel().subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Reporte-Transporte.xlsx');
      },
      (error) => {
        console.error('Error al descargar el Excel:', error);
      }
    );
  }

  // Método para filtrar por estado según la pestaña seleccionada
  filtrarPorEstado(): void {
    if (!this.dataSource.data) {
      this.dataFiltrada = [];
      return;
    }

    switch (this.selectedTabIndex) {
      case 0:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'PENDIENTE');
        break;
      case 1:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'PROCESANDO');
        break;
      case 2:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'FINALIZADO');
        break;
      case 3:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'MOVIMIENTO');
        break;
      case 4:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'CANCELADO');
        break;
      default:
        this.dataFiltrada = this.dataSource.data;
    }
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
    this.router.navigate(['detalleTransporte/', detalle.id])
  }

  // Método para abrir el dialog de cambio de estado
  abrirDialogoEstado(detalle: DetalleTransporte): void {
    const dialogRef = this.dialog.open(EstadoDialogComponent, {
      width: '300px',
      data: {id: detalle.id, estado: detalle.estado} // Enviar el ID y el estado actual
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Encuentra el índice del detalle actualizado
        const index = this.dataSource.data.findIndex(d => d.id === detalle.id);
        if (index !== -1) {
          this.dataSource.data[index].estado = result; // Actualizar con el nuevo estado
          this.obtenerDetallesTransporte() // Refrescar la tabla
        }
      }
    });

  }


  onScroll(event: any): void {
    if (window.scrollY === 0) {  // Si el usuario ha llegado al inicio
      this.obtenerDetallesTransporte();  // Recargar los datos
    }
  }

  extraerNumeroOrden(orden: string): number {
    const numero = orden.replace(/[^\d]/g, ''); // Elimina los caracteres no numéricos
    return Number(numero); // Convierte la parte numérica a número
  }
}

