import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

declare const gapi: any;

const base_url = environment.base_url;


@Injectable( {
               providedIn: 'root'
             } )
export class UserService {

  public auth2: any;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {
    this.googleInit().then( undefined );
  }


  googleInit(): Promise<any> {

    return new Promise( resolve => {
      gapi.load( 'auth2', () => {
        this.auth2 = gapi.auth2.init( {
                                        client_id: '659538309022-pfniknj82ossg90p366hv3rugi7flt34.apps.googleusercontent.com',
                                        cookiepolicy: 'single_host_origin',
                                      } );
        resolve();

      } );
    } );

  }

  logout(): void {
    localStorage.removeItem( 'token' );

    this.auth2.signOut().then( () => {

      this.ngZone.run( () => {
        this.router.navigateByUrl( '/login' );
      } );

    } );
  }


  validateToken(): any {
    const token = localStorage.getItem( 'token' ) || '';

    return this.http.get( `${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    } ).pipe(
      tap( ( resp: any ) => {
        localStorage.setItem( 'token', resp.token );
      } ),
      map( () => true ),
      catchError( () => of( false ) )
    );
  }


  createUser( formData: RegisterForm ): Observable<any> {

    return this.http.post( `${ base_url }/users`, formData )
               .pipe(
                 tap( ( resp: any ) => {
                   localStorage.setItem( 'token', resp.token );
                 } )
               );

  }

  login( formData: LoginForm ): Observable<any> {

    return this.http.post( `${ base_url }/login`, formData )
               .pipe(
                 tap( ( resp: any ) => {
                   localStorage.setItem( 'token', resp.token );
                 } )
               );

  }

  loginGoogle( token ): Observable<any> {

    return this.http.post( `${ base_url }/login/google`, { token } )
               .pipe(
                 tap( ( resp: any ) => {
                   localStorage.setItem( 'token', resp.token );
                 } )
               );

  }
}
