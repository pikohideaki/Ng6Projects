export interface IUser {
  id:        string;
  name:      string;
  nameYomi:  string;
  timestamp: number;
}


export class User implements IUser {
  id:        string = '';
  name:      string = '';
  nameYomi:  string = '';
  timestamp: number = Date.now();

  constructor( initializer?: IUser ) {
    if ( !initializer ) return;

    this.id        = ( initializer.id        || '' );
    this.name      = ( initializer.name      || '' );
    this.nameYomi  = ( initializer.nameYomi  || '' );
    this.timestamp = ( initializer.timestamp || Date.now() );
  }

  asObject = (): IUser => ({
    id:        this.id,
    name:      this.name,
    nameYomi:  this.nameYomi,
    timestamp: this.timestamp,
  })
}
