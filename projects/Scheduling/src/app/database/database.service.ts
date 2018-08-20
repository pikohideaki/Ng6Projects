import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from './user/user';
import { Schedule } from '../scheduling/schedule';
import { Answer } from '../scheduling/answer';
import { Feedback } from '../feedback/feedback';


import { MyAngularFireDatabaseService } from './afdatabase.service';


@Injectable()
export class DatabaseService {

  users$:     Observable<User[]>;
  feedbacks$: Observable<Feedback[]>;
  schedules$: Observable<Schedule[]>;

  /* methods */
  user: {
    add:        (user: User)                => Promise<string>,
    update:     (user: User)                => Promise<void>,
    delete:     (uid: string)               => Promise<void>,
    updateName: (uid: string, name: string) => Promise<void>,
  };

  feedbacks: {
    add:        (value: Feedback) => Promise<string>,
    closeIssue: (id: string)      => Promise<void>,
    openIssue:  (id: string)      => Promise<void>,
  };

  schedule: {
    add:          (schedule: Schedule)                   => Promise<string>,
    update:       (schedule: Schedule)                   => Promise<void>,
    addAnswer:    (scheduleId: string, answer: Answer)   => Promise<string>,
    answers$:     (scheduleId: string)                   => Observable<Answer[]>,
    updateAnswer: (scheduleId: string, answer: Answer)   => Promise<void>,
    deleteAnswer: (scheduleId: string, answerId: string) => Promise<void>,
  };


  constructor(
    private myafdb: MyAngularFireDatabaseService,
  ) {
    this.users$ = this.myafdb.users$;
    this.feedbacks$ = this.myafdb.feedbacks$;
    this.schedules$ = this.myafdb.schedules$;


    /*** methods ***/

    this.user = {
      add:        (user: User)                => this.myafdb.user.add( user ),
      update:     (user: User)                => this.myafdb.user.update( user ),
      delete:     (uid: string)               => this.myafdb.user.delete( uid ),
      updateName: (uid: string, name: string) => this.myafdb.user.updateName( uid, name ),
    };

    this.feedbacks = {
      add: (fb: Feedback) =>
        this.myafdb.feedback.add( fb ),

      closeIssue: (id: string) =>
        this.myafdb.feedback.closeIssue( id ),

      openIssue: (id: string) =>
        this.myafdb.feedback.openIssue( id ),

    };

    this.schedule = {
      add: (schedule: Schedule) =>
        this.myafdb.schedule.add( schedule ),

      update: (schedule: Schedule) =>
        this.myafdb.schedule.update( schedule ),

      answers$: (scheduleId: string) =>
        this.myafdb.schedule.answers$( scheduleId ),

      addAnswer: (scheduleId: string, answer: Answer) =>
        this.myafdb.schedule.addAnswer( scheduleId, answer ),

      updateAnswer: (scheduleId: string, answer: Answer) =>
        this.myafdb.schedule.updateAnswer( scheduleId, answer ),

      deleteAnswer: (scheduleId: string, answerId: string) =>
        this.myafdb.schedule.deleteAnswer( scheduleId, answerId ),
    };

  }
}
