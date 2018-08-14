import { firestore } from 'firebase';
import { timestampFrom } from '../database/af-utilities';

abstract class AnswerBase {
  id:        string = '';
  userName:  string = '';  /* 回答者名 */
  comment:   string = '';
  selection: { timestamp: (number|firestore.Timestamp), symbolId: string }[] = [];
  timestamp: (number|firestore.Timestamp) = Date.now();

  constructor( initializer?: Answer ) {
    if ( !initializer ) return;

    this.id        = ( initializer.id        || '' );
    this.userName  = ( initializer.userName  || '' );
    this.comment   = ( initializer.comment   || '' );
  }
}

export class Answer extends AnswerBase {
  id:        string = '';
  userName:  string = '';  /* 回答者名 */
  comment:   string = '';
  selection: { timestamp: number, symbolId: string }[] = [];
  timestamp: number = Date.now();

  constructor( initializer?: (Answer|AnswerFS) ) {
    super();
    if ( !initializer ) return;

    if ( !!initializer.timestamp ) {
      if ( initializer instanceof Answer ) {
        this.timestamp = initializer.timestamp;
      } else {
        this.timestamp = ( initializer.timestamp.toMillis() );
      }
    }

    if ( !!initializer.selection ) {
      if ( initializer instanceof Answer ) {
        this.selection = initializer.selection.map( e => ({
                              timestamp: e.timestamp,
                              symbolId:  e.symbolId
                            }) );  // deep copy
      } else {
        this.selection = initializer.selection.map( e => ({
                              timestamp: e.timestamp.toMillis(),
                              symbolId:  e.symbolId
                            }) );  // deep copy
      }
    }

  }
}


export class AnswerFS extends AnswerBase {
  id:        string = '';
  userName:  string = '';  /* 回答者名 */
  comment:   string = '';
  selection: { timestamp: firestore.Timestamp, symbolId: string }[] = [];
  timestamp: firestore.Timestamp = firestore.Timestamp.now();

  constructor( initializer?: (Answer|AnswerFS) ) {
    super();
    if ( !initializer ) return;

    if ( !!initializer.timestamp ) {
      if ( initializer instanceof Answer ) {
        this.timestamp = firestore.Timestamp.fromMillis( initializer.timestamp );
      } else {
        this.timestamp = timestampFrom( initializer.timestamp );
      }
    }

    if ( !!initializer.selection ) {
      if ( initializer instanceof Answer ) {
        this.selection = initializer.selection.map( e => ({
                              timestamp: firestore.Timestamp.fromMillis( e.timestamp ),
                              symbolId:  e.symbolId
                            }) );  // deep copy
      } else {
        this.selection = initializer.selection.map( e => ({
                              timestamp: timestampFrom( e.timestamp ),
                              symbolId:  e.symbolId
                            }) );  // deep copy
      }
    }
  }
}
