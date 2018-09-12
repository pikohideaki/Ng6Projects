
import {map, switchMap} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Schedule } from '../../schedule';
import { ScheduleSymbol, IScheduleSymbol } from '../../schedule-symbol';
import { Answer } from '../../answer';
import { DatabaseService } from '../../../database/database.service';

// import { SchedulingEvent, Answer, MySymbol } from '../../scheduling-event';
// import { utils } from '../../../../mylib/utilities';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styles: []
})
export class SpreadsheetComponent implements OnInit {

  @Input() answerDeadlineExpired$!: Observable<boolean>;
  @Input() schedule$!: Observable<Schedule>;
  @Output() answerIdChange = new EventEmitter<string>();

  symbols$!:           Observable<IScheduleSymbol[]>;
  answers$!:           Observable<Answer[]>;
  selectedDatetimes$!: Observable<number[]>;
  spreadSheet$!:       Observable<object>;

  flipTableState: boolean = true;  // date-user <--> user-date


  constructor(
    private dialog: MatDialog,
    private database: DatabaseService
  ) {
  }

  ngOnInit() {
    this.symbols$ = this.schedule$.pipe( map( e => e.symbols ) );

    this.answers$ = this.schedule$.pipe(
        switchMap( s => this.database.schedule.answers$( s.id ) ) );

    this.selectedDatetimes$
      = this.schedule$.pipe( map( e => e.selectedDatetimes ));

    this.spreadSheet$ = this.schedule$.pipe( map( event => {
        const symbolIDs = event.symbols.filter( e => e.useThis ).map( e => e.id );
        const dates = event.selectedDatetimes;
        const spreadSheet = {};
        dates.forEach( date => {
          // spreadSheet[ date ] = {};
          // symbolIDs.forEach( id => spreadSheet[ date.valueOf() ][ id ] = 0 );
        });
        // event.answers.forEach( answer =>
        //   answer.selection.forEach( val => {
        //     if ( !!spreadSheet[ val.date.valueOf() ] ) {
        //       spreadSheet[ val.date.valueOf() ][ val.symbolID ]++;
        //     }
        //   }) );
        return spreadSheet;
      }));
  }

  answerOnSelect( answer: Answer ) {
    this.answerIdChange.emit( answer.id );
  }

}
