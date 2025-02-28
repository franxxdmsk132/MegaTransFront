import {Component, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TokenService} from '../../service/token.service';
import {DetalleEncomiendaService} from '../../service/detalle-encomienda.service';
import {MatButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import * as L from 'leaflet';
import {LatLngExpression} from 'leaflet';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    MatRadioButton,
    MatRadioGroup,
    NgIf,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatCardTitle,
    MatError,
    NgForOf
  ],
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit {

  detalleEncomienda: FormGroup;
  fragilChecked: boolean = false;
  currentDate: string
  private marker!: L.Marker;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private token: TokenService,
    private detalleEncomiendaService: DetalleEncomiendaService
  ) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.detalleEncomienda = this.fb.group({
      latitudOrg: ['', Validators.required],
      longitudOrg: ['', Validators.required],
      dirRemitente: ['', Validators.required],
      nombreD: ['', Validators.required],
      apellidoD: ['', Validators.required],
      identificacionD: ['', Validators.required],
      telfbeneficiario: ['', Validators.required],
      telfEncargado: ['', Validators.required],
      correoD: ['', Validators.required],
      latitudDestino: ['', Validators.required],
      longitudDestino: ['', Validators.required],
      dirDestino: ['', Validators.required],
      referenciaD: ['', Validators.required],
      tipoEntrega: ['', Validators.required],
      ruta: ['', Validators.required],
      estado: ['RECOLECCION', Validators.required],
      fecha: [this.currentDate, Validators.required],
      productosDto: this.fb.array([this.createProducto()])  // Aquí cambiamos a FormArray
    });

  }

// Crear un nuevo grupo de formulario para un producto
  createProducto(): FormGroup {
    return this.fb.group({
      tipoProducto: ['', Validators.required],
      alto: ['', Validators.required],
      ancho: ['', Validators.required],
      largo: ['', Validators.required],
      peso: ['', Validators.required],
      fragil: [false]
    });
  }

  // Obtener el FormArray de productos
  get productos() {
    return (this.detalleEncomienda.get('productosDto') as FormArray);
  }

  // Agregar un nuevo producto
  addProducto() {
    this.productos.push(this.createProducto());
  }

  // Eliminar un producto
  removeProducto(index: number) {
    this.productos.removeAt(index);
  }

  onSubmit(): void {
    if (this.detalleEncomienda.valid) {
      console.log('Datos a enviar:', this.detalleEncomienda.value);  // Verifica aquí los valores antes de enviarlos
      this.detalleEncomiendaService.crearDetalleEncomienda(this.detalleEncomienda.value).subscribe({
        next: (response) => {
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Error al crear el Detalle de transporte', err);
        }
      });
    } else {
      console.error('Formulario inválido', this.detalleEncomienda.errors);
    }
  }


  ngOnInit(): void {
    this.initMap('mapOrigen', 'latitudOrg', 'longitudOrg');
    this.initMap('mapDestino', 'latitudDestino', 'longitudDestino');
  }

  private initMap(mapId: string, latControl: string, lngControl: string): void {
    const coordinates: number[] = [-2.900717, -79.006086];  // Un ejemplo de coordenadas

    const latLngDirect: LatLngExpression = [coordinates[0], coordinates[1]];

    const map = L.map(mapId).setView(latLngDirect, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker(latLngDirect, {draggable: true}).addTo(map);
    const customIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    marker.setIcon(customIcon);

    marker.on('dragend', async () => {
      const position = marker.getLatLng();
      // Verifica los valores antes de asignarlos
      console.log('Latitud:', position.lat);
      console.log('Longitud:', position.lng);
      // Actualizar directamente los campos de latitud y longitud en el formulario
      console.log('Formulario actual antes de patchValue:', this.detalleEncomienda.value);

      this.detalleEncomienda.patchValue({
        [latControl]: position.lat.toFixed(7),
        [lngControl]: position.lng.toFixed(7)
      });

      console.log('Formulario después de patchValue:', this.detalleEncomienda.value);

      // Obtener detalles de la ubicación y actualizar los campos adicionales
      await this.getLocationDetails(position.lat, position.lng, latControl);
    });
  }

  async getLocationDetails(lat: number, lng: number, direccionControl: string) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);  // Verifica la estructura completa de la respuesta

      if (data.address) {
        // Solo actualiza latitud y longitud
        this.detalleEncomienda.patchValue({
          [lat]: lat.toFixed(7),
          [lng]: lng.toFixed(7)
        });
      }
    } catch (error) {
      console.error('Error obteniendo datos de ubicación:', error);
    }
  }




}
