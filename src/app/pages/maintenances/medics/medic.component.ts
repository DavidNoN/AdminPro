import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicService } from '../../../services/medic.service';
import { Medic } from '../../../models/medic.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component( {
              selector: 'app-medic',
              templateUrl: './medic.component.html',
              styles: []
            } )
export class MedicComponent implements OnInit {

  public medicForm: FormGroup;
  public hospitals: Hospital[] = [];

  public medicSelected: Medic;
  public hospitalSelected: Hospital;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicService: MedicService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) {
  }

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ( { id } ) => this.loadMedic( id ) );


    this.loadHospitals();

    this.medicForm = this.fb.group( {
                                      name: [ '', Validators.required ],
                                      hospital: [ '', Validators.required ]
                                    } );

    this.medicForm.get( 'hospital' ).valueChanges.subscribe( hospitalID => {

      this.hospitalSelected = this.hospitals.find( h => h._id === hospitalID );
    } );

  }

  loadMedic( id: string ): void {

    if ( id === 'new' ) {
      return;
    }

    this.medicService.getMedicById( id )
        .pipe(
          delay(100)
        )
        .subscribe( ( medic: any ) => {

          if ( !medic ) {
            this.router.navigateByUrl( `/dashboard/medics` );
          }

          const { name, hospital: { _id } } = medic;
          this.medicSelected = medic;
          this.medicForm.setValue( { name, hospital: _id } );
        } );
  }

  loadHospitals(): void {

    this.hospitalService.loadHospitals()
        .subscribe( ( hospitals: Hospital[] ) => {
          console.log( hospitals );
          this.hospitals = hospitals;
        } );
  }

  saveMedic(): void {

    if ( this.medicSelected ) {
      // Update
      const data = {
        ...this.medicForm.value,
        _id: this.medicSelected._id
      };
      this.medicService.updateMedic( data )
          .subscribe( () => {
            Swal.fire( 'Updated', `${ name } updated successfully`, 'success' );
          } );

    } else {

      // Create

      const { name } = this.medicForm.value;
      this.medicService.createMedic( this.medicForm.value )
          .subscribe( ( resp: any ) => {
            Swal.fire( 'Created', `${ name } created successfully`, 'success' );
            this.router.navigateByUrl( `/dashboard/medic/${ resp.medic._id }` );
          } );
    }


  }

}
