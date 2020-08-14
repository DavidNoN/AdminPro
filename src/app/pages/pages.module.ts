import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

// Modules

import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';


// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';







@NgModule({
  declarations: [
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    DashboardComponent,
    AccountSettingsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    AppRoutingModule,
    ComponentsModule,
    ChartsModule
  ],
  exports: [
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    DashboardComponent
  ]
})
export class PagesModule { }
