
import { FeedbackCategory } from './feedback-category';

export interface IFeedback {
  id:        string;
  name:      string;
  content:   string;
  category:  FeedbackCategory;
  closed:    boolean;
  timestamp: number;
}


export class Feedback implements IFeedback {
  id:        string           = '';
  name:      string           = '';
  content:   string           = '';
  category:  FeedbackCategory = '';
  closed:    boolean          = false;
  timestamp: number           = Date.now();

  constructor( initializer?: IFeedback ) {
    if ( !initializer ) return;

    this.id        = ( initializer.id        || '' );
    this.name      = ( initializer.name      || '' );
    this.content   = ( initializer.content   || '' );
    this.category  = ( initializer.category  || '' );
    this.closed    = !!initializer.closed;
    this.timestamp = ( initializer.timestamp || Date.now() );
  }

  asObject = (): IFeedback => ({
    id:        this.id,
    name:      this.name,
    content:   this.content,
    category:  this.category,
    closed:    this.closed,
    timestamp: this.timestamp,
  })
}
