import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DetalleTransporteService} from '../../service/detalle-transporte.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MenuComponent} from '../../menu/menu.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatCheckbox} from '@angular/material/checkbox';
import * as L from 'leaflet';
import {LatLngExpression} from 'leaflet';
import {MatDialog} from '@angular/material/dialog';
import {SelecUnidadComponent} from './selec-unidad/selec-unidad.component';
import {NgIf} from '@angular/common';
import {TokenService} from '../../service/token.service';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-Detalle-transporte-crear',
  templateUrl: './detalle-transporte-crear.component.html',
  styleUrls: ['./detalle-transporte-crear.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MenuComponent,
    MatRadioGroup,
    MatRadioButton,
    MatCheckbox,
    NgIf,
    MatSlideToggle,
    MatChipListbox,
    MatChipOption,
    MatDivider
  ],
  standalone: true
})
export class CrearDetalleTransporteComponent implements OnInit {
  detalleForm: FormGroup;
  estibajeChecked: boolean = false;
  nombreCompleto: string = '';  // Almacenar el nombre completo
  nombreComercial: string = '';  // Almacenar el nombre comercial  private map!: L.Map;
  private marker!: L.Marker;

  constructor(
    private fb: FormBuilder,
    private detalleTransporteService: DetalleTransporteService,
    private router: Router,
    private dialog: MatDialog,
    private token: TokenService,
  ) {
    this.detalleForm = this.fb.group({
      numOrden:[''],
      cantidadEstibaje: [0, Validators.required],
      descripcionProducto: ['', Validators.required],
      tipoServicio: ['', Validators.required],
      estibaje: [false],
      pago: ['', Validators.required],
      direccionOrigen: this.fb.group({
        barrio: ['', Validators.required],
        callePrincipal: ['', Validators.required],
        calleSecundaria: [''],
        ciudad: ['', Validators.required],
        latitud: ['', Validators.required],
        longitud: ['', Validators.required],
        referencia: [''],
        telefono: ['', Validators.required]
      }),
      direccionDestino: this.fb.group({
        barrio: ['', Validators.required],
        callePrincipal: ['', Validators.required],
        calleSecundaria: [''],
        ciudad: ['', Validators.required],
        latitud: ['', Validators.required],
        longitud: ['', Validators.required],
        referencia: [''],
        telefono: ['', Validators.required]
      }),
      unidadId: ['', Validators.required],
      unidadTipo: [''],
      unidadImagen: ['']
    });
  }

  ngOnInit(): void {
    const nombreComercial = this.token.getNombreComercial() || 'Nombre Comercial no disponible';
    const nombreCompleto = this.token.getFullName() || 'Nombre Completo no disponible';

    this.nombreComercial = nombreComercial;
    this.nombreCompleto = nombreCompleto;

    console.log('Nombre Comercial:', this.nombreComercial);
    console.log('Nombre Completo:', this.nombreCompleto);

    this.initMap('mapOrigen', 'direccionOrigen');
    this.initMap('mapDestino', 'direccionDestino');
    this.estibajeChecked = this.detalleForm.get('estibaje')?.value;
    this.updateCantidadEstibajeState();
  }

  private initMap(mapId: string, direccionControl: string): void {
    const coordinates: number[] = [-2.900717, -79.006086];  // Un ejemplo de coordenadas

    // Usamos las coordenadas para la variable latLngDirect
    const latLngDirect: LatLngExpression = [coordinates[0], coordinates[1]];

    const map = L.map(mapId).setView(latLngDirect, 13);  // Usamos latLngDirect para el setView

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker(latLngDirect, {draggable: true}).addTo(map);  // Usamos latLngDirect para el marcador
    const customIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    marker.setIcon(customIcon);

    // Función que mantiene el marcador en el centro del mapa
    map.on('move', () => {
      const center = map.getCenter();  // Obtén las coordenadas del centro
      marker.setLatLng(center);        // Mueve el marcador al centro
      this.detalleForm.patchValue({
        [direccionControl]: {
          latitud: center.lat.toFixed(6),
          longitud: center.lng.toFixed(6)
        }
      });
      this.getLocationDetails(center.lat, center.lng, direccionControl);  // Obtén detalles de la nueva ubicación
    });

    marker.on('dragend', async () => {
      const position = marker.getLatLng();
      this.detalleForm.patchValue({
        [direccionControl]: {
          latitud: position.lat.toFixed(6),
          longitud: position.lng.toFixed(6)
        }
      });
      await this.getLocationDetails(position.lat, position.lng, direccionControl);
    });
  }



  async getLocationDetails(lat: number, lng: number, direccionControl: string) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);  // Verifica la estructura completa de la respuesta

      if (data.address) {
        this.detalleForm.patchValue({
          [direccionControl]: {
            barrio: data.address.city_district || data.address.neighbourhood || '',
            callePrincipal: data.address.road || '',
            ciudad: data.address.city || data.address.town || data.address.village || ''
          }
        });
      }
    } catch (error) {
      console.error('Error obteniendo datos de ubicación:', error);
    }
  }


  onEstibajeChange(): void {
    this.estibajeChecked = this.detalleForm.get('estibaje')?.value;
    this.updateCantidadEstibajeState();
  }

  updateCantidadEstibajeState(): void {
    const cantidadEstibajeControl = this.detalleForm.get('cantidadEstibaje');
    if (this.estibajeChecked) {
      cantidadEstibajeControl?.enable();
    } else {
      cantidadEstibajeControl?.disable();
      cantidadEstibajeControl?.setValue(0);
    }
  }

  onSubmit(): void {
    if (this.detalleForm.valid) {
      console.log('Datos a enviar:', this.detalleForm.value);
      this.detalleTransporteService.crearDetalleTransporte(this.detalleForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Error al crear el Detalle de transporte', err);
        }
      });
    }
  }

  abrirDialogo(): void {
    const dialogRef = this.dialog.open(SelecUnidadComponent, {
      width: '95%',         // Ancho del diálogo
      height: '95%',        // Alto del diálogo
      maxWidth: '1000px',   // Tamaño máximo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detalleForm.patchValue({
          unidadId: result.id,
          unidadTipo: result.tipo,
          unidadImagen: result.imagenUrl // ✅ Sin paréntesis extra
        });
      }
    });
  }

  limpiarUnidad(): void {
    this.detalleForm.patchValue({
      unidadId: '',
      unidadTipo: '',
      unidadImagen: ''
    });
    this.abrirDialogo()
  }

  enviarAWhatsapp(): void {
    const detalles = this.detalleForm.value;

    const nombreCompleto = this.token.getFullName() || 'Nombre completo no disponible';
    const nombreComercial = this.token.getNombreComercial() || 'Nombre comercial no disponible';

    // Construir el mensaje de texto
    const mensaje = `
  Detalles de la solicitud de transporte:
  Nombre Cliente/Comercial: ${nombreCompleto} , ${ nombreComercial}
  Unidad: ${detalles.unidadTipo}
  Fecha y Hora : ${detalles.descripcionProducto}
  Tipo de Servicio: ${detalles.tipoServicio}
  Estibaje: ${detalles.estibaje ? 'Sí' : 'No'} (Cantidad: ${detalles.cantidadEstibaje})
  Dirección de Origen: ${detalles.direccionOrigen.barrio}, ${detalles.direccionOrigen.callePrincipal}, ${detalles.direccionOrigen.ciudad}
  Dirección de Destino: ${detalles.direccionDestino.barrio}, ${detalles.direccionDestino.callePrincipal}, ${detalles.direccionDestino.ciudad}
  Tipo de Pago: ${detalles.pago}
  Enlace de Google Maps (Origen): https://www.google.com/maps?q=${detalles.direccionOrigen.latitud},${detalles.direccionOrigen.longitud}
  Enlace de Google Maps (Destino): https://www.google.com/maps?q=${detalles.direccionDestino.latitud},${detalles.direccionDestino.longitud}
  `;

    // Codificar el mensaje para URL y crear el enlace
    const mensajeCodificado = encodeURIComponent(mensaje);
    const telefono = '593983724721';  // Asegúrate de cambiarlo con el número correcto
    const url = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

    // Abrir el enlace en WhatsApp
    window.open(url, '_blank');
  }


}
