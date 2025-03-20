import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DetalleTransporteService} from '../../service/detalle-transporte.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MenuComponent} from '../../menu/menu.component';
import * as L from 'leaflet';
import {LatLngExpression} from 'leaflet';
import {MatDialog} from '@angular/material/dialog';
import {SelecUnidadComponent} from './selec-unidad/selec-unidad.component';
import {NgIf} from '@angular/common';
import {TokenService} from '../../service/token.service';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {MatDivider} from '@angular/material/divider';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  selectedOption: string | null = null;
  selectedOptionP: string | null = null;

  estibajeChecked: boolean = false;
  nombreCompleto: string = '';  // Almacenar el nombre completo
  nombreComercial: string = '';  // Almacenar el nombre comercial  private map!: L.Map;
  private marker!: L.Marker;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private detalleTransporteService: DetalleTransporteService,
    private router: Router,
    private dialog: MatDialog,
    private token: TokenService,
    private snackbar: MatSnackBar
  ) {
    this.detalleForm = this.fb.group({
      numOrden: [''],
      cantidadEstibaje: [0, Validators.required],
      descripcionProducto: ['', Validators.required],
      fecha: [''],
      tipoServicio: ['', Validators.required],
      estibaje: [false],
      pago: ['', Validators.required],
      direccionOrigen: this.fb.group({
        barrio: ['', Validators.required],
        callePrincipal: ['', Validators.required],
        calleSecundaria: ['', Validators.required],
        ciudad: ['', Validators.required],
        latitud: ['', Validators.required],
        longitud: ['', Validators.required],
        referencia: ['', Validators.required],
        telefono: ['', Validators.required]

      }),
      direccionDestino: this.fb.group({
        barrio: ['', Validators.required],
        callePrincipal: ['', Validators.required],
        calleSecundaria: ['', Validators.required],
        ciudad: ['', Validators.required],
        latitud: ['', Validators.required],
        longitud: ['', Validators.required],
        referencia: ['', Validators.required],
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
      // Deshabilitar el botón mientras se procesa el envío
      this.isSubmitting = true;

      console.log('Datos a enviar:', this.detalleForm.value);

      this.detalleTransporteService.crearDetalleTransporte(this.detalleForm.value).subscribe({
        next: (response) => {
          // Mostrar mensaje de éxito
          this.snackbar.open('Detalle de transporte creado con éxito', 'Cerrar', {
            duration: 3000, // Duración en milisegundos (3 segundos)
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Redirigir a la lista de detalles

          this.router.navigate(['/listarDetalleTransporte']);
          this.enviarAWhatsapp()

        },
        error: (err) => {
          // Mostrar mensaje de error
          console.error('Error al crear el detalle de transporte', err);

          // Mostrar un snackbar con mensaje de error
          this.snackbar.open('Ocurrió un error al crear el detalle de transporte. Intenta de nuevo.', 'Cerrar', {
            duration: 3000, // Duración en milisegundos (3 segundos)
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        complete: () => {
          // Volver a habilitar el botón después de procesar la respuesta
          this.isSubmitting = false;
        }
      });
    } else {
      // Si el formulario no es válido, mostrar un mensaje de error
      this.snackbar.open('Por favor, complete todos los campos obligatorios', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  onSubmit2(): void {
    if (this.detalleForm.valid) {
      // Deshabilitar el botón mientras se procesa el envío
      this.isSubmitting = true;

      console.log('Datos a enviar:', this.detalleForm.value);

      this.detalleTransporteService.crearDetalleTransporte(this.detalleForm.value).subscribe({
        next: (response) => {
          // Supongamos que la respuesta tiene los campos numGuia y fecha
          const {numOrden, fecha} = response;

          // Actualizar el formulario con los valores recibidos
          this.detalleForm.patchValue({
            numOrden: numOrden,
            fecha: fecha
          });

          // Mostrar mensaje de éxito
          this.snackbar.open('Detalle de transporte creado con éxito', 'Cerrar', {
            duration: 3000, // Duración en milisegundos (3 segundos)
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Redirigir a la lista de detalles
          this.router.navigate(['/listarDetalleTransporte']);
          this.enviarAWhatsapp();
        },
        error: (err) => {
          // Mostrar mensaje de error
          console.error('Error al crear el detalle de transporte', err);
          this.snackbar.open('Ocurrió un error al crear el detalle de transporte. Intenta de nuevo.', 'Cerrar', {
            duration: 3000, // Duración en milisegundos (3 segundos)
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        complete: () => {
          // Volver a habilitar el botón después de procesar la respuesta
          this.isSubmitting = false;
        }
      });
    } else {
      // Si el formulario no es válido, mostrar un mensaje de error
      this.snackbar.open('Por favor, complete todos los campos obligatorios', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
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
    const nombreComercial = this.token.getNombreComercial() || 'Sin Comercial ';

    // Construir el mensaje de texto
    const mensaje = `
  *📄 Nueva Solicitud de Transporte creada:* _${detalles.numOrden}_ \n
  *📄 Cliente/Comercial:* ${nombreCompleto || 'No disponible'}, ${nombreComercial || 'No disponible'}\n
  *🚚 Unidad:* ${detalles.unidadTipo || 'No disponible'} ||  *Servicio:* ${detalles.tipoServicio || 'No disponible'}\n
  *📅 Fecha creacion:* ${detalles.fecha || 'No disponible'}\n
  *📅 Fecha solicitada:* ${detalles.descripcionProducto || 'No disponible'}\n
  *📦 Estibaje:* ${detalles.estibaje ? 'SI' : 'NO'}, Cantidad:  ${detalles.cantidadEstibaje || '---'}\n
  *💰 Pago:* ${detalles.pago || 'No disponible'}\n
  *📍 Mapa (Origen):*    _https://www.google.com/maps?q=${detalles.direccionOrigen.latitud},${detalles.direccionOrigen.longitud}_
  *📍 Mapa (Destino):*   _https://www.google.com/maps?q=${detalles.direccionDestino.latitud},${detalles.direccionDestino.longitud}_
  📲 *¡Consulta más detalles en la app!*`;


    // Codificar el mensaje para URL y crear el enlace
    const mensajeCodificado = encodeURIComponent(mensaje);
    const telefono = '593997559093';  // Asegúrate de cambiarlo con el número correcto
    const url = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

    // Abrir el enlace en WhatsApp
    window.open(url, '_blank');
  }


}
