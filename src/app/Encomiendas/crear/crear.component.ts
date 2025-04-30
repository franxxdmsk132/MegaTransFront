import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TokenService} from '../../service/token.service';
import {DetalleEncomiendaService} from '../../service/detalle-encomienda.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import * as L from 'leaflet';
import {LatLngExpression} from 'leaflet';
import {Rutas} from '../../Rutas/rutas';
import {RutaService} from '../../service/ruta-service';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {map, Observable, startWith, Subscription} from 'rxjs';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {MatDivider} from '@angular/material/divider';
import { WebsocketService } from '../../service/websocket.service';
import { WaitingForApprovalComponent } from '../../blocking-modal/waiting-for-approval.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

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
    NgIf,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatError,
    NgForOf,
    MatOption,
    MatAutocomplete,
    MatAutocompleteTrigger,
    AsyncPipe,
    MatChipListbox,
    MatChipOption,
    MatDivider,
    MatInputModule,
    MatFormFieldModule,
  ],
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit {
  private readonly _wsSvc: WebsocketService = inject(WebsocketService);
  displayedColumns: string[] = ['tipoProducto', 'alto', 'ancho', 'largo', 'peso', 'fragil', 'acciones'];
  selectedOption: string | null = null;
  detalleEncomienda: FormGroup;
  fragilChecked: boolean = false;
  currentDate: string
  rutas: Rutas[] = [];
  isSubmitting = false;
  filteredRutas?: Observable<Rutas[]> = new Observable();  // Rutas filtradas
// Lista para almacenar las rutas
  private marker!: L.Marker;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private token: TokenService,
    private detalleEncomiendaService: DetalleEncomiendaService,
    private rutasService: RutaService  // Inyectar el servicio de rutas

  ) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.detalleEncomienda = this.fb.group({
      numGuia: [''],
      latitudOrg: ['', Validators.required],
      longitudOrg: ['', Validators.required],
      dirRemitente: ['', Validators.required],
      nombreD: ['', Validators.required],
      apellidoD: ['', Validators.required],
      identificacionD: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(13),Validators.minLength(10)]],
      telfBeneficiario: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10),Validators.minLength(10)]],
      telfEncargado: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10),Validators.minLength(10)]],
      correoD: ['', [Validators.required, Validators.email]],
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
  // Método para filtrar las rutas
  private filterRutas(value: string): Rutas[] {
    const filterValue = value.toLowerCase();
    return this.rutas.filter(ruta =>
      (ruta.origen + ' - ' + ruta.destino).toLowerCase().includes(filterValue)
    );
  }
// Crear un nuevo grupo de formulario para un producto
  createProducto(): FormGroup {
    return this.fb.group({
      tipoProducto: ['', Validators.required],
      alto: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      ancho: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      largo: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      peso: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      fragil: [false]
    });
  }


  // Obtener el FormArray de productos
  get productos() {
    return (this.detalleEncomienda.get('productosDto') as FormArray);
  }

// Método que verifica si la ruta ingresada es válida
  validateRuta(value: string): void {
    const matchingRutas = this.filterRutas(value); // Obtén las rutas que coinciden con el valor ingresado
    if (matchingRutas.length === 0) {
      // Si no hay coincidencias, borrar el valor del campo
      this.detalleEncomienda.patchValue({
        ruta: ''  // Borra el valor del campo de ruta
      });

      // Opcional: Mostrar un mensaje de advertencia
      this.showSnackbar('Ruta no válida. Por favor, seleccione una ruta de la lista.', 'Advertencia');
    }
  }

  // Agregar un nuevo producto
  addProducto(): void {
    this.productos.push(this.createProducto());
  }

  // Eliminar un producto
  removeProducto(index: number): void {
    this.productos.removeAt(index);
  }

  onSubmit(): void {
    if (this.detalleEncomienda.valid) {
      console.log('Datos a enviar:', this.detalleEncomienda.value);  // Verifica aquí los valores antes de enviarlos
      this.detalleEncomiendaService.crearDetalleEncomienda(this.detalleEncomienda.value).subscribe({
        next: (response) => {
          this.router.navigate(['/listEncomienda']);
        },
        error: (err) => {
          console.error('Error al crear el Detalle de transporte', err);
        }
      });
    } else {
      console.error('Formulario inválido', this.detalleEncomienda.errors);
    }
  }
  onSubmit2(): void {
    // Aquí puedes agregar la lógica para enviar el mensaje al WebSocket);
    if (this.detalleEncomienda.valid) {
      this.isSubmitting = true;

      console.log('Datos a enviar:', this.detalleEncomienda.value);

      this.detalleEncomiendaService.crearDetalleEncomienda(this.detalleEncomienda.value).subscribe({
        next: (response) => {

          const {
            id,
            numGuia,
            fecha,
            ruta,
            latitudOrg,
            longitudOrg,
            latitudDestino,
            longitudDestino} = response;
          this.detalleEncomienda.patchValue({
            numGuia: numGuia,
            fecha: fecha,
            ruta : ruta,
            latitudOrg: latitudOrg,
            longitudOrg: longitudOrg,
            latitudDestino: latitudDestino,
            longitudDestino: longitudDestino
          });

          this._wsSvc.sendRequest({
            encomienda: id,
            estado: false,
            ruta: ruta,
            longitudOrg: longitudOrg,
            latitudOrg: latitudOrg,
            latitudDestino: latitudDestino,
            longitudDestino: longitudDestino,
            numGuia: numGuia,
            username: this.token.getFullName() || 'Usuario no disponible',
            email: this.token.getUserName() || 'Email no disponible',
            telf: this.token.getTelefono() || 'Telefono no disponible',

          });

          const dialogRef = this.dialog.open(WaitingForApprovalComponent, {
            disableClose: true,
          });

          this._wsSvc.adminMessage$.subscribe((message) => {
            dialogRef.close();
            if (message.estado) {
              this.snackBar.open('Solicitud aceptada', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
            } else {
              this.snackBar.open('Solicitud denegada', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
            }
          });

           this.router.navigate(['/listaEncomienda']);

          // Enviar mensaje a WhatsApp
          this.enviarAWhatsapp();
        },
        error: (err) => {
          console.error('Error al crear la encomienda', err);
          this.snackBar.open('Ocurrió un error al crear la encomienda. Intenta de nuevo.', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.snackBar.open('Por favor, complete todos los campos obligatorios', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }



  ngOnInit(): void {
    this.initMap('mapOrigen', 'latitudOrg', 'longitudOrg');
    this.initMap('mapDestino', 'latitudDestino', 'longitudDestino');
    this.getRutas();
    this.filteredRutas = this.detalleEncomienda.get('ruta')?.valueChanges.pipe(
      startWith(''),  // Comienza con un valor vacío
      map(value => {
        this.validateRuta(value);  // Validar la ruta
        return this.filterRutas(value);  // Filtra las rutas conforme el usuario escribe
      })
    );
  }
  // Obtener las rutas
  getRutas(): void {
    this.rutasService.getRutas().subscribe({
      next: (rutas: Rutas[]) => {
        this.rutas = rutas;  // Asignamos las rutas a la variable rutas
      },
      error: (err) => {
        console.error('Error al obtener las rutas', err);
        this.showSnackbar('Error al obtener las rutas', 'Error');
      }
    });
  }
  // Método para mostrar mensajes de error con Snackbar
// Método para mostrar mensajes de error con Snackbar
  showSnackbar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,  // Duración del Snackbar (en milisegundos)
      verticalPosition: 'top',  // Posición vertical
      horizontalPosition: 'right',  // Posición horizontal
    });
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
  enviarAWhatsapp(): void {
    const productos = this.detalleEncomienda.value.productosDto;

    let mensaje = `📦 Nueva Encomienda creada 🚛\n`; // Inicializamos mensaje

    const detalles = this.detalleEncomienda.value;
    const nombreCompleto = this.token.getFullName() || 'Nombre completo no disponible';
    const nombreComercial = this.token.getNombreComercial() || 'Sin Comercial ';
    const telefonoDestino = '593997559093'; // Reemplaza con el número de WhatsApp de destino

    mensaje += `
  - 📅 *Fecha:* _${detalles.fecha}_
  - 📄 *Número de Guia:* _${detalles.numGuia}_
  - 📄 *Ruta:* ${detalles.ruta}
  - 📄 *Cliente/Comercial:* ${nombreCompleto || 'No disponible'}, ${nombreComercial || 'No disponible'}\n
  - 📍 *Mapa (Recoleccion):*    _(https://www.google.com/maps?q=${detalles.latitudOrg},${detalles.longitudOrg})_
  - 📍 *Mapa (Entrega):*   _(https://www.google.com/maps?q=${detalles.latitudDestino},${detalles.longitudDestino})_

  - 💰 *Tipo Entrega:* ${detalles.tipoEntrega}
`;


    // Añadir detalles de productos al mensaje
    productos.forEach((producto: any) => {
      mensaje += `
      *Productos:*
      *Tipo:* ${producto.tipoProducto},
      *Alto:* ${producto.alto} cm,
      *Ancho:* ${producto.ancho} cm,
      *Largo:* ${producto.largo} cm,
      *Peso:* ${producto.peso} kg,
      *Fragil:* ${producto.fragil ? 'Sí' : 'No'}\n`;
    });

    // Añadir mensaje final
    mensaje += `📲 *¡Su solictud a sido recibida!  En minutos le indicamos el valor de su envio*`;

    // Codificar el mensaje para la URL de WhatsApp
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefonoDestino}&text=${mensajeCodificado}`;

    // Abrir el enlace en una nueva ventana
    // window.open(urlWhatsApp, '_blank');
    // ENVÍA EL MENSAJE AL SERVIDOR
    this.http.post(environment.chatbot + '/enviar-grupo', {
      grupoId: '120363399820920449@g.us', // ID real del grupo que viste en consola
      mensaje: mensaje
    }).subscribe({
      next: () => console.log('✅ Mensaje enviado correctamente'),
      error: (err) => console.error('❌ Error al enviar mensaje', err)
    });
  }






}
