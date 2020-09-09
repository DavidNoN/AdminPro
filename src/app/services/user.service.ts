import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoadUser } from '../interfaces/load-users.interface';
import Swal from 'sweetalert2';

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

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.user.role;
  }

  get headers(): any {
    return {
      headers: {
        'x-token': this.token
      }
    };
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

  saveLocalStorage( token: string, menu: any ): void {
    localStorage.setItem( 'token', token );
    localStorage.setItem( 'menu', JSON.stringify( menu ) );
  }

  logout(): void {
    localStorage.removeItem( 'token' );

    localStorage.removeItem( 'menu' );

    this.auth2.signOut().then( () => {

      this.ngZone.run( () => {
        this.router.navigateByUrl( '/login' );
      } );

    } );
  }


  validateToken(): any {

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

        this.saveLocalStorage( resp.token, resp.menu );

        return true;
      } ),
      catchError( () => of( false ) )
    );
  }


  createUser( formData: RegisterForm ): Observable<any> {

    return this.http.post( `${ base_url }/users`, formData )
               .pipe(
                 tap( ( resp: any ) => {
                   this.saveLocalStorage( resp.token, resp.menu );
                 }, error => {
                   Swal.fire( error.error.msg, error.error.msg, 'error');
                 } )
               );

  }

  updateProfile( data: { email: string, name: string, role: string } ): Observable<any> {

    data = {
      ...data,
      role: this.user.role
    };

    return this.http.put( `${ base_url }/users/${ this.uid }`, data, this.headers );
  }

  login( formData: LoginForm ): Observable<any> {

    return this.http.post( `${ base_url }/login`, formData )
               .pipe(
                 tap( ( resp: any ) => {
                   this.saveLocalStorage( resp.token, resp.menu );
                 }, error => {
                   Swal.fire( error.error.msg, error.error.msg, 'error');
                      } )
               );

  }

  loginGoogle( token ): Observable<any> {

    return this.http.post( `${ base_url }/login/google`, { token } )
               .pipe(
                 tap( ( resp: any ) => {
                   this.saveLocalStorage( resp.token, resp.menu );
                 } )
               );

  }

  loadUsers( from: number = 0 ): Observable<any> {

    const url = `${ base_url }/users?from=${ from }`;
    return this.http.get<LoadUser>( url, this.headers )
               .pipe(
                 delay( 300 ),
                 map( resp => {
                   const users = resp[ `users` ].map(
                     user => new User( user.name, user.email, '', user.role, user.google, user.img, user.uid ) );
                   return {
                     total: resp[ `total` ],
                     users
                   };
                 } )
               );
  }

  deleteUser( user: User ): Observable<any> {

    const url = `${ base_url }/users/${ user.uid }`;
    return this.http.delete( url, this.headers );

  }

  saveUser( user: User ): Observable<any> {
    return this.http.put( `${ base_url }/users/${ user.uid }`, user, this.headers );
  }
}
