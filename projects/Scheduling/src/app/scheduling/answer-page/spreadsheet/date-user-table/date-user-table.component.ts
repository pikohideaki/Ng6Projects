import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';

import { AlertDialogComponent } from '../../../../my-lib/alert-dialog.component';
import { Schedule } from '../../../schedule';
import { utils } from '../../../../my-lib/utilities';
import { getAverageScore, getIconName } from '../functions';
import { Answer } from '../../../answer';
import { ScheduleSymbol } from '../../../schedule-symbol';


@Component({
  selector: 'app-date-user-table',
  templateUrl: './date-user-table.component.html',
  styleUrls: [
    '../../../../my-lib/data-table/data-table.component.css',
    '../spreadsheet-table.css'
  ]
})
export class DateUserTableComponent implements OnInit {

  @Input() answerDeadlineExpired$!: Observable<boolean>;
  @Input() answers$!:               Observable<Answer[]>;
  @Input() event$!:                 Observable<Schedule>;
  @Input() spreadSheet$!:           Observable<Object>;
  @Input() symbols$!:               Observable<ScheduleSymbol[]>;

  @Input()  flipTableState!: boolean;
  @Output() flipTableStateChange = new EventEmitter<boolean>();

  @Output() answerSelected = new EventEmitter<Answer>();

  average        = getAverageScore;
  iconName       = getIconName;
  toYMD          = utils.date.toYMD;
  getDayStringJp = utils.date.getDayStringJp;
  toHM           = utils.date.toHM;


  constructor( private dialog: MatDialog ) { }

  ngOnInit() {
  }


  flipTable() {
    this.flipTableStateChange.emit( !this.flipTableState );
  }

  answerOnSelect( answer: Answer ) {
    this.answerSelected.emit( answer );
  }

  commentOnClick( comment: string ) {
    const dialogRef = this.dialog.open( AlertDialogComponent );
    dialogRef.componentInstance.message = comment;
  }

}
