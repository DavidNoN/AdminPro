import { Injectable } from '@angular/core';

@Injectable( {
               providedIn: 'root'
             } )
export class SidebarService {

  menu: any[] = [
    {
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        { title: 'Main', url: '/' },
        { title: 'ProgressBar', url: 'progress' },
        { title: 'Graphs', url: 'grafica1' },
        { title: 'Promises', url: 'promises' },
        { title: 'rxjs', url: 'rxjs' }
      ]
    },

    {
      title: 'Maintenance',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        { title: 'Users', url: 'users' },
        { title: 'Hospitals', url: 'hospitals' },
        { title: 'Medics', url: 'medics' }
      ]
    }

  ];

  constructor() {
  }
}
