import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';

import { GameRoom } from '../../types/game-room';
import { GameState } from '../../types/game-state';

import { UserService } from '../../../../database/user.service';
import { FireDatabaseService } from '../../../../database/database.service';
import { distinctUntilChanged, startWith, map, filter, first } from 'rxjs/operators';


@Injectable()
export class MyGameRoomService {

  myGameRoom$: Observable<GameRoom>
    = combineLatest(
        this.database.onlineGameRooms$,
        this.user.onlineGame.roomId$,
        (list, id) => (list.find( e => e.databaseKey === id ) || new GameRoom()) );

  initialState$: Observable<GameState>
    = this.myGameRoom$.pipe(
          map( e => e.initialState ),
          filter( e => !e.isEmpty() ) );

  myIndex$: Observable<number>
    = combineLatest(
          this.myGameRoom$.pipe(
              map( e => e.playersNameShuffled() ),
              distinctUntilChanged() ),
          this.user.name$,
          (playersName, myName) => playersName.findIndex( e => e === myName ) )
        .pipe( first() );

  playersNameShuffled$: Observable<string[]>
    = this.myGameRoom$.pipe( map( e => e.playersNameShuffled() ) );

  gameRoomCommunicationId$
    = this.myGameRoom$.pipe(
        map( e => e.gameRoomCommunicationId ),
        distinctUntilChanged() );

  private selectedCards$ = this.myGameRoom$.pipe( map( e => e.selectedCards ) );

  Prosperity$: Observable<boolean>
    = this.selectedCards$.pipe(
        map( e => e.Prosperity ),
        startWith( false ),
        distinctUntilChanged() );

  usePotion$: Observable<boolean>
    = combineLatest(
        this.selectedCards$,
        this.database.cardPropertyList$,
        (selectedCards, cardList) => selectedCards.usePotion( cardList ) )
        .pipe(
          startWith( false ),
          distinctUntilChanged(), );

  numberOfPlayers$: Observable<number>
    = this.myGameRoom$.pipe(
        map( e => e.numberOfPlayers ),
        distinctUntilChanged() );



  constructor(
    private database: FireDatabaseService,
    private user: UserService
  ) {
  }
}
