import { FeedbackCategory } from './feedbackCategory';


export interface FeedbackInitObj {
  name:     string;
  content:  string;
  date:     Date;
  closed:   boolean;
  category: FeedbackCategory;
}


export class Feedback implements FeedbackInitObj {
  databaseKey: string;
  name:        string = '';
  content:     string = '';
  date:        Date;
  closed:      boolean = false;
  category:    FeedbackCategory;

  constructor( databaseKey?: string, initObj?: FeedbackInitObj ) {
    this.databaseKey = ( databaseKey || '' );

    if ( !initObj ) return;
    this.name     = ( initObj.name || '' );
    this.content  = ( initObj.content || '' );
    this.date     = ( initObj.date || new Date() );
    this.closed   = !!initObj.closed;
    this.category = ( initObj.category || '' );
  }
}

