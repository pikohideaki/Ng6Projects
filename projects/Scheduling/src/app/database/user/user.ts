export class User {
  databaseKey: string;
  name:        string = '';
  nameYomi:    string = '';

  constructor( databaseKey?: string, initObj?: UserInitObj) {
    this.databaseKey = ( databaseKey || '' );

    if ( !initObj ) return;
    this.name      = ( initObj.name || '' );
    this.nameYomi  = ( initObj.nameYomi || '' );
  }
}

export interface UserInitObj {
  name:     string;
  nameYomi: string;
}
