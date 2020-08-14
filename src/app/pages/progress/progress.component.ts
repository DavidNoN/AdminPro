import {Component} from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent {
  progressOne = 25;
  progressTwo = 45;

  get getProgressOne(): any {
    return `${this.progressOne}%`;
  }

  get getProgressTwo(): any {
    return `${this.progressTwo}%`;
  }

  valueSon(value: number): any {
    this.progressOne = value;
  }
}
