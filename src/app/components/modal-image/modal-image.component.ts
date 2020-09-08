import { Component, OnInit } from '@angular/core';
import { ModalImageService } from '../../services/modal-image.service';
import Swal from 'sweetalert2';
import { FileUploadService } from '../../services/file-upload.service';

@Component( {
              selector: 'app-modal-image',
              templateUrl: './modal-image.component.html',
              styles: []
            } )
export class ModalImageComponent implements OnInit {

  public imageUpload: File;
  public imgTemp: any = null;

  constructor( public modalImageService: ModalImageService,
               public fileUploadService: FileUploadService ) {
  }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.imgTemp = null;
    this.modalImageService.closeModal();
  }

  changeImage( file: File ): void {
    this.imageUpload = file;

    if ( !file ) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  uploadImage(): void {

    const id = this.modalImageService.id;
    const type = this.modalImageService.type;

    this.fileUploadService.updatePhoto( this.imageUpload, type, id )
        .then( img => {
          Swal.fire( 'Saved', 'User profile image was updated', 'success' );

          this.modalImageService.newImage.emit( img );

          this.closeModal();
        } ).catch( error => {
      console.log( error );
      Swal.fire( 'Error', 'Image could not uploaded', 'error' );
    } );
  }

}
