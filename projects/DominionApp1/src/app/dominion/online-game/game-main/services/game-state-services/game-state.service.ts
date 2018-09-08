import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MyGameRoomService } from '../my-game-room.service';
import { GameRoomCommunicationService } from '../game-room-communication.service';
import { PlayerCards } from '../../../../../classes/online-game/player-cards';
import { GameState   } from '../../../../../classes/online-game/game-state';
import { TurnInfo    } from '../../../../../classes/online-game/turn-info';
import { PlayerData  } from '../../../../../classes/online-game/players-data';


@Injectable()
export class GameStateService {

  private gameStateSource = new BehaviorSubject<GameState>( new GameState() );
  gameState$: Observable<GameState> = this.gameStateSource.asObservable();

  private turnInfo$: Observable<TurnInfo> = this.gameState$.map( e => e.turnInfo );
  action$       = this.turnInfo$.map( e => e.action ).distinctUntilChanged();
  buy$          = this.turnInfo$.map( e => e.buy    ).distinctUntilChanged();
  coin$         = this.turnInfo$.map( e => e.coin   ).distinctUntilChanged();
  potion$       = this.turnInfo$.map( e => e.potion ).distinctUntilChanged();
  phase$        = this.turnInfo$.map( e => e.phase  ).distinctUntilChanged();
  runningCards$ = this.turnInfo$.map( e => e.runningCards );

  allPlayersData$  = this.gameState$.map( e => e.allPlayersData         );
  allPlayersCards$ = this.gameState$.map( e => e.DCards.allPlayersCards );
  BasicCards$      = this.gameState$.map( e => e.DCards.BasicCards      );
  KingdomCards$    = this.gameState$.map( e => e.DCards.KingdomCards    );
  trashPile$       = this.gameState$.map( e => e.DCards.trashPile       );
  BlackMarketPile$ = this.gameState$.map( e => e.DCards.BlackMarketPile );

  turnPlayerIndex$: Observable<number>
    = this.gameState$.map( e => e.turnPlayerIndex() ).distinctUntilChanged();
  nextTurnPlayerIndex$: Observable<number>
    = this.gameState$.map( e => e.nextTurnPlayerIndex() ).distinctUntilChanged();

  turnPlayersName$: Observable<string>
    = Observable.combineLatest(
          this.turnPlayerIndex$,
          this.myGameRoomService.playersNameShuffled$,
          (index, list) => list[index] );

  turnPlayerCards$: Observable<PlayerCards>
    = Observable.combineLatest(
        this.allPlayersCards$, this.turnPlayerIndex$,
        (allPlayersCards, turnPlayerIndex) =>
          allPlayersCards[ turnPlayerIndex ] || new PlayerCards() );

  myData$: Observable<PlayerData>
    = Observable.combineLatest(
        this.allPlayersData$, this.myGameRoomService.myIndex$,
        (allPlayersData, myIndex) =>
          allPlayersData[ myIndex ] || new PlayerData() );

  myCards$: Observable<PlayerCards>
    = Observable.combineLatest(
        this.allPlayersCards$, this.myGameRoomService.myIndex$,
        (allPlayersCards, myIndex) =>
          allPlayersCards[ myIndex ] || new PlayerCards() );

  isMyTurn$: Observable<boolean>
    = Observable.combineLatest(
        this.turnPlayerIndex$,
        this.myGameRoomService.myIndex$,
        (turnPlayerIndex, myIndex) => (turnPlayerIndex === myIndex) )
      .distinctUntilChanged()
      .startWith( false );

  gameIsOver$: Observable<boolean>
    = Observable.combineLatest(
          this.gameState$,
          this.gameRoomCommunication.isTerminated$,
          (gameState, isTerminated) =>
            gameState.gameIsOver() || isTerminated )
        .distinctUntilChanged();


  constructor(
    private myGameRoomService: MyGameRoomService,
    private gameRoomCommunication: GameRoomCommunicationService
  ) {
  }


  setGameState( gameState: GameState ) {
    this.gameStateSource.next( gameState );
  }

}
