export class Answer {
  databaseKey: string = '';
  userName:    string = '';  /* 回答者名 */
  comment:     string = '';
  selection:   { date: Date, symbolID: string }[] = [];

  constructor( databaseKey?: string, initObj?: {
    userName: string,
    comment: string,
    selection: { timeStamp: number, symbolID: string }[],
  }) {
    this.databaseKey = ( databaseKey || '' );

    if ( !initObj ) return;
    this.userName = ( initObj.userName || '' );
    this.comment  = ( initObj.comment  || '' );
    this.selection = ( (initObj.selection || []).map( e => ({
                          date     : new Date( e.timeStamp ),
                          symbolID : e.symbolID,
                        })) || [] );
  }
}


