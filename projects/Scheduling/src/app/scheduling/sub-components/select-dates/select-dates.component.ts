import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { utils } from '../../../my-lib/utilities';

import { SetTimeDialogComponent } from './set-time-dialog.component';


@Component({
  selector: 'app-select-dates',
  templateUrl: './select-dates.component.html',
  styleUrls: ['./select-dates.component.css']
})
export class SelectDatesComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() selectedDatetimes: number[] = [];

  @Output() selectedDatetimesChange = new EventEmitter<number[]>();

  defaultDatetime: number
    = new Date( ( new Date() ).setHours(19, 0, 0, 0) ).getTime();  // 19:00 by default

  selectedDatesInit$!: Observable<number[]>;


  private selectedDatesSource = new BehaviorSubject<number[]>([]);

  private dateToTime = new Map<number, number[]>();  /* date-value -> datetime */
  private dateToTimeChangedSource = new BehaviorSubject<number>(0);
  /** example of dateToTime
   * 2017/10/27 => [2017/10/27 12:00, 2017/10/27 19:00],
   * 2017/10/28 => [2017/10/28 13:00, 2017/10/28 18:00, 2017/10/28 20:00],
   * 2017/10/29 => [2017/10/29 19:00],
   */

  selectedDatetimesGrouped: number[][] = [];
  /** example of selectedDatetimesGrouped
   * [ [2017/10/27 12:00, 2017/10/27 19:00],
   *   [2017/10/28 13:00, 2017/10/28 18:00, 2017/10/28 20:00],
   *   [2017/10/29 19:00] ]
   */

  // selectedDatetimes: Date[];  /* flattened selectedDates table */

  toHM           = utils.date.toHM;
  toYMD          = utils.date.toYMD;
  getDayStringJp = utils.date.getDayStringJp;



  constructor(
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    // this.selectedDatesInit$
    //   = this.selectedDatetimesInit$
    //       .map( selectedDatetimesInit =>
    //         utils.array.uniq(
    //           selectedDatetimesInit
    //             .map( e => utils.date.toMidnight(e) )
    //             .map( e => e ) ) );

    // this.selectedDatetimesInit$.subscribe( selectedDatetimesInit => {
    //   selectedDatetimesInit.forEach( date => {
    //     const date0 = utils.date.toMidnight(date);
    //     if ( this.dateToTime.has( date0 ) ) {
    //       this.dateToTime.get( date0 ).push( date );
    //     } else {
    //       this.dateToTime.set( date0, [date] );
    //     }
    //   });
    //   this.dateToTimeChangedSource.next(0);
    // });

    // const selectedDatetimesGrouped$
    //   = Observable.combineLatest(
    //       this.selectedDatesSource.asObservable(),
    //       this.dateToTimeChangedSource.asObservable(),
    //       (selectedDates) => selectedDates.map( date => {
    //         if ( !this.dateToTime.has( date ) ) {
    //           const dateWithDefaultTime = new Date(date);
    //           dateWithDefaultTime.setHours  ( this.defaultDatetime.getHours()   );
    //           dateWithDefaultTime.setMinutes( this.defaultDatetime.getMinutes() );
    //           this.dateToTime.set( date, [dateWithDefaultTime] );
    //         }
    //         return this.dateToTime.get( date ).sort( utils.date.compare );
    //       } ) );

    // const selectedDatetimes$
    //   = selectedDatetimesGrouped$.map( e => [].concat( ...e ) );

    // selectedDatetimesGrouped$
    //   .takeWhile( () => this.alive )
    //   .subscribe( val => this.selectedDatetimesGrouped = val );

    // selectedDatetimes$
    //   .takeWhile( () => this.alive )
    //   .subscribe( val => {
    //     this.selectedDatetimes = val;
    //     this.selectedDatetimesChange.emit( this.selectedDatetimes );
    //   });
  }

  ngOnDestroy() {
    this.alive = false;
  }


  selectedDatesOnChange( selectedDates: number[] ) {
    this.selectedDatesSource.next( selectedDates );
  }


  laterToday( date: number ): boolean {
    if ( !date ) return false;
    const today = new Date( (new Date(      ).setHours(0, 0, 0, 0) ) ).getTime();
    const date0 = new Date( (new Date( date ).setHours(0, 0, 0, 0) ) ).getTime();
    return date0 >= today;
  }


  edit( date: number ) {
    const datetimes = this.dateToTime.get( utils.date.toMidnightTimestamp(date) );
    if ( !datetimes || datetimes.length === 0 ) return;
    const dateInArray: number = (datetimes.find( e => e === date ) || Date.now());
    const dialogRef = this.dialog.open( SetTimeDialogComponent, { disableClose: true } );
    dialogRef.componentInstance.date = dateInArray;
    dialogRef.afterClosed().subscribe( time => {
      new Date( dateInArray ).setHours  ( time.hours   );
      new Date( dateInArray ).setMinutes( time.minutes );
      this.dateToTimeChangedSource.next( Date.now() );
    });
  }

  copy( date: number ) {
    const datetimes = this.dateToTime.get( utils.date.toMidnightTimestamp(date) );
    if ( !datetimes || datetimes.length === 0 ) return;
    datetimes.push( date );
    this.dateToTimeChangedSource.next( Date.now() );
  }

  remove( date: number ) {
    const datetimes = this.dateToTime.get( utils.date.toMidnightTimestamp(date) );
    if ( !datetimes || datetimes.length === 0 ) return;
    utils.array.removeIf( datetimes, ( e => e === date ) );
    this.dateToTimeChangedSource.next( Date.now() );
  }


  changeDatetimeAll() {
    const dialogRef = this.dialog.open( SetTimeDialogComponent, { disableClose: true } );
    dialogRef.componentInstance.date = this.defaultDatetime;
    dialogRef.afterClosed().subscribe( time => {
      new Date( this.defaultDatetime ).setHours  ( time.hours   );
      new Date( this.defaultDatetime ).setMinutes( time.minutes );
      /* reset all dates in this.dateToTime */
      this.dateToTime.forEach( dates => dates.forEach( d => {
        new Date( d ).setHours  ( time.hours   );
        new Date( d ).setMinutes( time.minutes );
      }));
      this.dateToTimeChangedSource.next( Date.now() );
    });
  }

}
