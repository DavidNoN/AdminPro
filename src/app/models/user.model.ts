import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class User {

  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public role?: string,
    public google?: boolean,
    public img?: string,
    public uid?: string
  ) {
  }

  get imageUrl(): string {

    if ( this.img.includes('https')){
      return this.img;
    }

    // /upload/users/no-image
    if ( this.img ) {
      return `${ base_url }/upload/users/${ this.img }`;
    } else {
      return `${ base_url }/upload/users/no-image`;
    }
  }
}
