import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-increasing',
  templateUrl: './increasing.component.html',
  styles: []
})
export class IncreasingComponent implements OnInit {


  @Input() progress = 50;
  @Input() btnClass = 'btn btn-primary';

  @Output() valueOutput: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }

  get getPercent(): string {
    return `${this.progress}%`;
  }

  changeValue(value: number): number {

    if (this.progress >= 100 && value > 0) {
      this.valueOutput.emit(100);
      return this.progress = 100;
    }

    if (this.progress <= 0 && value < 0) {
      this.valueOutput.emit(0);
      return this.progress = 0;
    }

    this.progress = this.progress + value;
    this.valueOutput.emit(this.progress);
  }

  onChange(value: number): void {

    if ( value >= 100 ){
      this.progress = 100;
    } else if ( value <= 0 ){
      this.progress = 0;
    } else {
      this.progress = value;
    }
    this.valueOutput.emit(value);
  }

}
