import { ScheduleSymbolId } from './schedule-symbol';

export interface IAnswer {
  id:        string;
  userName:  string;  /* 回答者名 */
  comment:   string;
  selection: { date: number, symbolId: ScheduleSymbolId }[];
  timestamp: number;
}


export class Answer implements IAnswer {
  id:        string = '';
  userName:  string = '';  /* 回答者名 */
  comment:   string = '';
  selection: { date: number, symbolId: ScheduleSymbolId }[] = [];
  timestamp: number = Date.now();

  constructor( initializer?: IAnswer ) {
    if ( !initializer ) return;

    this.id        = ( initializer.id        || '' );
    this.userName  = ( initializer.userName  || '' );
    this.comment   = ( initializer.comment   || '' );
    this.selection = ( initializer.selection || [] ).map( e => ({
                        date: ( e.date || Date.now() ),
                        symbolId:  ( e.symbolId || 'ng' ),
                      }) );  // deep copy
    this.timestamp = ( initializer.timestamp || Date.now() );
  }

  asObject = (): IAnswer => ({
    id:        this.id,
    userName:  this.userName,
    comment:   this.comment,
    selection: this.selection,
    timestamp: this.timestamp,
  })
}
