import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';

import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './maintenances/users/users.component';
import { HospitalsComponent } from './maintenances/hospitals/hospitals.component';
import { MedicsComponent } from './maintenances/medics/medics.component';
import { MedicComponent } from './maintenances/medics/medic.component';
import { SearchesComponent } from './searches/searches.component';
import { AdminGuard } from '../guards/admin.guard';

const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Account' } },
  { path: 'search/:term', component: SearchesComponent, data: { title: 'Searches' } },
  { path: 'grafica1', component: Grafica1Component, data: { title: 'Graph' } },
  { path: 'progress', component: ProgressComponent, data: { title: 'Progress' } },
  { path: 'promises', component: PromisesComponent, data: { title: 'Promises' } },
  { path: 'rxjs', component: RxjsComponent, data: { title: 'Rxjs' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'User Profile' } },

  // Maintenance
  { path: 'hospitals', component: HospitalsComponent, data: { title: 'Maintenance for hospitals' } },
  { path: 'medics', component: MedicsComponent, data: { title: 'Maintenance for medics' } },
  { path: 'medic/:id', component: MedicComponent, data: { title: 'Maintenance for medics' } },

  // Admin routes
  { path: 'users', canActivate: [ AdminGuard ], component: UsersComponent, data: { title: 'Maintenance for users' } },
];


@NgModule( {
             declarations: [],
             imports: [ RouterModule.forChild( childRoutes ) ],
             exports: [ RouterModule ]
           } )
export class ChildRoutesModule {
}
