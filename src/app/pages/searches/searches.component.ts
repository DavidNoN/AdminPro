import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchesService } from '../../services/searches.service';
import { Medic } from '../../models/medic.model';
import { Hospital } from '../../models/hospital.model';
import { User } from '../../models/user.model';

@Component( {
              selector: 'app-searches',
              templateUrl: './searches.component.html',
              styles: []
            } )
export class SearchesComponent implements OnInit {

  public users: User[] = [];
  public medics: Medic[] = [];
  public hospitals: Hospital[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private searchService: SearchesService ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params
        .subscribe( ( { term } ) => this.globalSearch( term ) );
  }

  globalSearch( term: string ): void {

    this.searchService.globalSearch( term )
        .subscribe( ( resp: any ) => {
          console.log( resp );
          this.users = resp.users;
          this.medics = resp.medics;
          this.medics = resp.medics;
        } );
  }


}
