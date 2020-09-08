import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImageService } from '../../../services/modal-image.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user.model';
import { SearchesService } from '../../../services/searches.service';

@Component( {
              selector: 'app-hospitals',
              templateUrl: './hospitals.component.html',
              styles: []
            } )
export class HospitalsComponent implements OnInit, OnDestroy {

  public hospitals: Hospital[] = [];
  public loading = true;
  private imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
               private modalImageService: ModalImageService,
               private searchService: SearchesService) {

    this.loading = true;
  }

  ngOnInit(): void {
    this.loadHospitals();

    this.imgSubs = this.modalImageService.newImage
                       .pipe(
                         delay( 100 )
                       )
                       .subscribe( () => this.loadHospitals() );
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  search( term: string ): void {

    if ( term.length === 0 ) {
      return this.loadHospitals();
    }

    this.searchService.search( 'hospitals', term )
        .subscribe( results => {
          this.hospitals = results;
        } );
  }

  loadHospitals(): void {
    this.hospitalService.loadHospitals()
        .subscribe( hospitals => {
          this.loading = false;
          this.hospitals = hospitals;
        } );
  }

  saveChanges( hospital: Hospital ): any {

    this.hospitalService.updateHospital( hospital._id, hospital.name )
        .subscribe( () => {
          Swal.fire( 'Updated', hospital.name, 'success' );
        } );

  }

  deleteHospital( hospital: Hospital ): any {

    this.hospitalService.deleteHospital( hospital._id )
        .subscribe( () => {
          this.loadHospitals();
          Swal.fire( 'Borrado', hospital.name, 'success' );
        } );

  }

  async openSweetModal(): Promise<void> {
    const { value = '' } = await Swal.fire<string>( {
                                                 title: 'Add hospital',
                                                 text: 'Enter the hospital\'s name',
                                                 input: 'text',
                                                 inputPlaceholder: 'Hospital\'s name',
                                                 showCancelButton: true
                                               } );

    if ( value.trim().length > 0 ) {
      this.hospitalService.createHospital( value )
          .subscribe( ( resp: any ) => {
            this.hospitals.push( resp.hospital );
          } );
    }
  }

  openModal( hospital: Hospital ): void {
    this.modalImageService.openModal( 'hospitals', hospital._id, hospital.img );
  }


}
