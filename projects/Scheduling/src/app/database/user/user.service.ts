import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from './user';
import { DatabaseService } from '../database.service';


@Injectable()
export class UserService {
  uid$:        Observable<string>;
  signedIn$:   Observable<boolean>;

  private user$: Observable<User>;
  name$:         Observable<string>;
  nameYomi$:     Observable<string>;



  constructor(
    private afAuth: AngularFireAuth,
    private database: DatabaseService,
  ) {
    this.signedIn$ = this.afAuth.authState.pipe( map( user => !!user ) );
    this.uid$      = this.afAuth.authState.pipe( map( user => ( !user ? '' : user.uid ) ) );

    this.user$ = combineLatest(
        this.uid$,
        this.database.users$,
        ( uid: string, users: User[] ) =>
          (!uid || users.length === 0)
              ? new User()
              : users.find( e => e.id === uid ) || new User() );

    this.name$     = this.user$.pipe( map( e => e.name     ), distinctUntilChanged() );
    this.nameYomi$ = this.user$.pipe( map( e => e.nameYomi ), distinctUntilChanged() );
  }


  setMyName( uid: string, name: string ): Promise<void> {
    return this.database.user.updateName( uid, name );
  }
}
