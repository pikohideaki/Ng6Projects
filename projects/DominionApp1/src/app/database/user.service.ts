import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import {  } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../classes/user';
import { FireDatabaseService } from './database.service';


@Injectable()
export class UserService {
  private uid: string = '';
  uid$:           Observable<string>;
  signedIn$:      Observable<boolean>;
  myDisplayName$: Observable<string>;

  private user$: Observable<User>;

  name$:               Observable<string>;
  nameYomi$:           Observable<string>;
  randomizerGroupId$:  Observable<string>;
  onlineGame: {
    isSelectedExpansions$: Observable<boolean[]>,
    numberOfPlayers$:      Observable<number>,
    roomId$:               Observable<string>,
    communicationId$:      Observable<string>,
    chatOpened$:           Observable<boolean>,
    cardSizeAutoChange$:   Observable<boolean>,
    cardSizeRatio$:        Observable<number>,
    // messageSec$:           Observable<number>,
    autoSort$:             Observable<boolean>,
  };

  signedInToRandomizerGroup$: Observable<boolean>;



  constructor(
    private afAuth: AngularFireAuth,
    private database: FireDatabaseService,
  ) {
    this.signedIn$
      = this.afAuth.authState.map( user => !!user );
    this.uid$
      = this.afAuth.authState.map( user => ( !user ? '' : user.uid ) );
    this.myDisplayName$
      = this.afAuth.authState.map( user => ( !user ? '' : user.displayName ) );

    this.user$ = combineLatest(
        this.uid$,
        this.database.users$,
        ( uid: string, users: User[] ) =>
          (!uid || users.length === 0)
              ? new User()
              : users.find( e => e.databaseKey === uid ) || new User() );

    this.name$
      = this.user$.map( e => e.name )
          .distinctUntilChanged();
    this.nameYomi$
      = this.user$.map( e => e.nameYomi )
          .distinctUntilChanged();
    this.randomizerGroupId$
      = this.user$.map( e => e.randomizerGroupId )
          .distinctUntilChanged();
    this.onlineGame = {
      isSelectedExpansions$ : combineLatest(
                this.database.expansionNameList$.map( list => list.map( _ => false ) ),
                this.user$.map( e => e.onlineGame.isSelectedExpansions )
                  .distinctUntilChanged(),
                (initArray, isSelectedExpansions) =>
                    initArray.map( (_, i) => !!isSelectedExpansions[i] ) ),
      numberOfPlayers$ :
        this.user$.map( e => e.onlineGame.numberOfPlayers )
          .distinctUntilChanged(),
      roomId$ :
        this.user$.map( e => e.onlineGame.roomId )
          .distinctUntilChanged(),
      communicationId$ :
        this.user$.map( e => e.onlineGame.communicationId )
          .distinctUntilChanged(),
      chatOpened$ :
        this.user$.map( e => e.onlineGame.chatOpened )
          .distinctUntilChanged(),
      cardSizeAutoChange$ :
        this.user$.map( e => e.onlineGame.cardSizeAutoChange )
          .distinctUntilChanged(),
      cardSizeRatio$ :
        this.user$.map( e => e.onlineGame.cardSizeRatio )
          .distinctUntilChanged(),
      // messageSec$ :
      //   this.user$.map( e => e.onlineGame.messageSec )
      //     .distinctUntilChanged(),
      autoSort$ :
        this.user$.map( e => e.onlineGame.autoSort )
          .distinctUntilChanged(),
    };

    this.signedInToRandomizerGroup$
      = this.randomizerGroupId$.map( groupId => !!groupId );

    this.uid$.subscribe( val => this.uid = val );
  }


  setMyName( value: string ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.name( this.uid, value );
  }

  setRandomizerGroupId( value: string ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.randomizerGroupId( this.uid, value );
  }

  setOnlineGameIsSelectedExpansions( index: number, value: boolean ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.onlineGame.isSelectedExpansions( this.uid, index, value );
  }

  setOnlineGameNumberOfPlayers( value: number ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.onlineGame.numberOfPlayers( this.uid, value );
  }

  setOnlineGameRoomId( value: string ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.onlineGame.roomId( this.uid, value );
  }

  setGameCommunicationId( value: string ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.onlineGame.communicationId( this.uid, value );
  }

  setOnlineGameChatOpened( value: boolean ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.onlineGame.chatOpened( this.uid, value );
  }
  setOnlineGameCardSizeAutoChange( value: boolean ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.onlineGame.cardSizeAutoChange( this.uid, value );
  }
  setOnlineGameCardSizeRatio( value: number ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.onlineGame.cardSizeRatio( this.uid, value );
  }
  // setOnlineGameMessageSec( sec: number ) {
  //   if ( !this.uid ) return Promise.resolve();
  //   return this.database.user.set.onlineGame.messageSec( this.uid, sec );
  // }
  setOnlineGameAutoSort( value: boolean ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.onlineGame.autoSort( this.uid, value );
  }
}
