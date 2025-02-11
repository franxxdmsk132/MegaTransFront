import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,

  ],
  styleUrls: ['./app.component.css']  // Corregir de styleUrl a styleUrls
})
export class AppComponent {
  title = 'MegaTransFront';
}
