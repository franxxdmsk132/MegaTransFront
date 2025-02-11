import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProdGuardService implements CanActivate {

  realRol: string="";

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data['expectedRoles']; // Asegura que expectedRoles es un array
    const roles = this.tokenService.getAuthorities();
    let hasAccess = false;

    roles.forEach(rol => {
      if (expectedRoles.includes(rol)) { // Ahora expectedRoles es tratado como array
        hasAccess = true;
      }
    });

    if (!this.tokenService.getToken() || !hasAccess) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   const expectedRol = route.data.expectedRol;
  //   const roles = this.tokenService.getAuthorities();
  //   this.realRol = 'user';
  //   roles.forEach(rol => {
  //     if (rol === 'ROLE_ADMIN') {
  //       this.realRol = 'admin';
  //     }
  //   });
  //   if (!this.tokenService.getToken() || expectedRol.indexOf(this.realRol) === -1) {
  //     this.router.navigate(['/']);
  //     return false;
  //   }
  //   return true;
  // }
}
