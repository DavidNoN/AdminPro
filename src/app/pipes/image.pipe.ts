import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Pipe( {
         name: 'image'
       } )
export class ImagePipe implements PipeTransform {

  transform( img: string, type: 'users' | 'medics' | 'hospitals' ): string {


    if ( !img ) {
      return `${ base_url }/upload/user/no-image`;
    } else if ( img.includes( 'https' ) ) {
      return img;
    } // /upload/users/no-image
    else if ( img ) {
      return `${ base_url }/upload/${ type }/${ img }`;
      console.log( img );
    } else {
      return `${ base_url }/upload/user/no-image`;
    }
  }
}
