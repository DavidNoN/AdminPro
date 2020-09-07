import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component( {
              selector: 'app-profile',
              templateUrl: './profile.component.html',
              styles: []
            } )
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User;
  public imageUpload: File;
  public imgTemp: any = null;

  constructor( private fb: FormBuilder,
               private userService: UserService,
               private fileUploadService: FileUploadService ) {

    this.user = userService.user;
  }

  ngOnInit(): void {

    this.profileForm = this.fb.group( {
                                        name: [ this.user.name, Validators.required ],
                                        email: [ this.user.email, [ Validators.required, Validators.email ] ]
                                      } );
  }

  updateProfile(): void {
    this.userService.updateProfile( this.profileForm.value )
        .subscribe( () => {
          const { name, email } = this.profileForm.value;
          this.user.name = name;
          this.user.email = email;

          Swal.fire( 'Saving', 'Changes were saved', 'success' );
        }, ( error ) => {
          Swal.fire( 'Error', error.error.msg, 'error' );
        } );
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
    this.fileUploadService.updatePhoto( this.imageUpload, 'users', this.user.uid )
        .then( img => {
          this.user.img = img;
          Swal.fire( 'Saved', 'User profile image was updated', 'success' );
        } ).catch( error => {
      console.log( error );
      Swal.fire( 'Error', 'Image could not uploaded', 'error' );
    } );
  }

}
