import {Component, OnInit, ViewChild} from '@angular/core';
import { TokenService } from '../service/token.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [RouterLink
    , NgIf,
    MatSidenavContainer
    , MatIcon
    , MatToolbar
    , MatNavList
    , MatSidenav
    , MatIconButton
    , MatListItem,
    MatSidenavModule],
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isLogged = false;
  isAdmin = false;
  isEmpl = false;
  isDesp = false;
  isUser = false

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    this.isLogged = !!this.tokenService.getToken();
    this.isAdmin = this.isLogged && this.tokenService.isAdmin();
    this.isEmpl = this.isLogged && this.tokenService.isEmpl();
    this.isDesp= this.isLogged && this.tokenService.isDesp();
    this.isUser = this.isLogged && this.tokenService.isUser();

  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}
