import { Component } from '@angular/core';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.component.html',
  standalone: true,
  imports: [
    MenuComponent
  ],
  styleUrl: './acerca.component.css'
})
export class AcercaComponent {

}
