import { Component } from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';

@Component({
  selector: 'app-detalle',
  imports: [
    MenuComponent
  ],
  templateUrl: './detalle.component.html',
  standalone: true,
  styleUrl: './detalle.component.css'
})
export class DetalleComponent {

}
