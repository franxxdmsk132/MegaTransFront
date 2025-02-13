import { Component } from '@angular/core';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [
    MenuComponent
  ],
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

}
