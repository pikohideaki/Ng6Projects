import { firestore } from 'firebase';

import { FeedbackCategory } from './feedback-category';
import { timestampFrom } from '../database/af-utilities';


abstract class FeedbackBase {
  id:        string           = '';
  name:      string           = '';
  content:   string           = '';
  category:  FeedbackCategory = '';
  closed:    boolean          = false;
  timestamp: (number | firestore.Timestamp) = Date.now();

  constructor( initializer?: FeedbackBase ) {
    if ( !initializer ) return;

    this.id        = ( initializer.id        || '' );
    this.name      = ( initializer.name      || '' );
    this.content   = ( initializer.content   || '' );
    this.category  = ( initializer.category  || '' );
    this.closed    = !!initializer.closed;
  }
}


export class Feedback extends FeedbackBase {
  id:        string           = '';
  name:      string           = '';
  content:   string           = '';
  category:  FeedbackCategory = '';
  closed:    boolean          = false;
  timestamp: number           = Date.now();

  constructor( initializer?: (Feedback|FeedbackFS) ) {
    super();
    if ( !initializer ) return;
    if ( !initializer.timestamp ) return;

    if ( initializer instanceof Feedback ) {
      this.timestamp = ( initializer.timestamp );
    } else {
      this.timestamp = ( initializer.timestamp.toMillis() );
    }
  }
}



// Feedback class in firestore
export class FeedbackFS extends FeedbackBase {
  id:        string              = '';
  name:      string              = '';
  content:   string              = '';
  category:  FeedbackCategory    = '';
  closed:    boolean             = false;
  timestamp: firestore.Timestamp = firestore.Timestamp.now();

  constructor( initializer?: (Feedback|FeedbackFS) ) {
    super();
    if ( !initializer ) return;
    if ( !initializer.timestamp ) return;

    if ( initializer instanceof Feedback ) {
      this.timestamp = firestore.Timestamp.fromMillis( initializer.timestamp );
    } else {
      this.timestamp = timestampFrom( initializer.timestamp );
    }
  }
}
