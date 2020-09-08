import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

const base_url = environment.base_url;

@Injectable( {
               providedIn: 'root'
             } )
export class ModalImageService {

  private hideModal = true;
  public type: 'users' | 'medics' | 'hospitals';
  public id: string;
  public img: string;
  public user: User;

  public newImage: EventEmitter<string> = new EventEmitter<string>();

  get hiddenModal(): boolean {
    return this.hideModal;
  }

  openModal( type: 'users' | 'medics' | 'hospitals',
             id: string,
             img = 'no-img' ): void {
    this.hideModal = false;
    this.type = type;
    this.id = id;
    this.img = img;

    if ( img.includes('https') ) {
      this.img = img;
    } else {
      this.img = `${ base_url }/upload/${ type }/${ img }`;
    }

  }

  closeModal(): void {
    this.hideModal = true;
  }

  constructor() {
  }
}
