import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncreasingComponent } from './increasing/increasing.component';
import { DoughnutComponent } from './doughnut/doughnut.component';
import { ChartsModule } from 'ng2-charts';
import { ModalImageComponent } from './modal-image/modal-image.component';


@NgModule( {
             declarations: [ IncreasingComponent, DoughnutComponent, ModalImageComponent ],
             imports: [
               CommonModule,
               FormsModule,
               ChartsModule
             ],
             exports: [ IncreasingComponent, DoughnutComponent, ModalImageComponent ]
           } )
export class ComponentsModule {
}
