import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore } from 'angularfire2/firestore';

import { User, UserFS } from './user/user';
import { Feedback, FeedbackFS } from '../feedback/feedback';
import { Schedule, ScheduleFS } from '../scheduling/schedule';
import { Answer, AnswerFS } from '../scheduling/answer';


@Injectable()
export class MyAngularFireDatabaseService {

  private ref = {
    users:
      this.afdb.collection<UserFS>( 'users', ref => ref.orderBy('nameYomi') ),
    feedBacks:
      this.afdb.collection<FeedbackFS>( 'feedbacks', ref => ref.orderBy('date') ),
    schedules:
      this.afdb.collection<ScheduleFS>( 'schedules', ref => ref.orderBy('createdDate') ),
  };


  users$: Observable<User[]>;
  feedbacks$: Observable<Feedback[]>;
  schedules$: Observable<Schedule[]>;

  user: {
    add:        (user: User)                => Promise<string>,
    update:     (user: User)                => Promise<void>,
    delete:     (uid: string)               => Promise<void>,
    updateName: (uid: string, name: string) => Promise<void>,
  };

  feedback: {
    add:        (fb: Feedback) => Promise<string>,
    update:     (fb: Feedback) => Promise<void>,
    delete:     (id: string)   => Promise<void>,
    closeIssue: (id: string)   => Promise<void>,
    openIssue:  (id: string)   => Promise<void>,
  };

  scheduling: {
    add:          (schedule: Schedule)                   => Promise<string>,
    update:       (schedule: Schedule)                   => Promise<void>,
    delete:       (id: string)                           => Promise<void>,
    addAnswer:    (scheduleId: string, answer: Answer)   => Promise<void>,
    updateAnswer: (scheduleId: string, answer: Answer)   => Promise<void>,
    deleteAnswer: (scheduleId: string, answerId: string) => Promise<void>,
  };


  constructor(
    private afdb: AngularFirestore
  ) {
    this.users$
      = this.ref.users.valueChanges()
          .pipe( map( users => users.map( user => new User( user ) ) ) );

    this.feedbacks$
      = this.ref.feedBacks.valueChanges()
          .pipe( map( feedbacks => feedbacks.map( fb => new Feedback( fb ) ) ) );

    this.schedules$
      = this.ref.schedules.valueChanges()
          .pipe( map( evlist => evlist.map( ev => new Schedule( ev ) ) ) );


    /* methods */

    this.user = {
      add: async (user: User) => {
        user.timestamp = (user.timestamp || Date.now());
        const docref = await this.ref.users.add( new UserFS( user ) );
        user.id = docref.id;
        await docref.update( user );
        return user.id;
      },

      update: async (user: User) => {
        await this.ref.users.doc( user.id ).set( new UserFS( user ) );
      },

      delete: async (uid: string) => {
        await this.ref.users.doc( uid ).delete();
      },

      updateName: async (uid: string, name: string) => {
        await this.ref.users.doc( uid ).update({ name: name });
      }
    };


    this.feedback = {
      add: async (fb: Feedback) => {
        const docref = await this.ref.feedBacks.add( new FeedbackFS( fb ) );
        fb.id = docref.id;
        await docref.update( fb );
        return fb.id;
      },

      update: async (fb: Feedback) => {
        await this.ref.feedBacks.doc( fb.id ).update( new FeedbackFS( fb ) );
      },

      delete: async (id: string) => {
        await this.ref.feedBacks.doc( id ).delete();
      },

      closeIssue: async (id: string) => {
        await this.ref.feedBacks.doc(`${id}/closed`).set( true );
      },

      openIssue: async (id: string) => {
        await this.ref.feedBacks.doc(`${id}/closed`).set( false );
      },
    };

    this.scheduling = {
      add: async (schedule: Schedule) => {
        const docref = await this.ref.schedules.add( new ScheduleFS( schedule ) );
        schedule.id = docref.id;
        await docref.update( schedule );
        return schedule.id;
      },

      update: async (schedule: Schedule) => {
        await this.ref.schedules.doc( schedule.id ).update( new ScheduleFS( schedule ) );
      },

      delete: async (scheduleId: string) => {
        await this.ref.schedules.doc( scheduleId ).delete();
      },

      addAnswer: async (scheduleId: string, answer: Answer) => {
        answer.id = ( answer.id || Date.now().toString() );
        await this.ref.schedules.doc(`${scheduleId}/answers/${answer.id}`).set( new AnswerFS( answer ) );
      },

      updateAnswer: async (scheduleId: string, answer: Answer) => {
        await this.ref.schedules.doc(`${scheduleId}/answers/${answer.id}`).set( new AnswerFS( answer ) );
      },

      deleteAnswer: async (scheduleId: string, answerId: string) => {
        await this.ref.schedules.doc(`${scheduleId}/answers/${answerId}`).delete();
      },
    };
  }
}
