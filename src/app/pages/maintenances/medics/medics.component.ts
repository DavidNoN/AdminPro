import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicService } from '../../../services/medic.service';
import { Medic } from '../../../models/medic.model';
import { ModalImageService } from '../../../services/modal-image.service';
import { SearchesService } from '../../../services/searches.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component( {
              selector: 'app-medics',
              templateUrl: './medics.component.html',
              styles: []
            } )
export class MedicsComponent implements OnInit, OnDestroy {

  public medics: Medic[] = [];
  public loading = true;
  private imgSubs: Subscription;

  constructor( private medicService: MedicService,
               private modalImageService: ModalImageService,
               private searchService: SearchesService ) {
  }

  ngOnInit(): void {
    this.loadMedics();

    this.imgSubs = this.modalImageService.newImage
                       .pipe(
                         delay( 100 )
                       )
                       .subscribe( () => this.loadMedics() );
  }


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  loadMedics(): void {
    this.loading = true;
    this.medicService.loadMedics().subscribe( medics => {
      this.loading = false;
      this.medics = medics;
    } );
  }

  openModal( medic: Medic ): void {

    this.modalImageService.openModal( 'medics', medic._id, medic.img );
  }

  search( term: string ): void {

    if ( term.length === 0 ) {
      return this.loadMedics();
    }

    this.searchService.search( 'medics', term )
        .subscribe( results => {
          this.medics = results;
        } );
  }

  deleteMedic( medic: Medic ): void {

    Swal.fire( {
                 title: 'Delete medic?',
                 text: `You are about to delete to ${ medic.name }`,
                 icon: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#3085d6',
                 cancelButtonColor: '#d33',
                 confirmButtonText: 'Yes, delete it!'
               } ).then( ( result ) => {
      if ( result.isConfirmed ) {

        this.medicService.deleteMedic( medic._id )
            .subscribe( resp => {
              this.loadMedics();
              Swal.fire(
                'User deleted',
                `${ medic.name } was deleted successfully`,
                'success'
              );

            } );
      }
    } );

  }

}
