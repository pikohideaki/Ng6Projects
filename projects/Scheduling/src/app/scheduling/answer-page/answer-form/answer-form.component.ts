
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, BehaviorSubject, Subject, merge, concat } from 'rxjs';
import { map, switchMap, scan, debounceTime, throttleTime } from 'rxjs/operators';


import { utils } from '../../../my-lib/utilities';
import { DatabaseService } from '../../../database/database.service';
import { ConfirmDialogComponent } from '../../../my-lib/confirm-dialog.component';

import { Schedule } from '../../schedule';
import { Answer } from '../../answer';
import { ScheduleSymbolId, IScheduleSymbol } from '../../schedule-symbol';




@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: [
    '../../../../mylib/data-table/data-table.component.css',
    './answer-form.component.css'
  ]
})
export class AnswerFormComponent implements OnInit {

  @Input() scheduleId$!: Observable<string>;
  @Input() schedule$!: Observable<Schedule>;

  @Input() answerId$!: Observable<string>;
  @Output() answerIdChange = new EventEmitter<string>();

  private userNameSource = new BehaviorSubject<string>('');
  userName$ = this.userNameSource.asObservable().pipe( debounceTime(300) );

  private commentSource = new BehaviorSubject<string>('');
  comment$ = this.commentSource.asObservable().pipe( debounceTime(300) );

  // scheduleに含まれる候補日とそれに対する記号選択状態のペア
  dateSymbolIdPairList$!: Observable<{ date: number, symbolId: ScheduleSymbolId}[]>;

  // リセットイベント
  private resetClickedSource = new Subject<void>();
  private resetClicked$
    = this.resetClickedSource.asObservable().pipe( throttleTime(1000) );

  // 列選択イベント
  private columnClickedSource = new Subject<ScheduleSymbolId>();
  private columnClicked$
    = this.columnClickedSource.asObservable().pipe( throttleTime(300) );

  // セル選択イベント
  private symbolClickedSource
    = new Subject<{ date: number, symbolId: ScheduleSymbolId }>();
  private symbolClicked$
    = this.symbolClickedSource.asObservable().pipe( throttleTime(300) );

  allDatesAreSelected$!: Observable<boolean>;

  allSymbols$!: Observable<IScheduleSymbol[]>;

  toYMD          = utils.date.toYMD;
  getDayStringJp = utils.date.getDayStringJp;
  toHM           = utils.date.toHM;


  constructor(
    private dialog: MatDialog,
    private database: DatabaseService,
  ) { }


   ngOnInit() {

    this.allSymbols$ = this.schedule$.pipe( map( s => s.symbols ));

    this.allDatesAreSelected$
      = this.dateSymbolIdPairList$.pipe( map( list =>
          list.every( pair => pair.symbolId !== '' ) ) );

    // 候補日程
    const dateList$: Observable<number[]>
      = this.schedule$.pipe( map( s => s.selectedDatetimes ) );

    //
    const answers$: Observable<Answer[]>
      = this.scheduleId$.pipe( switchMap( id => this.database.schedule.answers$( id ) ) );

    const answer$: Observable<Answer>
      = this.answerId$.pipe( switchMap( id =>
          answers$.pipe( map( answers => (answers.find( e => e.id === id ) || new Answer() ) ) ) ) );

    const init$: Observable<{ date: number, symbolId: ScheduleSymbolId }[]>
      = dateList$.pipe( map( list =>
          list.map( date => ({ date: date, symbolId: '' as ScheduleSymbolId }) )) );

    this.dateSymbolIdPairList$ = concat(
        init$,
        merge(
          dateList$.pipe( map( dl => ({ label: 'dateList', value: dl }) ) ),
          answer$.pipe( map( ans => ({ label: 'answer', value: ans.selection }) ) ),
          this.resetClicked$.pipe( map( () => ({ label: 'resetClicked' }) ) ),
          this.columnClicked$.pipe( map( symbolId => ({ label: 'columnClicked', value: symbolId }) ) ),
          this.symbolClicked$.pipe( map( value => ({ label: 'symbolClicked',
              value: { date: value.date, symbolId: value.symbolId } }) ) ),
        ),
        scan<any>( (
            acc: { date: number, symbolId: ScheduleSymbolId }[],
            val: { label: 'dateList',      value: number[] } |
                 { label: 'answer',        value: { date: number, symbolId: ScheduleSymbolId }[] } |
                 { label: 'resetClicked',  value: void } |
                 { label: 'columnClicked', value: ScheduleSymbolId } |
                 { label: 'symbolClicked', value: { date: number, symbolId: ScheduleSymbolId } }
          ) => {
            switch ( val.label ) {
              case 'dateList':  // 候補日程が更新されたとき
                return val.value.map( date => ({
                    date: date,
                    symbolId: (acc.find( e => e.date === date ) || { symbolId: '' }).symbolId
                  }) );
              case 'answer':  // 過去の回答から復元
                return acc.map( e => ({
                    date: e.date,
                    symbolId: (val.value.find( v => v.date === e.date ) || { symbolId: '' }).symbolId
                  }) );
              case 'resetClicked':
                return acc.map( e => ({ date: e.date, symbolId: '' }) );
              case 'columnClicked':
                return acc.map( e => ({ date: e.date, symbolId: val.value }) );
              case 'symbolClicked':
                return acc.map( e => ({ date: e.date, symbolId: val.value }) );
              default: return [];
            }
          }, <{ date: number, symbolId: ScheduleSymbolId }[]>[])
      );
  }


  userNameOnChange( userName: string ) {
    this.userNameSource.next( userName );
  }

  commentOnChange( comment: string ) {
    this.commentSource.next( comment );
  }

  resetForm() {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = '入力内容をリセットしますか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        this.userNameSource.next('');
        this.commentSource.next('');
        this.resetClickedSource.next();
        this.answerIdChange.emit('');
      }
    });
  }

  symbolOnSelect( date: number, symbolId: ScheduleSymbolId ) {
    this.symbolClickedSource.next({ date: date, symbolId: symbolId });
  }

  symbolHeaderOnSelect( symbolId: ScheduleSymbolId ) {
    this.columnClickedSource.next( symbolId );
  }


  submitAnswer(
    scheduleId: string,
    answerId:   string,
    userName:   string,
    comment:    string,
    dateSymbolIdPair: { date: number, symbolId: ScheduleSymbolId }[],
  ) {
    const newAnswer = new Answer({
      id:        (answerId || ''),
      userName:  userName,
      comment:   comment,
      selection: dateSymbolIdPair,
      timestamp: Date.now(),
    });

    if ( answerId === '' ) {
      this.database.schedule.addAnswer( scheduleId, newAnswer );
    } else {
      this.database.schedule.updateAnswer( scheduleId, newAnswer );
    }

    this.resetForm();
  }


  deleteAnswer( scheduleId: string, answerId: string ) {
    if ( !answerId ) return;
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = 'このデータを削除しますか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        this.database.schedule.deleteAnswer( scheduleId, answerId );
        this.resetForm();
      }
    });
  }

}
