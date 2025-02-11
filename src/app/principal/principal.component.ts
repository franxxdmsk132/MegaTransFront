import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { MenuComponent } from '../menu/menu.component';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  standalone: true,
  imports: [
    MenuComponent,
    NgIf,
    RouterLink,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardModule,
    MatDividerModule
  ],
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  isLogged = false;
  nombreUsuario = '';
  nombreCompleto = '';

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.nombreCompleto = this.tokenService.getFullName();
    } else {
      this.isLogged = false;
      this.nombreCompleto = '';
    }
  }
}
