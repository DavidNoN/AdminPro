import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';


@Component( {
              selector: 'app-register',
              templateUrl: './register.component.html',
              styleUrls: [ './register.component.css' ]
            } )
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group( {
                                         name: [ 'David Arcila', [ Validators.required, Validators.minLength( 8 ) ] ],
                                         email: [ 'David@david.com', [ Validators.required, Validators.email ] ],
                                         password: [ 'password', [ Validators.required ] ],
                                         passwordRepeat: [ 'password', [ Validators.required ] ],
                                         terms: [ false, [ Validators.requiredTrue ] ],
                                       }, {
                                         validators: this.passwordMatchValidator( 'password', 'passwordRepeat' )
                                       } );

  constructor( private fb: FormBuilder,
               private userService: UserService,
               private router: Router ) {
  }

  createUser(): void {
    this.formSubmitted = true;
    console.log( this.registerForm );

    if ( this.registerForm.invalid ) {
      return;
    }

    // Posting user
    this.userService.createUser( this.registerForm.value )
        .subscribe( resp => {
          // Navigate to Dashboard
          this.router.navigateByUrl( '/login' );
        } );
  }

  noValidField( field: string ): boolean {
    return this.registerForm.get( field ).invalid && this.formSubmitted;
  }

  passwordMatch(): boolean {
    const password = this.registerForm.get( 'password' ).value;
    const passwordRepeat = this.registerForm.get( 'passwordRepeat' ).value;

    return ( password !== passwordRepeat ) && this.formSubmitted;

  }

  acceptTerms(): boolean {
    return !this.registerForm.get( 'terms' ).value && this.formSubmitted;
  }

  passwordMatchValidator( password: string, passwordRepeat: string ): any {

    return ( formGroup: FormGroup ) => {
      const passwordControl = formGroup.get( password );
      const passwordRepeatControl = formGroup.get( passwordRepeat );

      if ( passwordControl.value === passwordRepeatControl.value ) {
        passwordRepeatControl.setErrors( null );
      } else {
        passwordRepeatControl.setErrors( { isNotEqual: true } );
      }
    };
  }


}
