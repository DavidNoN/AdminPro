import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { SearchesService } from '../../../services/searches.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ModalImageService } from '../../../services/modal-image.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component( {
              selector: 'app-users',
              templateUrl: './users.component.html',
              styles: []
            } )
export class UsersComponent implements OnInit, OnDestroy {

  public totalUsers = 0;
  public users: User[] = [];
  public usersTemp: User[] = [];
  public from = 0;
  public page = 1;
  public loading = true;
  public imgSubs: Subscription;

  constructor( private userService: UserService,
               private searchService: SearchesService,
               private modalImageService: ModalImageService ) {
  }

  ngOnInit(): void {

    this.loadUsers();
    this.imgSubs = this.modalImageService.newImage
                       .pipe(
                         delay( 100 )
                       )
                       .subscribe( () => this.loadUsers() );

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.loadUsers( this.from )
        .subscribe( ( { total, users } ) => {
          this.totalUsers = total;
          this.users = users;
          this.usersTemp = users;
          this.loading = false;
        } );
  }

  changePage( value: number, page: number ): void {

    this.from += value;
    this.page += page;

    if ( this.from < 0 ) {
      this.from = 0;
      this.page = 1;
    } else if ( this.from >= this.totalUsers ) {
      this.from -= value;
    }

    this.loadUsers();

  }

  search( term: string ): User[] {

    if ( term.length === 0 ) {
      return this.users = this.usersTemp;
    }

    this.searchService.search( 'users', term )
        .subscribe( results => {
          this.users = results;
        } );
  }

  deleteUser( user: User ): Promise<SweetAlertResult<any>> {

    if ( user.uid === this.userService.uid ) {
      return Swal.fire( 'Error', 'You cannot delete yourself', 'error' );
    }

    Swal.fire( {
                 title: 'Delete user?',
                 text: 'You are about to delete this user!',
                 icon: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#3085d6',
                 cancelButtonColor: '#d33',
                 confirmButtonText: 'Yes, delete it!'
               } ).then( ( result ) => {
      if ( result.isConfirmed ) {

        this.userService.deleteUser( user )
            .subscribe( resp => {
              this.loadUsers();
              Swal.fire(
                'User deleted',
                `${ user.name } was deleted successfully`,
                'success'
              );

            } );
      }
    } );

  }

  changeRole( user: User ): void {
    this.userService.saveUser( user )
        .subscribe( resp => {
          console.log( resp );
        } );
  }

  openModal( user: User ): void {
    console.log( user );
    this.modalImageService.openModal( 'users', user.uid, user.img );
  }

}
