import { utils } from '../my-lib/utilities';
import { SchedulingSymbol } from './scheduling-symbol';
import { Answer } from './answer';


export class SchedulingEvent {
  databaseKey:       string             = '';
  title:             string             = '';
  notes:             string             = '';
  selectedDatetimes: Date[]             = [];
  answerDeadline:    Date               = new Date();
  symbols:           SchedulingSymbol[] = [];
  answers:           Answer[]           = [];
  password:          string             = '';

  constructor( databaseKey?: string, initObj?: SchedulingEventInitObj ) {
    this.databaseKey = ( databaseKey || '' );

    if ( !initObj ) return;

    this.title = ( initObj.title || '' );
    this.notes = ( initObj.notes || '' );

    this.selectedDatetimes
      = ( initObj.selectedDatetimesTimeStamps || [] )
          .map( e => new Date( e || 0 ) );

    this.answerDeadline
      = new Date( initObj.answerDeadlineTimeStamp || 0 );

    this.symbols = ( initObj.symbols || [] );

    this.answers
      = ( utils.object.entries( initObj.answers )
          .map( e => new Answer( e.key, e.value ) ) || [] );

    this.password = ( initObj.password || '' );
  }
}



export interface SchedulingEventInitObj {
  title:                       string;
  notes:                       string;
  selectedDatetimesTimeStamps: number[];
  answerDeadlineTimeStamp:     number;
  symbols:                     SchedulingSymbol[];
  answers:                     object;
  password:                    string;
}

