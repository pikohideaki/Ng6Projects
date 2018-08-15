import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore } from 'angularfire2/firestore';

import { User, IUser } from './user/user';
import { Feedback, IFeedback } from '../feedback/feedback';
import { Schedule, ISchedule } from '../scheduling/schedule';
import { Answer, IAnswer } from '../scheduling/answer';
// import { utils } from '../my-lib/utilities';



@Injectable()
export class MyAngularFireDatabaseService {

  private collRef = {
    users:
      this.afs.collection<IUser>( 'users', ref => ref.orderBy('nameYomi') ),
    feedBacks:
      this.afs.collection<IFeedback>( 'feedbacks', ref => ref.orderBy('timestamp') ),
    schedules:
      this.afs.collection<ISchedule>( 'schedules', ref => ref.orderBy('createdDate') ),

    answers: (scheduleId: string) =>
      this.collRef.schedules.doc( scheduleId ).collection<IAnswer>( 'answers', ref => ref.orderBy('timestamp') ),
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
    answers$:     (scheduleId: string)                   => Observable<Answer[]>,
    addAnswer:    (scheduleId: string, answer: Answer)   => Promise<string>,
    updateAnswer: (scheduleId: string, answer: Answer)   => Promise<void>,
    deleteAnswer: (scheduleId: string, answerId: string) => Promise<void>,
  };


  constructor(
    private afs: AngularFirestore
  ) {
    this.users$
      = this.collRef.users.valueChanges()
          .pipe( map( users => users.map( user => new User( user ) ) ) );

    this.feedbacks$
      = this.collRef.feedBacks.valueChanges()
          .pipe( map( feedbacks => feedbacks.map( fb => new Feedback( fb ) ) ) );

    this.schedules$
      = this.collRef.schedules.valueChanges()
          .pipe( map( evlist => evlist.map( ev => new Schedule( ev ) ) ) );


    /* methods */

    this.user = {
      add: async (user: User) => {
        user.timestamp = (user.timestamp || Date.now());
        const docref = await this.collRef.users.add( user.asObject() );
        user.id = docref.id;
        await docref.update( user.asObject() );
        return user.id;
      },

      update: async (user: User) => {
        await this.collRef.users.doc( user.id ).set( user.asObject() );
      },

      delete: async (uid: string) => {
        await this.collRef.users.doc( uid ).delete();
      },

      updateName: async (uid: string, name: string) => {
        await this.collRef.users.doc( uid ).update({ name: name });
      }
    };


    this.feedback = {
      add: async (fb: Feedback) => {
        const docref = await this.collRef.feedBacks.add( fb.asObject() );
        fb.id = docref.id;
        await docref.update( fb.asObject() );
        return fb.id;
      },

      update: async (fb: Feedback) => {
        await this.collRef.feedBacks.doc( fb.id ).update( fb.asObject() );
      },

      delete: async (id: string) => {
        await this.collRef.feedBacks.doc( id ).delete();
      },

      closeIssue: async (id: string) => {
        await this.collRef.feedBacks.doc( id ).set({ closed: true });
      },

      openIssue: async (id: string) => {
        await this.collRef.feedBacks.doc( id ).set({ closed: false });
      },
    };

    this.scheduling = {
      add: async (schedule: Schedule) => {
        const docref = await this.collRef.schedules.add( schedule.asObject() );
        schedule.id = docref.id;
        await docref.update( schedule.asObject() );
        return schedule.id;
      },

      update: async (schedule: Schedule) => {
        await this.collRef.schedules.doc( schedule.id ).update( schedule.asObject() );
      },

      delete: async (scheduleId: string) => {
        await this.collRef.schedules.doc( scheduleId ).delete();
      },

      answers$: (scheduleId: string) =>
        this.collRef.answers( scheduleId ).valueChanges()
          .pipe( map( answers => answers.map( ans => new Answer( ans ) ) ) ),

      addAnswer: async (scheduleId: string, answer: Answer) => {
        const docref = await this.collRef.answers( scheduleId ).add( answer.asObject() );
        answer.id = docref.id;
        await docref.update( answer.asObject() );
        return answer.id;
      },

      updateAnswer: async (scheduleId: string, answer: Answer) => {
        await this.collRef.answers( scheduleId ).doc( answer.id ).update( answer.asObject() );
      },

      deleteAnswer: async (scheduleId: string, answerId: string) => {
        await this.collRef.answers( scheduleId ).doc( answerId ).delete();
      },
    };
  }
}
