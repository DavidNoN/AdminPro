import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncreasingComponent } from './increasing/increasing.component';
import { DoughnutComponent } from './doughnut/doughnut.component';
import {ChartsModule} from 'ng2-charts';




@NgModule({
  declarations: [IncreasingComponent, DoughnutComponent],
    imports: [
        CommonModule,
        FormsModule,
        ChartsModule
    ],
  exports: [IncreasingComponent, DoughnutComponent]
})
export class ComponentsModule { }
