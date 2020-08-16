import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Data, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component( {
              selector: 'app-breadcrumbs',
              templateUrl: './breadcrumbs.component.html',
              styles: []
            } )
export class BreadcrumbsComponent implements OnDestroy {

  public title: string;
  public titleSub$: Subscription;

  constructor( private router: Router ) {



    this.titleSub$ = this.getRouteArguments()
      .subscribe( ( { title } ) => {
        this.title = title;
        document.title = `AdminPro - ${ title }`;
      } );
  }

  getRouteArguments(): Observable<Data> {
    return this.router.events
               .pipe(
                 filter( event => event instanceof ActivationEnd ),
                 filter( ( event: ActivationEnd ) => event.snapshot.firstChild === null ),
                 map( ( event: ActivationEnd ) => event.snapshot.data )
               );

  }

  ngOnDestroy(): void {
    this.titleSub$.unsubscribe();
  }


}
