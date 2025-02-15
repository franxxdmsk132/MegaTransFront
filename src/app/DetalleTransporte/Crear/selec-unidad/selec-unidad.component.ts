import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {UnidadesService} from '../../../service/unidades.service';
import {MatList, MatListItem} from '@angular/material/list';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {Unidades} from '../../../unidades/unidades';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef} from '@angular/material/table';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'app-selec-unidad',
  templateUrl: './selec-unidad.component.html',
  styleUrl: './selec-unidad.component.css',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatList,
    MatListItem,
    NgForOf,
    MatDialogActions,
    MatButton,
    NgIf,
    MatCard,
    MatCardHeader,
    MatCardImage,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatGridList,
    MatGridTile
  ]
})
export class SelecUnidadComponent implements OnInit{
  unidades: any[] = [];
  unidadesFiltradas: Unidades[] = [];


  constructor(
    public dialogRef: MatDialogRef<SelecUnidadComponent>,
    private unidadService: UnidadesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.cargarUnidades()
    this.unidadService.lista().subscribe((data) => {
      this.unidades = data;  // Asignas los datos obtenidos al arreglo 'unidades'
    });
  }
  cargarUnidades(): void {
    this.unidadService.lista().subscribe(
      data => {
        console.log('Unidades recibidas:', data);
        this.unidades = data.map(unidad => ({
          ...unidad,
          imagenUrl: unidad.imagenUrl ? `${this.unidadService.imgUrl}${unidad.imagenUrl}` : '/assets/default-img.png'
        }));
      },
      err => console.log(err)
    );
  }

  seleccionarUnidad(unidad: any): void {
    this.dialogRef.close(unidad);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}

