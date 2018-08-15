import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, takeWhile, startWith, first } from 'rxjs/operators';

import { utils } from '../utilities';


@Component({
  selector: 'app-multiple-date-picker',
  templateUrl: './multiple-date-picker.component.html',
  styleUrls: ['./multiple-date-picker.component.css']
})
export class MultipleDatePickerComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() width: number = 300;
  @Input() filterFn = ((_: any) => true);
  @Input() dayLabelLanguage: 'eng'|'jp' = 'eng';
  @Input() initialDateList$!: Observable<number[]>;
  @Output() selectedDatesChange = new EventEmitter<number[]>();

  dayStrings: string[] = [];
  weeks$: Observable<{ timestamp: number, selected: boolean }[][]>;

  private currentYearSource
    = new BehaviorSubject<number>( (new Date()).getFullYear() );
  private currentMonthSource
    = new BehaviorSubject<number>( (new Date()).getMonth() );
  currentYear$:  Observable<number> = this.currentYearSource .asObservable();
  currentMonth$: Observable<number> = this.currentMonthSource.asObservable();

  private selectedDatesSource = new BehaviorSubject<number[]>([]);
  private selectedDates$: Observable<number[]>
     = this.selectedDatesSource.asObservable().pipe( startWith([]) );



  constructor() {
    this.weeks$ = combineLatest(
        this.currentYear$,
        this.currentMonth$,
        this.selectedDates$,
        (year, month, selectedDate) => {
          const weeks: { timestamp: number, selected: boolean }[][] = [];
          utils.date.getAllDatesInTimestamp( year, month ).forEach( timestamp => {
            const weekNumber = utils.date.weekNumber( timestamp );
            if ( weeks.length < weekNumber + 1 ) {
              weeks.push( Array(7).fill({ date: undefined, selected: false }) );
            }
            weeks[ weekNumber ][ new Date( timestamp ).getDay() ] = {
              timestamp : timestamp,
              selected  : selectedDate.includes( timestamp ),
            };
          });
          return weeks;
        } );

    this.selectedDates$.pipe( map( list => list.sort() ),
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

    if ( !!this.initialDateList$ ) {
      this.initialDateList$.pipe( first() )
        .subscribe( initialDateList => {
          const initialDateValuesUniq
            = utils.array.uniq(
                initialDateList.map( utils.date.toMidnightTimestamp ) );
          this.selectedDatesSource.next( initialDateValuesUniq );
        });
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
    this.currentYearSource .next( (new Date()).getFullYear() );
  }

  isToday( date: Date ) {
    if ( !date ) return false;
    return utils.date.isToday( date );
  }


  resetSelections() {
    this.selectedDatesSource.next([]);
  }

  dateOnSelectToggle( date: number ) {
    if ( !date ) return;
    if ( !this.filterFn( date ) ) return;
    const current: number[] = this.selectedDatesSource.getValue();
    if ( current.includes( date ) ) {
      utils.array.removeValue( current, date );
    } else {
      current.push( date );
    }
    this.selectedDatesSource.next( current );
  }

  selectToggleDayColumn( dayIndex: number ) {
    const current = this.selectedDatesSource.getValue();
    const month = this.currentMonthSource.getValue();
    const year  = this.currentYearSource.getValue();

    const datesOfDayColumn: number[]
      = utils.date.getAllDatesInTimestamp( year, month )
            .filter( date => new Date( date ).getDay() === dayIndex )
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
