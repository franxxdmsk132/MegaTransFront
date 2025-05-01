import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {Lote} from '../Lote';
import {LoteService} from '../../service/lote-service';
import {MenuComponent} from '../../menu/menu.component';
import {MatButton, MatFabButton} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {EstadoLoteComponent} from './estado-lote/estado-lote.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {TokenService} from '../../service/token.service';
import {MatIcon} from "@angular/material/icon";
import {saveAs} from 'file-saver';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-lista-lotes',
  templateUrl: './lista-lotes.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatButton,
    MatCardActions,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    MatCard,
    MatCardHeader,
    NgForOf,
    MatFabButton,
    MatIcon,
    NgIf,
    MatProgressSpinner
  ],
  styleUrls: ['./lista-lotes.component.css']
})
export class ListarLotesComponent implements OnInit {



  displayedColumns: string[] = ['id', 'numLote', 'encargado','fecha', 'estado', 'unidad', 'numerosGuia', 'ruta', 'acciones'];
  dataSource = new MatTableDataSource<Lote>([]);
  isAdmin = false;
  isLoggedIn = false;
  isLoading = true;
  isEmpl = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private loteService: LoteService,
              private router: Router,
              private dialog: MatDialog,
              private tokenService: TokenService,) {
  }

  ngOnInit(): void {
    this.cargarLotes();
    this.isLoggedIn = !!this.tokenService.getToken();
    this.isAdmin = this.isLoggedIn && this.tokenService.isAdmin();
    this.isEmpl = this.isLoggedIn && this.tokenService.isEmpl();
  }

  selectedTabIndex = 0;

  cargarLotes(): void {
    this.isLoading = true;
    this.loteService.listarLotes().subscribe(
      (lotes) => {
        this.dataSource.data = lotes;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar lotes:', error);
        this.isLoading = false;
      }
    );
  }


  verDetalles(lote: Lote) {
    console.log("Detalles Lote", lote);
    this.router.navigate(['detalleLotes/', lote.id]);
  }
  editarDetalles(lote: Lote) {
    console.log("Detalles Lote", lote);
    this.router.navigate(['actualizarLotes/', lote.id]);
  }

  abrirDialogoEstado(lote: Lote) {
    const dialogRef = this.dialog.open(EstadoLoteComponent,{
      width: '300px',
      data: { id: lote.id  , estado:lote.estado}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if (result){
        const index = this.dataSource.data.findIndex(d => d.id === lote.id);
        if (index !== -1) {
          this.dataSource.data[index].estado = result;
          this.cargarLotes()
        }
      }
    });
  }
  crearLote() {
    console.log('navengando a /crearLote')
    this.router.navigate(['/crearLote'])
  }

  obtenerExcel() {
    this.loteService.obtenerDetallesTransporteExcel().subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Reporte-Lote.xlsx');
      },
      (error) => {
        console.error('Error al descargar el Excel:', error);
      }
    );
  }
  obtenerPDF(loteId: number) {
    this.loteService.obtenerDetallesEncomiendaPDF(loteId).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, 'DetallesEncomienda.pdf');
      },
      (error) => {
        console.error('Error al descargar el PDF:', error);
      }
    );
  }


}
