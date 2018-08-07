import { FeedbackCategory } from './feedbackCategory';


export class Feedback {
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
    this.date     = new Date( initObj.timeStamp || 0 );
    this.closed   = !!initObj.closed;
    this.category = ( initObj.category || '' );
  }
}


export interface FeedbackInitObj {
  name:      string;
  content:   string;
  timeStamp: number;
  closed:    boolean;
  category:  FeedbackCategory;
}
