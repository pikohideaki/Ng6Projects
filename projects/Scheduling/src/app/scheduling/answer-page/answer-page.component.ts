import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { utils } from '../../my-lib/utilities';
import { DatabaseService } from '../../database/database.service';
import { ConfirmDialogComponent } from '../../my-lib/confirm-dialog.component';

import { Schedule } from '../schedule';
import { Answer } from '../answer';
import { ScheduleSymbol } from '../schedule-symbol';
// import { EditEventComponent } from '../edit-event/edit-event.component';
import { EditPasswordDialogComponent } from './edit-password-dialog.component';

@Component({
  selector: 'app-answer-page',
  templateUrl: './answer-page.component.html',
  styleUrls: [
    '../../my-lib/data-table/data-table.component.css',
    './answer-page.component.css'
  ]
})
export class AnswerPageComponent implements OnInit {

  eventId$!: Observable<string>;
  event$!: Observable<Schedule>;
  answerDeadlineExpired$!: Observable<boolean>;

  private answerIdSource = new BehaviorSubject<string>('');
  answerId$ = this.answerIdSource.asObservable();


  toYMD = utils.date.toYMD;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private database: DatabaseService,
  ) {
  }


  ngOnInit() {

    this.eventId$
      = this.route.paramMap.pipe(
          switchMap( (params: ParamMap) => params.getAll('eventId') ));

    this.event$
      = combineLatest(
          this.database.schedules$,
          this.eventId$,
          (list, id) => ( list.find( e => e.id === id )
                          || new Schedule() ) );

    this.answerDeadlineExpired$
      = this.event$.pipe(map( e =>
          utils.date.compare(
              new Date(),
              utils.date.getTomorrow( e.answerDeadline )
            ) === 1 ));
  }


  answerIdOnChange( answerId: string ) {
    this.answerIdSource.next( answerId );
  }

  editEvent( eventId: string, password: string ) {
    const path = [`scheduling/edit-event/${eventId}`];
    if ( !password ) {
      this.router.navigate( path );
    } else {
      const dialogRef = this.dialog.open( EditPasswordDialogComponent );
      dialogRef.componentInstance.passwordAnswer = password;
      dialogRef.afterClosed().subscribe( result => {
        if ( result === 'yes' ) this.router.navigate( path );
      });
    }
  }

  scrollTo( targetElement: any ) {
    targetElement.scrollIntoView();
  }


}
