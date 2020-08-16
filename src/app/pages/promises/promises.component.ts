import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styles: []
} )
export class PromisesComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

    this.getUsers().then( users => {
      console.log( users );
    } );

    //   const promise = new Promise( ( resolve, reject ) => {
    //
    //     if ( true ) {
    //       resolve( 'Hello World' );
    //     } else {
    //       reject( 'Something went wrong' );
    //     }
    //
    //   } );
    //
    //   promise.then( ( message ) => {
    //     console.log( message );
    //   } )
    //     .catch( err => console.log( 'error' ) );
  }

  getUsers(): Promise<any> {

    const promise = new Promise<any>( resolve => {
      fetch( 'https://reqres.in/api/users' )
        .then( resp => resp.json() )
        .then( body => resolve( body.data ) );
    } );

    return promise;


  }
}
