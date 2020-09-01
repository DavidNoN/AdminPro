import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component( {
              selector: 'app-login',
              templateUrl: './login.component.html',
              styleUrls: [ './login.component.css' ]
            } )
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group( {
                                      email: [ localStorage.getItem( 'email' ) || '', [ Validators.required, Validators.email ] ],
                                      password: [ '', [ Validators.required ] ],
                                      rememberMe: [ this.rememberMe ]
                                    } );

  constructor( private router: Router,
               private fb: FormBuilder,
               private userService: UserService,
               private ngZone: NgZone ) {
    this.rememberMe();
  }


  login(): void {

    this.userService.login( this.loginForm.value )
        .subscribe( () => {
          if ( this.loginForm.get( 'rememberMe' ).value ) {
            localStorage.setItem( 'email', this.loginForm.get( 'email' ).value );
          } else {
            localStorage.removeItem( 'email' );
          }

          // Navigate to Dashboard
          this.router.navigateByUrl( '/' );
        }, ( err ) => {
          Swal.fire( 'Error', err.error.msg, 'error' );
        } );
  }

  rememberMe(): void {
    if ( localStorage.getItem( 'email' ) ) {
      this.loginForm.get( 'rememberMe' ).setValue( true );
    } else {
      this.loginForm.get( 'rememberMe' ).setValue( false );
    }
  }


  async renderButton(): Promise<any> {
    gapi.signin2.render( 'my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark'
    } );

    await this.startApp();
  }

  async startApp(): Promise<any> {

    await this.userService.googleInit();
    this.auth2 = this.userService.auth2;

    this.attachSignIn( document.getElementById( 'my-signin2' ) );
  }

  attachSignIn( element ): void {

    this.auth2.attachClickHandler( element, {},
                                   ( googleUser ) => {
                                     const id_token = googleUser.getAuthResponse().id_token;
                                     console.log( id_token );
                                     this.userService.loginGoogle( id_token ).subscribe( async () => {
                                       // Navigate to Dashboard
                                       await this.ngZone.run( () => {
                                         this.router.navigateByUrl( '/' );
                                       } );
                                     } );


                                   }, ( error ) => {
        alert( JSON.stringify( error, undefined, 2 ) );
      } );
  }

  async ngOnInit(): Promise<any> {
    await this.renderButton();
  }

}
