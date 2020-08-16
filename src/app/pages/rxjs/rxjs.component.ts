import { Component, OnDestroy } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

@Component( {
              selector: 'app-rxjs',
              templateUrl: './rxjs.component.html',
              styles: []
            } )
export class RxjsComponent implements OnDestroy{

  public intervalSubs: Subscription;

  constructor() {


    // this.returnObservable().pipe(
    //   retry( 1 )
    // ).subscribe( value => console.log( 'Subs:', value ),
    //              error => console.warn( 'Error:', error ),
    //              () => console.log( 'Obs finished' )
    // );

    this.intervalSubs = this.returnInterval().subscribe( console.log );
  }

  returnInterval(): Observable<number> {

    return interval( 1000 )
      .pipe(
        take( 10 ),
        map( value => value + 1 ),
        filter( value => ( value % 2 === 0 ) )
      );

  }

  returnObservable(): Observable<number> {
    return new Observable<number>( observer => {

      let i = -1;

      const intervalOne = setInterval( () => {

        i++;
        observer.next( i );

        if ( i === 4 ) {
          clearInterval( intervalOne );
          observer.complete();
        }

      }, 1000 );
    } );
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

}
