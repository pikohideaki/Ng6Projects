import { Component, OnInit } from '@angular/core';
import { MatStepper, MatDialog } from '@angular/material';


import { DatabaseService } from '../../database/database.service';
import { ConfirmDialogComponent } from '../../my-lib/confirm-dialog.component';

import { Schedule } from '../schedule';
import { IScheduleSymbol, ScheduleSymbol } from '../schedule-symbol';


@Component({
  selector: 'app-new-schedule',
  templateUrl: './new-schedule.component.html',
  styleUrls: ['./new-schedule.component.css']
})
export class NewEventComponent implements OnInit {

  symbolsInit: ScheduleSymbol[] = [
    new ScheduleSymbol({ id: 'fav',      useThis: false, score: 10, description: 'できればこの日で' }),
    new ScheduleSymbol({ id: 'ok',       useThis: true,  score: 10, description: '参加可能' }),
    new ScheduleSymbol({ id: 'maybe',    useThis: true,  score:  5, description: '行けるかも' }),
    new ScheduleSymbol({ id: 'depends',  useThis: false, score:  5, description: '時間によります' }),
    new ScheduleSymbol({ id: 'late',     useThis: false, score:  5, description: '遅れてなら参加可能' }),
    new ScheduleSymbol({ id: 'unknown',  useThis: false, score:  5, description: '分からない' }),
    new ScheduleSymbol({ id: 'ng',       useThis: true,  score:  0, description: '参加不可' }),
    new ScheduleSymbol({ id: 'kusonemi', useThis: false, score:  0, description: '起きられません' }),
  ];


  newSchedule = new Schedule();

  eventPageUrlPrefix = '';
  eventPageId = '';

  linkTitle: string = '日程調整';

  symbols: IScheduleSymbol[] = [];


  constructor(
    public dialog: MatDialog,
    private database: DatabaseService
  ) {
  }

  ngOnInit() {
    this.newSchedule.answerDeadline = 0;  /* reset */
    this.eventPageUrlPrefix = window.location.href + '/answer/';
    this.newSchedule.symbols = this.symbolsInit;
  }


  /* callback functions */
  titleChange( title: string ) {
    this.newSchedule.title = title;
  }
  notesChange( notes: string ) {
    this.newSchedule.notes = notes;
  }
  selectedDatetimesChange( selectedDatetimesMsec: number[] ) {
    this.newSchedule.selectedDatetimes = selectedDatetimesMsec;
  }
  answerDeadlineChange( answerDeadlineMsec: number ) {
    this.newSchedule.answerDeadline = answerDeadlineMsec;
  }
  symbolsChange( symbols: ScheduleSymbol[] ) {
    this.newSchedule.symbols = symbols;
  }
  passwordChange( password: string ) {
    this.newSchedule.password = password;
  }


  createEvent( stepper: MatStepper ) {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = 'イベントを作成します。よろしいですか？';
    dialogRef.afterClosed().subscribe( async result => {
      if ( result === 'yes' ) {
        const id = await this.database.schedule.add( this.newSchedule );
        this.eventPageId = id;
        stepper.next();
      }
    });
  }
}
