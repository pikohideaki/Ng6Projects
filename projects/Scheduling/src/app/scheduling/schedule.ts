import { IScheduleSymbol } from './schedule-symbol';
import { Answer } from './answer';
import { utils } from '../my-lib/utilities';



export interface ISchedule {
  id:                string;
  title:             string;
  notes:             string;
  symbols:           IScheduleSymbol[];
  // answers:           Answer[];
  password:          string;
  createdDate:       number;
  answerDeadline:    number;
  selectedDatetimes: number[];
}


export class Schedule implements ISchedule {
  id:                string           = '';
  title:             string           = '';
  notes:             string           = '';
  symbols:           IScheduleSymbol[] = [];
  // answers:           Answer[]         = [];
  password:          string           = '';
  createdDate:       number           = Date.now();
  answerDeadline:    number           = Date.now();
  selectedDatetimes: number[]         = [];

  constructor( initializer?: ISchedule ) {
    if ( !initializer ) return;

    this.id                = ( initializer.id       || '' );
    this.title             = ( initializer.title    || '' );
    this.notes             = ( initializer.notes    || '' );
    this.symbols           = ( initializer.symbols  || [] );
    this.password          = ( initializer.password || '' );
    // this.answers           = ( initializer.answers || [] ).map( e => new Answer(e) );
    this.createdDate       = ( initializer.createdDate || Date.now() );
    this.answerDeadline    = ( initializer.answerDeadline || Date.now() );
    this.selectedDatetimes = utils.array.copy( initializer.selectedDatetimes || [] );  // copy
  }

  asObject = (): ISchedule => ({
    id:                this.id,
    title:             this.title,
    notes:             this.notes,
    symbols:           this.symbols,
    // answers:           this.answers,
    password:          this.password,
    createdDate:       this.createdDate,
    answerDeadline:    this.answerDeadline,
    selectedDatetimes: this.selectedDatetimes,
  })
}
