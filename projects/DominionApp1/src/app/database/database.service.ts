import { Injectable, isDevMode } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';

import { AngularFirestore    } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { utils } from '../mylib/utilities';

import { User                  } from './user';
import { CardProperty          } from '../dominion/types/card-property';
import { GameResult            } from '../dominion/types/game-result';
import { SelectedCards         } from '../dominion/types/selected-cards';
import { SelectedCardsCheckbox } from '../dominion/types/selected-cards-checkbox-values';
import { BlackMarketPileCard   } from '../dominion/types/black-market-pile-card';
import { NumberOfVictoryCards  } from '../dominion/types/number-of-victory-cards';
import { RandomizerGroup       } from '../dominion/online-randomizer/types/randomizer-group';
import { PlayerResult          } from '../dominion/online-randomizer/types/player-result';
import { GameRoom              } from '../dominion/online-game/types/game-room';
import { ChatMessage           } from '../dominion/online-game/types/chat-message';
import { GameCommunication     } from '../dominion/online-game/types/game-room-communication';
import { UserInput             } from '../dominion/online-game/types/user-input';
import { map, first } from 'rxjs/operators';


@Injectable()
export class FireDatabaseService {
  fdPath = ( isDevMode() ? {
    expansionNameList           : '/dev/data/expansionNameList',
    cardPropertyList            : '/dev/data/cardPropertyList',
    scoringTable                : '/dev/data/scoreTable',
    users                       : '/dev/users',
    gameResultList              : '/dev/gameResultList',
    randomizerGroupList         : '/dev/randomizerGroupList',
    onlineGameRoomsList         : '/dev/onlineGameRooms',
    onlineGameCommunicationList : '/dev/onlineGameCommunicationList',
  } : {
    expansionNameList           : '/prod/data/expansionNameList',
    cardPropertyList            : '/prod/data/cardPropertyList',
    scoringTable                : '/prod/data/scoreTable',
    users                       : '/prod/users',
    gameResultList              : '/prod/gameResultList',
    randomizerGroupList         : '/prod/randomizerGroupList',
    onlineGameRoomsList         : '/prod/onlineGameRooms',
    onlineGameCommunicationList : '/prod/onlineGameCommunicationList',
  } );


  expansionNameList$:           Observable<string[]>;
  cardPropertyList$:            Observable<CardProperty[]>;
  users$:                       Observable<User[]>;
  scoringTable$:                Observable<number[][]>;
  gameResultList$:              Observable<GameResult[]>;
  randomizerGroupList$:         Observable<RandomizerGroup[]>;
  onlineGameRooms$:             Observable<GameRoom[]>;
  onlineGameCommunicationList$: Observable<GameCommunication[]>;


  /* methods */
  user: {
    setUser: ( uid: string, newUser: User ) => Promise<void>,
    set: {
      name:              ( uid: string, value: string ) => Promise<void>,
      nameYomi:          ( uid: string, value: string ) => Promise<void>,
      randomizerGroupId: ( uid: string, value: string ) => Promise<void>,
      onlineGame: {
        isSelectedExpansions: ( uid: string, index: number, value: boolean ) => Promise<void>,
        numberOfPlayers:      ( uid: string, value: number                 ) => Promise<void>,
        roomId:               ( uid: string, value: string                 ) => Promise<void>,
        communicationId:      ( uid: string, value: string                 ) => Promise<void>,
        chatOpened:           ( uid: string, value: boolean                ) => Promise<void>,
        cardSizeAutoChange:   ( uid: string, value: boolean                ) => Promise<void>,
        cardSizeRatio:        ( uid: string, value: number                 ) => Promise<void>,
        // messageSec:           ( uid: string, value: number                 ) => Promise<void>,
        autoSort:             ( uid: string, value: boolean                ) => Promise<void>,
      }
    }
  };

  gameResult: {
    add:     ( gameResult: GameResult     ) => firebase.database.ThenableReference,
    remove:  ( key: string                ) => Promise<void>,
    setMemo: ( key: string, value: string ) => Promise<void>,
  };

  randomizerGroup: {
    addGroup:    ( newGroup: RandomizerGroup ) => firebase.database.ThenableReference,
    removeGroup: ( groupId: string           ) => Promise<void>,
    set: {
      isSelectedExpansions:    ( groupId: string, index: number, value: boolean                    ) => Promise<void>,
      selectedCardsCheckbox:   ( groupId: string, arrayName: string, index: number, value: boolean ) => Promise<void>,
      BlackMarketPileShuffled: ( groupId: string, value: BlackMarketPileCard[]                     ) => Promise<void>,
      BlackMarketPhase:        ( groupId: string, value: number                                    ) => Promise<void>,
      selectedIndexInHistory:  ( groupId: string, value: number                                    ) => Promise<void>,
      newGameResult: {
        players: {
          selected:  ( groupId: string, uid: string, value: boolean ) => Promise<void>,
          turnOrder: ( groupId: string, uid: string, value: number  ) => Promise<void>,
          VP:        ( groupId: string, uid: string, value: number  ) => Promise<void>,
          numberOfVictoryCards: ( groupId: string, uid: string, value: NumberOfVictoryCards ) => Promise<void>,
        },
        lastTurnPlayerName: ( groupId: string, value: string ) => Promise<void>,
        place:              ( groupId: string, value: string ) => Promise<void>,
        memo:               ( groupId: string, value: string ) => Promise<void>,
      },
      newGameResultDialogOpened: ( groupId: string, value: boolean ) => Promise<void>,
    },
    add: {
      member:                ( groupId: string, uid: string, value: PlayerResult ) => Promise<void>,
      selectedCardsHistory:  ( groupId: string, value: SelectedCards             ) => firebase.database.ThenableReference,
    },
    remove: {
      member: ( groupId: string, uid: string ) => Promise<void>,
    },
    reset: {
      selectedCardsCheckbox: ( groupId: string ) => Promise<void>,
      VPCalculator:          ( groupId: string ) => Promise<void>,
    },
  };

  onlineGameRoom: {
    add:          ( newGameRoom: GameRoom              ) => firebase.database.ThenableReference,
    remove:       ( roomId: string                     ) => Promise<void>,
    addMember:    ( roomId: string, playerName: string ) => firebase.database.ThenableReference,
    removeMember: ( roomId: string, uid: string        ) => Promise<void>,
  };

  onlineGameCommunication: {
    add:         ( newGameComm: GameCommunication        ) => firebase.database.ThenableReference,
    remove:      ( roomId: string                        ) => Promise<void>,
    sendMessage: ( roomId: string, message: ChatMessage  ) => firebase.database.ThenableReference,
    sendUserInput:           ( roomId: string, userInput: UserInput ) => firebase.database.ThenableReference,
    removeAllUserInput:      ( roomId: string ) => Promise<void>,
    setThinkingState:        ( roomId: string, playerId: number, state: boolean ) => Promise<void>,
    setPresenceState:      ( roomId: string, playerId: number, state: boolean ) => Promise<void>,
    setTerminatedState:      ( roomId: string, state: boolean ) => Promise<void>,
    setResultSubmittedState: ( roomId: string, state: boolean ) => Promise<void>,
  };



  constructor(
    private afs: AngularFirestore,
    private afdb: AngularFireDatabase,
  ) {
    this.expansionNameList$
      = afdb.list<string>( this.fdPath.expansionNameList ).valueChanges()
          .pipe(
            map( list => list.map( e => e.toString() ) ),
            first() );

    this.cardPropertyList$
      = afdb.list<CardProperty>( this.fdPath.cardPropertyList ).valueChanges()
          .pipe(
            map( list => list.map( (e: any, i) => new CardProperty(i, e) ) ),
            first() );

    this.users$
      = this.afdb.list( this.fdPath.users, ref => ref.orderByChild('nameYomi') ).snapshotChanges()
          .pipe(
            map( actions => actions.map( action => new User( action.key || '', action.payload.val() as any ) ) ) );

    this.scoringTable$
      = afdb.list<number[]>( this.fdPath.scoringTable ).valueChanges();

    this.gameResultList$
      = combineLatest(
          this.scoringTable$,
          this.afdb.list<GameResult>( this.fdPath.gameResultList ).snapshotChanges(),
          (scoringTable: number[][], actions) => {
              const gameResultList = actions.map( action => new GameResult( action.key || '', action.payload.val() as any ) );
              gameResultList.forEach( (gr, index) => {
                gr.setScores( scoringTable );
                gr.no = index + 1;
              } );
              return gameResultList;
            } );


    this.randomizerGroupList$
      = this.afdb.list( this.fdPath.randomizerGroupList ).snapshotChanges()
          .pipe( map( actions => actions.map( action =>
              new RandomizerGroup( action.key || '', action.payload.val() as any ) ) ) );

    this.onlineGameRooms$
      = this.afdb.list( this.fdPath.onlineGameRoomsList ).snapshotChanges()
          .pipe( map( actions => actions.map( action =>
            new GameRoom( action.key || '', action.payload.val() as any ) ) ) );

    this.onlineGameCommunicationList$
      = this.afdb.list( this.fdPath.onlineGameCommunicationList ).snapshotChanges()
          .pipe( map( actions => actions.map( action =>
            new GameCommunication( action.key || '', action.payload.val() as any ) ) ) );


    /*** methods ***/

    const userSetProperty = ( uid: string, pathPrefix: string, value: any ) => {
      if ( !uid ) throw new Error('uid is empty');
      return this.afdb.object( `${this.fdPath.users}/${uid}/${pathPrefix}` )
                      .set( value );
    };
    this.user = {
      setUser: ( uid: string, newUser: User ) => {
        const newUserObj = utils.object.copy( newUser );
        delete newUserObj.databaseKey;
        return this.afdb.object(`${this.fdPath.users}/${uid}`).set( newUserObj );
      },

      set: {
        name: ( uid: string, value: string ) =>
          userSetProperty( uid, 'name', value ),

        nameYomi: ( uid: string, value: string ) =>
          userSetProperty( uid, 'nameYomi', value ),

        randomizerGroupId: ( uid: string, value: string ) =>
          userSetProperty( uid, 'randomizerGroupId', value ),

        onlineGame: {
          isSelectedExpansions: ( uid: string, index: number, value: boolean ) =>
            userSetProperty( uid, `onlineGame/isSelectedExpansions/${index}`, value ),

          numberOfPlayers: ( uid: string, value: number ) =>
            userSetProperty( uid, 'onlineGame/numberOfPlayers', value ),

          roomId: ( uid: string, value: string ) =>
            userSetProperty( uid, 'onlineGame/roomId', value ),

          communicationId: ( uid: string, value: string ) =>
            userSetProperty( uid, 'onlineGame/communicationId', value ),

          chatOpened: ( uid: string, value: boolean ) =>
            userSetProperty( uid, 'onlineGame/chatOpened', value ),

          cardSizeAutoChange: ( uid: string, value: boolean ) =>
            userSetProperty( uid, 'onlineGame/cardSizeAutoChange', value ),

          cardSizeRatio: ( uid: string, value: number ) =>
            userSetProperty( uid, 'onlineGame/cardSizeRatio', value ),

          // messageSec: ( uid: string, value: number ) =>
          //   userSetProperty( uid, 'onlineGame/messageSec', value ),

          autoSort: ( uid: string, value: boolean ) =>
            userSetProperty( uid, 'onlineGame/autoSort', value ),

        }
      }
    };



    this.gameResult = {
      add: ( gameResult: GameResult ) => {
        const copy = utils.object.copy( gameResult );
        delete copy.no;
        delete copy.date;
        copy.timeStamp = gameResult.date.getTime();
        copy.players.forEach( (pl: any) => {
          // delete pl.rank;
          delete pl.score;
        });
        return this.afdb.list( this.fdPath.gameResultList ).push( copy );
      },

      remove: ( key: string ) =>
        this.afdb.list( `${this.fdPath.gameResultList}/${key}` ).remove(),

      setMemo: ( key: string, value: string ) =>
        this.afdb.object( `${this.fdPath.gameResultList}/${key}/memo` ).set( value ),
    };



    const randomizerGroupSetValue = ( groupId: string, pathPrefix: string, value: any ) => {
      if ( !groupId ) {
        throw new Error(`groupId is empty.
          (groupId = "${groupId}", path="${pathPrefix}", value="${value}")`);
      }
      return this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupId}/${pathPrefix}` )
                      .set( value );
    };
    const randomizerGroupPushValue = ( groupId: string, pathPrefix: string, value: any ) => {
      if ( !groupId ) {
        throw new Error(`groupId is empty.
          (groupId = "${groupId}", path="${pathPrefix}", value="${value}")`);
      }
      return this.afdb.list( `${this.fdPath.randomizerGroupList}/${groupId}/${pathPrefix}` )
                      .push( value );
    };

    this.randomizerGroup = {
      addGroup: ( newGroup: RandomizerGroup ) => {
        const newGroupObj = utils.object.copy( newGroup );  // deep copy
        newGroupObj.timeStamp = newGroup.date.valueOf();
        delete newGroupObj.date;
        delete newGroupObj.databaseKey;
        newGroupObj.newGameResult.players = {};
        newGroup.newGameResult.players.forEach( e => {
          const playerResultObj = utils.object.copy(e);
          delete playerResultObj.uid;
          newGroupObj.newGameResult.players[e.uid] = playerResultObj;
        } );
        return this.afdb.list( this.fdPath.randomizerGroupList ).push( newGroupObj );
      },

      removeGroup: ( groupId: string ) =>
        this.afdb.list( this.fdPath.randomizerGroupList ).remove( groupId ),

      set: {
        isSelectedExpansions: ( groupId: string, index: number, value: boolean ) =>
          randomizerGroupSetValue( groupId, `isSelectedExpansions/${index}`, value ),

        selectedCardsCheckbox: ( groupId: string, arrayName: string, index: number, value: boolean ) => {
          switch ( arrayName ) {
            case 'KingdomCards10' :
            case 'BaneCard' :
            case 'EventCards' :
            case 'LandmarkCards' :
            case 'Obelisk' :
            case 'BlackMarketPile' :
              return randomizerGroupSetValue( groupId, `selectedCardsCheckbox/${arrayName}/${index}`, value );

            default :
              console.error( `at fire-database-mediator.service::randomizerGroup::selectedCardsCheckbox
                               : '${arrayName}' is not allowed `);
              return Promise.resolve();
          }
        },

        BlackMarketPileShuffled: ( groupId: string, value: BlackMarketPileCard[] ) =>
          randomizerGroupSetValue( groupId, 'BlackMarketPileShuffled', value ),

        BlackMarketPhase: ( groupId: string, value: number ) =>
          randomizerGroupSetValue( groupId, 'BlackMarketPhase', value ),

        selectedIndexInHistory: ( groupId: string, value: number ) =>
          randomizerGroupSetValue( groupId, 'selectedIndexInHistory', value ),

        newGameResult: {
          players: {
            selected: ( groupId: string, uid: string, value: boolean ) =>
              randomizerGroupSetValue( groupId, `newGameResult/players/${uid}/selected`, value ),

            turnOrder: ( groupId: string, uid: string, value: number ) =>
              randomizerGroupSetValue( groupId, `newGameResult/players/${uid}/turnOrder`, value ),

            VP: ( groupId: string, uid: string, value: number ) =>
              randomizerGroupSetValue( groupId, `newGameResult/players/${uid}/VP`, value ),

            numberOfVictoryCards: ( groupId: string, uid: string, value: NumberOfVictoryCards ) =>
              randomizerGroupSetValue( groupId, `newGameResult/players/${uid}/NofVictoryCards`, value ),
          },
          lastTurnPlayerName: ( groupId: string, value: string ) =>
            randomizerGroupSetValue( groupId, `newGameResult/lastTurnPlayerName`, value ),

          place: ( groupId: string, value: string ) =>
            randomizerGroupSetValue( groupId, `newGameResult/place`, value ),

          memo:  ( groupId: string, value: string ) =>
            randomizerGroupSetValue( groupId, `newGameResult/memo`, value ),
        },

        newGameResultDialogOpened: ( groupId: string, value: boolean ) =>
          randomizerGroupSetValue( groupId, `newGameResultDialogOpened`, value ),
      },


      add: {
        member: ( groupId: string, uid: string, value: PlayerResult ) => {
          const obj = utils.object.copy( value );
          delete obj.uid;
          return randomizerGroupSetValue( groupId, `newGameResult/players/${uid}`, obj );
        },

        selectedCardsHistory: ( groupId: string, value: SelectedCards ) => {
          const obj = utils.object.copy( value );
          delete obj.date;
          obj.timeStamp = value.date.valueOf();
          return randomizerGroupPushValue( groupId, 'selectedCardsHistory', obj );
        },
      },
      remove: {
        member: ( groupId: string, uid: string ) =>
          this.afdb.list( `${this.fdPath.randomizerGroupList}/${groupId}/newGameResult/players` ).remove( uid ),
      },
      reset: {
        selectedCardsCheckbox: ( groupId: string ) =>
          randomizerGroupSetValue( groupId, 'selectedCardsCheckbox', new SelectedCardsCheckbox() ),

        VPCalculator:          ( groupId: string ) =>
          randomizerGroupSetValue( groupId, 'resetVPCalculator', Date.now() ),
      },
    };


    this.onlineGameRoom = {
      add: ( newGameRoom: GameRoom ) => {
        const newGameRoomObj = utils.object.copy( newGameRoom );  // deep copy
        newGameRoomObj.timeStamp = newGameRoomObj.date.valueOf();
        delete newGameRoomObj.date;
        delete newGameRoomObj.databaseKey;
        return this.afdb.list( this.fdPath.onlineGameRoomsList ).push( newGameRoomObj );
      },

      remove: ( roomId: string ) =>
        this.afdb.list( this.fdPath.onlineGameRoomsList ).remove( roomId ),

      addMember: ( roomId: string, playerName: string ) =>
        this.afdb.list( `${this.fdPath.onlineGameRoomsList}/${roomId}/playersNameList` ).push( playerName ),

      removeMember: ( roomId: string, uid: string ) =>
        this.afdb.list( `${this.fdPath.onlineGameRoomsList}/${roomId}/playersNameList` ).remove( uid ),
    };


    this.onlineGameCommunication = {
      add:        ( newGameComm: GameCommunication ) =>
        this.afdb.list( this.fdPath.onlineGameCommunicationList ).push( newGameComm ),

      remove:     ( roomId: string ) =>
        this.afdb.list( this.fdPath.onlineGameCommunicationList ).remove( roomId ),

      sendMessage: ( roomId: string, message: ChatMessage ) =>
        this.afdb.list(`${this.fdPath.onlineGameCommunicationList}/${roomId}/chatList`).push( message.asObj() ),

      sendUserInput:    ( roomId: string, userInput: UserInput ) =>
        this.afdb.list(`${this.fdPath.onlineGameCommunicationList}/${roomId}/userInputList`).push( userInput ),

      removeAllUserInput: ( roomId: string ) =>
        this.afdb.list(`${this.fdPath.onlineGameCommunicationList}/${roomId}/userInputList`).remove()
        .then( () =>
          this.afdb.object(`${this.fdPath.onlineGameCommunicationList}/${roomId}/resetGameClicked`).set( Date.now() ) ),

      setThinkingState: ( roomId: string, playerId: number, state: boolean ) =>
        this.afdb.object(`${this.fdPath.onlineGameCommunicationList}/${roomId}/thinkingState/${playerId}`).set( state ),

      setPresenceState: ( roomId: string, playerId: number, state: boolean ) =>
        this.afdb.object(`${this.fdPath.onlineGameCommunicationList}/${roomId}/presenceState/${playerId}`).set( state ),

      setTerminatedState: ( roomId: string, state: boolean ) =>
        this.afdb.object(`${this.fdPath.onlineGameCommunicationList}/${roomId}/isTerminated`).set( state ),

      setResultSubmittedState: ( roomId: string, state: boolean ) =>
        this.afdb.object(`${this.fdPath.onlineGameCommunicationList}/${roomId}/resultIsSubmitted`).set( state ),
    };

  }
}
