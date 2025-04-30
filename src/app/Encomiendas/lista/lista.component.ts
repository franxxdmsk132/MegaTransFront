import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {DetalleTransporte} from '../../DetalleTransporte/detalle-transporte';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {DetalleEncomienda} from '../detalle-encomienda';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {DetalleTransporteService} from '../../service/detalle-transporte.service';
import {TokenService} from '../../service/token.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DetalleEncomiendaService} from '../../service/detalle-encomienda.service';
import {EstadoDialogComponent} from '../../DetalleTransporte/Lista/estado-dialog/estado-dialog.component';
import {EstadoEncomiendaComponent} from './estado-encomienda/estado-encomienda.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgForOf, NgIf} from '@angular/common';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatCardTitle,
    MatIcon,
    MatCard,
    MatProgressSpinner,
    MenuComponent,
    MatCardActions,
    MatButton,
    MatCardHeader,
    MatCardContent,
    MatCard,
    NgForOf,
    MatSortModule,
    MatCardSubtitle,
    MatFabButton,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
  ],
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit{

  isLoading = true;
  isLogged = false;
  isAdmin = false;
  isEmpl = false;
  isUser = false;
  isDesp =false;
  errorMessage: string | undefined;
  dataFiltrada: DetalleEncomienda[] = [];
  // Lista de estados disponibles
  estados: string[] = ['RECOLECCION', 'RECOLECTADO', 'TRASLADO', 'BODEGA', 'ENTREGADO', 'CANCELADO'];

  // Estado seleccionado en el select
  selectedEstado: string = this.estados[0];
  dataSource = new MatTableDataSource<DetalleEncomienda>();
  displayedColumns: string[] = [
    'numGuia','numLote','cliente', 'fecha', 'dirRemitente','latitudOrg','longitudOrg', 'nombreD', 'apellidoD',
    'identificacionD', 'telfBeneficiario', 'telfEncargado', 'correoD','dirDestino','longitudDestino','latitudDestino',
    'referenciaD', 'tipoEntrega', 'ruta', 'estado', 'qrCodePath', 'acciones'
  ];
  // Diccionario de íconos para cada estado
  iconosEstados: { [key: string]: string } = {
    'RECOLECCION': 'watch_later',
    'TRASLADO': 'local_shipping',
    'ENTREGADO': 'check_circle',
    'BODEGA': 'inventory',
    'RECOLECTADO': 'assignment_turned_in',
    'CANCELADO': 'cancel'
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private detalleEncomiendaService: DetalleEncomiendaService,
    private tokenService: TokenService,
    private router: Router,
    private dialog : MatDialog,
    ) {
  }
  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.isAdmin = this.isLogged && this.tokenService.isAdmin();
    this.isEmpl = this.isLogged && this.tokenService.isEmpl();
    this.isUser = this.isLogged && this.tokenService.isUser();
    this.isDesp = this.isLogged && this.tokenService.isDesp();


    this.obtenerDetallesEncomienda()
  }
  selectedTabIndex = 0;
  obtenerDetallesEncomienda(): void {
    this.detalleEncomiendaService.getAllDetalleEncomiendas().subscribe({
      next: (detalles) => {
        console.log('Detalles de Encomienda recibidos:', detalles);
        detalles.sort((a, b) => this.extraerNumeroGuia(b.numGuia) - this.extraerNumeroGuia(a.numGuia)); // Orden descendente
        this.dataSource.data = detalles;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
        this.filtrarPorEstado();  // Aplicar filtro después de cargar los datos
      },
      error: (error) => {
        this.errorMessage = 'No se pudo obtener las solicitudes';
        this.errorMessage = 'No se pudo obtener las solicitudes';
        console.error('Error al obtener detalles de Encomienda', error);
        this.isLoading = false;
      }
    });
  }
  filtrarPorEstado(): void {
    if (!this.dataSource.data) {
      this.dataFiltrada = [];
      return;
    }

    switch (this.selectedTabIndex) {
      case 0:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'RECOLECCION');
        break;
      case 1:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'TRASLADO');
        break;
      case 2:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'ENTREGADO');
        break;
      case 3:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'BODEGA');
        break;
      case 4:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'RECOLECTADO');
        break;
      case 5:
        this.dataFiltrada = this.dataSource.data.filter(detalle => detalle.estado === 'CANCELADO');
        break;

      default:
        this.dataFiltrada = this.dataSource.data;
    }
  }
  visualizarDetalle(detalle: DetalleEncomienda): void {
    console.log("Visualizando Detalle:", detalle);
    this.router.navigate(['detalleEncomienda/', detalle.id])
  }
  // Método para abrir el dialog de cambio de estado
  abrirDialogoEstado(detalle: DetalleEncomienda): void {
    const dialogRef = this.dialog.open(EstadoEncomiendaComponent, {
      width: '300px',
      data: { id: detalle.id, estado: detalle.estado } // Enviar el ID y el estado actual
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar el estado en la lista si se ha cambiado con éxito
        const index = this.dataSource.data.findIndex(d => d.id === detalle.id);
        if (index !== -1) {
          this.dataSource.data[index].estado = detalle.estado;
        }
      }
    });
  }
  filtrarPorEstado2(): void {
    this.dataFiltrada = this.dataSource.data.filter(
      (element) => element.estado === this.selectedEstado
    );
  }
  extraerNumeroGuia(guia: string): number {
    const numero = guia.replace(/[^\d]/g, ''); // Elimina los caracteres no numéricos
    return Number(numero); // Convierte la parte numérica a número
  }
  obtenerExcel() {
    this.detalleEncomiendaService.obtenerDetallesTransporteExcel().subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Reporte-Encomienda.xlsx');
      },
      (error) => {
        console.error('Error al descargar el Excel:', error);
      }
    );
  }
}
