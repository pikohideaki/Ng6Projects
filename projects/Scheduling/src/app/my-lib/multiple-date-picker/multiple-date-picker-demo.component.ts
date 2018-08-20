import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { utils } from '../utilities';

@Component({
  selector: 'app-multiple-date-picker-demo',
  template: `
    <div class="margined-element">
      <app-multiple-date-picker
        [width]="300"
        [filterFn]="filterFn"
        [dayLabelLanguage]="'eng'"
        [initialDateList]="initialDateList"
        (selectedDatesChange)="selectedDatesOnChange( $event )">
      </app-multiple-date-picker>

      <div class="margined-element">
        <p>selected dates</p>
        <ul>
          <li *ngFor="let date of selectedDates">{{ date }}</li>
        </ul>
      </div>
    </div>
  `
})
export class MultipleDatePickerDemoComponent implements OnInit {

  initialDateList: number[] = [];
  selectedDates: string[] = [];

  filterFn = (date: number) => date >= utils.date.toMidnightTimestamp( Date.now() );


  constructor() { }

  ngOnInit() { }

  selectedDatesOnChange( selectedDates: number[] ) {
    this.selectedDates = selectedDates.map( date => new Date(date).toString() );
  }
}
