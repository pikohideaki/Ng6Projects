import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, takeWhile, startWith } from 'rxjs/operators';

import { utils } from '../utilities';


@Component({
  selector: 'app-multiple-date-picker',
  templateUrl: './multiple-date-picker.component.html',
  styleUrls: ['./multiple-date-picker.component.css']
})
export class MultipleDatePickerComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() width: number = 300;
  @Input() dayLabelLanguage: 'eng'|'jp' = 'eng';
  @Input() initialDateList!: number[];
  @Input() filterFn = ((_: number) => true);
  @Output() selectedDatesChange = new EventEmitter<number[]>();

  dayStrings: string[] = [];
  weeks$: Observable<{ dateNumber: number, timestamp: number, selected: boolean }[][]>;

  private currentYearSource
    = new BehaviorSubject<number>( (new Date()).getFullYear() );
  currentYear$:  Observable<number> = this.currentYearSource.asObservable();

  private currentMonthSource
    = new BehaviorSubject<number>( (new Date()).getMonth() );
  currentMonth$: Observable<number> = this.currentMonthSource.asObservable();

  private selectedDatesSource = new BehaviorSubject<number[]>([]);
  private selectedDates$: Observable<number[]>
     = this.selectedDatesSource.asObservable().pipe( startWith([]) );

  toDate = (timestamp: number) => new Date( timestamp ).getDate();


  constructor() {
    const weeksInMonth$: Observable<{ dateNumber: number, timestamp: number, selected: boolean }[][]>
      = combineLatest(
          this.currentYear$,
          this.currentMonth$,
          (year, month) => {
            const nofWeeks = utils.date.nofWeeks( new Date( year, month ) );
            const weeksInMonth: { dateNumber: number, timestamp: number, selected: boolean }[][] = [];
            for ( let i = 0; i < nofWeeks; ++i ) {
              weeksInMonth.push([]);
              for ( let j = 0; j < 7; ++j ) {
                weeksInMonth[i].push({ dateNumber: 0, timestamp: 0, selected: false });
              }
            }
            utils.date.getAllDatesIn( year, month ).forEach( (date: Date) => {
              const day = weeksInMonth[ utils.date.weekNumber( date ) ][ date.getDay() ];
              day.dateNumber = date.getDate();
              day.timestamp = date.getTime();
            });
            return weeksInMonth;
        });

    this.weeks$ = combineLatest(
        weeksInMonth$,
        this.selectedDates$,
        (weeksInMonth, selectedDate) => {
          for ( let i = 0; i < weeksInMonth.length; ++i ) {
            for ( let j = 0; j < weeksInMonth[0].length; ++j ) {
              const day = weeksInMonth[i][j];
              day.selected = selectedDate.includes( day.timestamp );
            }
          }
          return weeksInMonth;
        } );

    this.selectedDates$.pipe(
        map( list => list.sort() ),
        takeWhile( () => this.alive ) )
      .subscribe( val => this.selectedDatesChange.emit( val ) );
  }

  ngOnInit() {
    switch ( this.dayLabelLanguage ) {
      case 'jp' :
        this.dayStrings = ['日', '月', '火', '水', '木', '金', '土'];
        break;

      case 'eng' :
        this.dayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];
        break;
    }

    if ( !!this.initialDateList ) {
      const initialDateValuesUniq
        = utils.array.uniq(
            this.initialDateList.map( utils.date.toMidnightTimestamp ) );
      this.selectedDatesSource.next( initialDateValuesUniq );
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }


  goToPreviousMonth() {
    if ( this.currentMonthSource.getValue() > 0 ) {
      this.currentMonthSource.next( this.currentMonthSource.getValue() - 1 );
    } else {
      this.currentMonthSource.next( 11 );
      this.currentYearSource.next( this.currentYearSource.getValue() - 1 );
    }
  }

  goToNextMonth() {
    if ( this.currentMonthSource.getValue() < 11 ) {
      this.currentMonthSource.next( this.currentMonthSource.getValue() + 1 );
    } else {
      this.currentMonthSource.next( 0 );
      this.currentYearSource.next( this.currentYearSource.getValue() + 1 );
    }
  }

  goToToday() {
    this.currentMonthSource.next( (new Date()).getMonth() );
    this.currentYearSource.next( (new Date()).getFullYear() );
  }

  isToday( timestamp: number ) {
    if ( !timestamp ) return false;
    return utils.date.isToday( timestamp );
  }


  resetSelections() {
    this.selectedDatesSource.next([]);
  }

  // 日選択／解除
  dateOnSelectToggle( timestamp: number ) {
    if ( !timestamp ) return;
    if ( !this.filterFn( timestamp ) ) return;
    const current: number[] = this.selectedDatesSource.getValue();
    if ( current.includes( timestamp ) ) {
      utils.array.removeValue( current, timestamp );
    } else {
      current.push( timestamp );
    }
    this.selectedDatesSource.next( current );
  }

  // 曜日列選択／解除
  selectToggleDayColumn( dayIndex: number ) {
    const current = this.selectedDatesSource.getValue();
    const month = this.currentMonthSource.getValue();
    const year  = this.currentYearSource.getValue();

    const datesOfDayColumn: number[]
      = utils.date.getAllDatesInTimestamp( year, month )
            .filter( timestamp => new Date( timestamp ).getDay() === dayIndex )
            .filter( this.filterFn );
    const datesInColumnAllSelected
      = datesOfDayColumn.every( e => current.includes( e ) );

    datesOfDayColumn.forEach( date => utils.array.remove( current, date ) );
    if ( !datesInColumnAllSelected ) {
      datesOfDayColumn.forEach( date => current.push( date ) );
    }
    this.selectedDatesSource.next( current );
  }
}
