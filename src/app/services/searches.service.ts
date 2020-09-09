import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadUser } from '../interfaces/load-users.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Hospital } from '../models/hospital.model';
import { Medic } from '../models/medic.model';

const base_url = environment.base_url;

@Injectable( {
               providedIn: 'root'
             } )
export class SearchesService {

  constructor( private http: HttpClient ) {
  }

  get token(): string {
    return localStorage.getItem( 'token' ) || '';
  }

  get headers(): any {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private transformUsers( results: any[] ): User[] {

    return results.map(
      user => new User( user.name, user.email, '', user.role, user.google, user.img, user.uid )
    );
  }


  private transformHospitals( results: any[] ): Hospital[] {

    return results;
  }

  private transformMedics( results: any[] ): Medic[] {

    return results;
  }


  globalSearch( term: string ): Observable<any> {
    const url = `${ base_url }/todo/${ term }`;
    return this.http.get<any[]>( url, this.headers );
  }

  search( type: 'users' | 'medics' | 'hospitals',
          term: string ): Observable<any> {
    const url = `${ base_url }/todo/collection/${ type }/${ term }`;
    return this.http.get<any[]>( url, this.headers )
               .pipe(
                 map( ( resp: any ) => {

                   switch ( type ) {
                     case 'users':
                       return this.transformUsers( resp.results );
                     case 'hospitals':
                       return this.transformHospitals( resp.results );
                     case 'medics':
                       return this.transformMedics( resp.results );
                     default:
                       return [];
                   }

                 } )
               );
  }
}


