import { firestore } from 'firebase';

import { ScheduleSymbol } from './schedule-symbol';
import { Answer, AnswerFS } from './answer';
import { utils } from '../my-lib/utilities';
import { timestampFrom } from '../database/af-utilities';


abstract class ScheduleBase {
  id:                string              = '';
  title:             string              = '';
  notes:             string              = '';
  symbols:           ScheduleSymbol[]    = [];
  answers:           (Answer|AnswerFS)[] = [];
  password:          string              = '';
  createdDate:       (number | firestore.Timestamp) = Date.now();
  answerDeadline:    (number | firestore.Timestamp) = Date.now();
  selectedDatetimes: (number | firestore.Timestamp)[] = [];

  constructor( initializer?: ScheduleBase ) {
    if ( !initializer ) return;

    this.id       = ( initializer.id       || '' );
    this.title    = ( initializer.title    || '' );
    this.notes    = ( initializer.notes    || '' );
    this.symbols  = ( initializer.symbols  || [] );
    this.password = ( initializer.password || '' );
  }
}


export class Schedule extends ScheduleBase {
  id:                string           = '';
  title:             string           = '';
  notes:             string           = '';
  symbols:           ScheduleSymbol[] = [];
  answers:           Answer[]         = [];
  password:          string           = '';
  createdDate:       number           = Date.now();
  answerDeadline:    number           = Date.now();
  selectedDatetimes: number[]         = [];

  constructor( initializer?: (Schedule|ScheduleFS) ) {
    super();
    if ( !initializer ) return;

    if ( !!initializer.answers ) {
      if ( initializer instanceof Schedule ) {
        this.answers = initializer.answers.map( e => new Answer(e) );
      } else {
        this.answers = initializer.answers.map( e => new Answer(e) );
      }
    }

    if ( !!initializer.createdDate ) {
      if ( initializer instanceof Schedule ) {
        this.createdDate = initializer.createdDate;
      } else {
        this.createdDate = ( initializer.createdDate.toMillis() );
      }
    }

    if ( !!initializer.answerDeadline ) {
      if ( initializer instanceof Schedule ) {
        this.answerDeadline = initializer.answerDeadline;
      } else {
        this.answerDeadline = ( initializer.answerDeadline.toMillis() );
      }
    }

    if ( !!initializer.selectedDatetimes ) {
      if ( initializer instanceof Schedule ) {
        this.selectedDatetimes = utils.array.copy( initializer.selectedDatetimes );  // copy
      } else {
        this.selectedDatetimes = initializer.selectedDatetimes.map( e => e.toMillis() );
      }
    }
  }
}



export class ScheduleFS extends ScheduleBase {
  id:                string           = '';
  title:             string           = '';
  notes:             string           = '';
  symbols:           ScheduleSymbol[] = [];
  answers:           AnswerFS[]         = [];
  password:          string           = '';
  createdDate:       firestore.Timestamp   = firestore.Timestamp.now();
  answerDeadline:    firestore.Timestamp   = firestore.Timestamp.now();
  selectedDatetimes: firestore.Timestamp[] = [];

  constructor( initializer?: (Schedule|ScheduleFS) ) {
    super();
    if ( !initializer ) return;

    if ( !!initializer.answers ) {
      if ( initializer instanceof Schedule ) {
        this.answers = initializer.answers.map( e => new AnswerFS(e) );
      } else {
        this.answers = initializer.answers.map( e => new AnswerFS(e) );
      }
    }

    if ( !!this.createdDate ) {
      if ( initializer instanceof Schedule ) {
        this.createdDate = firestore.Timestamp.fromMillis( initializer.createdDate );
      } else {
        this.createdDate = firestore.Timestamp.fromMillis( initializer.createdDate.toMillis() );
      }
    }

    if ( !!this.answerDeadline ) {
      if ( initializer instanceof Schedule ) {
        this.answerDeadline = firestore.Timestamp.fromMillis( initializer.answerDeadline );
      } else {
        this.answerDeadline = firestore.Timestamp.fromMillis( initializer.answerDeadline.toMillis() );
      }
    }

    if ( !!this.selectedDatetimes ) {
      if ( initializer instanceof Schedule ) {
        this.selectedDatetimes = initializer.selectedDatetimes.map( e => firestore.Timestamp.fromMillis(e) );
      } else {
        this.selectedDatetimes = initializer.selectedDatetimes.map( e => timestampFrom(e) );
      }
    }
  }
}
