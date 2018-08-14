import { firestore } from 'firebase';
import { timestampFrom } from '../af-utilities';


abstract class UserBase {
  id:        string = '';
  name:      string = '';
  nameYomi:  string = '';
  timestamp: (number | firestore.Timestamp) = Date.now();

  constructor( initializer?: UserBase ) {
    if ( !initializer ) return;

    this.id        = ( initializer.id       || '' );
    this.name      = ( initializer.name     || '' );
    this.nameYomi  = ( initializer.nameYomi || '' );
  }
}


export class User extends UserBase {
  id:        string = '';
  name:      string = '';
  nameYomi:  string = '';
  timestamp: number = Date.now();

  constructor( initializer?: (User|UserFS) ) {
    super();
    if ( !initializer ) return;
    if ( !initializer.timestamp ) return;

    if ( initializer instanceof User ) {
      this.timestamp = initializer.timestamp;
    } else {
      this.timestamp = ( initializer.timestamp.toMillis() );
    }
  }
}


// User class in firestore
export class UserFS extends UserBase {
  id:        string = '';
  name:      string = '';
  nameYomi:  string = '';
  timestamp: firestore.Timestamp = firestore.Timestamp.now();

  constructor( initializer?: (User|UserFS) ) {
    super();
    if ( !initializer ) return;
    if ( !initializer.timestamp ) return;

    if ( initializer instanceof User ) {
      this.timestamp = firestore.Timestamp.fromMillis( initializer.timestamp );
    } else {
      this.timestamp = timestampFrom( initializer.timestamp );
    }
  }
}
