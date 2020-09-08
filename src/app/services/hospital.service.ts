import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable( {
               providedIn: 'root'
             } )
export class HospitalService {

  constructor( private http: HttpClient,
               private router: Router ) {
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

  loadHospitals( ): Observable<Hospital[]> {

    const url = `${ base_url }/hospitals`;
    return this.http.get( url, this.headers )
               .pipe(
                 map( ( resp: any ) => resp.hospitals )
               );
  }

  createHospital( name: string ): Observable<any> {

    const url = `${ base_url }/hospitals`;
    return this.http.post( url, { name }, this.headers );
  }

  updateHospital( id: string, name: string ): Observable<any> {

    const url = `${ base_url }/hospitals/${ id }`;
    return this.http.put( url, { name }, this.headers );
  }

  deleteHospital( id: string ): Observable<any> {

    const url = `${ base_url }/hospitals/${ id }`;
    return this.http.delete( url, this.headers );
  }

}
