import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Medic } from '../models/medic.model';

const base_url = environment.base_url;

@Injectable( {
               providedIn: 'root'
             } )
export class MedicService {

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

  loadMedics(): Observable<Medic[]> {

    const url = `${ base_url }/medics`;
    return this.http.get( url, this.headers )
               .pipe(
                 map( ( resp: any ) => resp.medics )
               );
  }

  getMedicById( id: string ): Observable<Medic[]> {
    const url = `${ base_url }/medics/${ id }`;
    return this.http.get( url, this.headers )
               .pipe(
                 map( ( resp: any ) => resp.medic )
               );
  }

  createMedic( medic: { name: string, hospital: string } ): Observable<any> {

    const url = `${ base_url }/medics`;
    return this.http.post( url, medic, this.headers );
  }

  updateMedic( medic: Medic ): Observable<any> {

    const url = `${ base_url }/medics/${ medic._id }`;
    return this.http.put( url, medic, this.headers );
  }

  deleteMedic( id: string ): Observable<any> {

    const url = `${ base_url }/medics/${ id }`;
    return this.http.delete( url, this.headers );
  }
}
