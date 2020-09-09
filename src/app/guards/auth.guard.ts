import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable( {
               providedIn: 'root'
             } )
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private userService: UserService,
               private router: Router ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ): any {

    return this.userService.validateToken()
               .pipe(
                 tap( isAuthenticated => {

                   if ( !isAuthenticated ) {
                     this.router.navigateByUrl( '/login' );
                   }
                 } )
               );
  }

  canLoad( route: Route, segments: import('@angular/router').UrlSegment[] ): boolean | import('@angular/router').UrlTree {

    return this.userService.validateToken()
               .pipe(
                 tap( isAuthenticated => {

                   if ( !isAuthenticated ) {
                     this.router.navigateByUrl( '/login' );
                   }
                 } )
               );
  }

}
