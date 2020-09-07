import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

declare const gapi: any;

const base_url = environment.base_url;


@Injectable( {
               providedIn: 'root'
             } )
export class UserService {

  public auth2: any;
  public user: User;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem( 'token' ) || '';
  }

  get uid(): string {
    return this.user.uid || '';
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

    console.log(this.token);
    return this.http.get( `${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    } ).pipe(
      map( ( resp: any ) => {

        const {
          email,
          google,
          name,
          role,
          img = '',
          uid
        } = resp.user;

        this.user = new User( name, email, '', role, google, img, uid );
        localStorage.setItem( 'token', resp.token );
        return true;
      } ),
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

  updateProfile( data: { email: string, name: string, role: string } ): Observable<any> {

    data = {
      ...data,
      role: this.user.role
    };

    return this.http.put( `${ base_url }/users/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    } );
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
