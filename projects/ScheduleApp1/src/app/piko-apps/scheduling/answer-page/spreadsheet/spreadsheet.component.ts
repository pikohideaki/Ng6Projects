import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AlertDialogComponent } from '../../../../mylib/alert-dialog.component';
import { Schedule, Answer, ScheduleSymbol } from '../../scheduling-event';
import { utils } from '../../../../mylib/utilities';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: [
    '../../../../mylib/data-table/data-table.component.css',
    './spreadsheet.component.css'
  ]
})
export class SpreadsheetComponent implements OnInit {

  flipTableState = true;

  private scEventSource = new ReplaySubject<Schedule>(1);
  @Input() set scEvent( value: Schedule ) {
    this.scEventSource.next( value );
  }
  private scEvent$ = this.scEventSource.asObservable();

  private answerDeadlineExpiredSource = new ReplaySubject<boolean>(1);
  @Input() set answerDeadlineExpired( value: boolean ) {
    this.answerDeadlineExpiredSource.next( value );
  }
  answerDeadlineExpired$ = this.answerDeadlineExpiredSource.asObservable();

  @Output() answerIdChange = new EventEmitter<string>();

  spreadSheet$!: Observable<object>;


  toYMD = utils.date.toYMD;
  getDayStringJp = utils.date.getDayStringJp;
  toHM = utils.date.toHM;


  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.spreadSheet$ = this.scEvent$.pipe( map( event => {
          const symbolIDs = event.symbols.filter( e => e.useThis ).map( e => e.id );
          const dates = event.selectedDatetimes;
          const spreadSheet: any = {};
          dates.forEach( date => {
            spreadSheet[ date ] = {};
            symbolIDs.forEach( id => spreadSheet[ date ][ id ] = 0 );
          });
          event.answers.forEach( answer =>
            answer.selection.forEach( val => {
              if ( !!spreadSheet[ val.date ] ) {
                spreadSheet[ val.date ][ val.symbolID ]++;
              }
            }) );
          return spreadSheet;
        }) );

  }


  flipTable() {
    this.flipTableState = !this.flipTableState;
  }

  /* for print */
  getAverageScore( event: Schedule, date: number ) {
    const symbolIdsOfDate
      = event.answers
          .map( ans => ans.selection )
          .map( selections => selections.find( e => e.date === date ) )
          .filter( e => e !== undefined )
          .map( e => (e || { symbolID: '' }).symbolID );
    const scores = symbolIdsOfDate.map( id =>
        (event.symbols.find( e => e.id === id ) || { score: 0 } ).score );
    return utils.number.roundAt( utils.array.average( scores ), 1 ) || 0;
  }

  /* for print */
  getIconNameOfAnswer( answer: Answer, date: number, symbols: ScheduleSymbol[] ): string {
    const selection = answer.selection.find( e => e.date === date );
    if ( !selection ) return '';
    const symbol = symbols.find( e => e.id === selection.symbolID );
    return ( !!symbol ? symbol.iconName : '' );
  }


  commentOnClick( comment: string ) {
    const dialogRef = this.dialog.open( AlertDialogComponent );
    dialogRef.componentInstance.message = comment;
  }


  userClicked( answer: Answer ) {
    this.answerIdChange.emit( answer.databaseKey );
  }
}
