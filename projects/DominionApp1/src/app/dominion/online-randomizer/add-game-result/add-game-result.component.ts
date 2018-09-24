import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Observable, combineLatest } from 'rxjs';

import { utils } from '../../../mylib/utilities';
import { FireDatabaseService } from '../../../database/database.service';
import { UserService } from '../../../database/user.service';

import { MyRandomizerGroupService } from '../my-randomizer-group.service';

import { CardProperty  } from '../../types/card-property';
import { GameResult    } from '../../types/game-result';
import { PlayerResult  } from '../types/player-result';
import { SelectedCards } from '../../types/selected-cards';
import { SelectedCardsCheckbox } from '../../types/selected-cards-checkbox-values';

import { SetVpDialogComponent } from './set-vp-dialog.component';
import { SetMemoDialogComponent } from '../../sub-components/set-memo-dialog.component';
import { SubmitGameResultDialogComponent } from '../../sub-components/submit-game-result-dialog/submit-game-result-dialog.component';
import { NumberOfVictoryCards } from '../../types/number-of-victory-cards';
import { map, startWith } from 'rxjs/operators';
import { PlayerData } from '../../online-game/types/players-data';



@Component({
  selector: 'app-add-game-result',
  templateUrl: './add-game-result.component.html',
  styleUrls: [
    '../../../mylib/data-table/data-table.component.css',
    './add-game-result.component.css'
  ]
})
export class AddGameResultComponent implements OnInit {

  cardPropertyList$ = this.database.cardPropertyList$;
  selectedCards$ = this.myRandomizerGroup.selectedCards$;

  selectedExpansionNameList$
    = combineLatest(
        this.database.expansionNameList$,
        this.myRandomizerGroup.isSelectedExpansions$,
        (nameList, selected) =>
          nameList.filter( (_, i) => selected[i] ) )
      .pipe( startWith([]) );

  places$: Observable<string[]>
    = this.database.gameResultList$.pipe(
        map( gameResultList =>
          utils.array.uniq(
              gameResultList
                .map( e => e.place )
                .filter( e => e !== '' ) ) ),
        startWith([]) );

  place$: Observable<string>
    = this.myRandomizerGroup.newGameResult.place$
        .pipe( startWith('') );

  playerResults$: Observable<PlayerResult[]>
    = this.myRandomizerGroup.newGameResult.players$
        .pipe( startWith([]) );

  lastTurnPlayerName$: Observable<string>
    = this.myRandomizerGroup.newGameResult.lastTurnPlayerName$
        .pipe( startWith('') );

  selectedPlayers$: Observable<PlayerResult[]>
    = this.playerResults$.pipe(
        map( list =>
          list.filter( e => e.selected ) ),
        startWith([]) );

  turnOrderFilled$: Observable<boolean>
    = this.selectedPlayers$.pipe( map( list =>
        list.every( e => e.turnOrder !== 0 ) ) );

  // turnOrders == [1, 0, 0, 2] -> 3
  nextMissingNumber$: Observable<number>
    = this.selectedPlayers$.pipe(
        map( list =>
          list.filter( e => e.turnOrder !== 0 ).length + 1 ),
        startWith(1) );

  memo$: Observable<string>
    = this.myRandomizerGroup.newGameResult.memo$
        .pipe( startWith('') );

  newGameResultDialogOpened$: Observable<boolean>
    = this.myRandomizerGroup.newGameResultDialogOpened$;

  numberOfPlayersOK$: Observable<boolean>
    = this.selectedPlayers$.pipe(
        map( e => ( 2 <= e.length && e.length <= 6 ) ) );


  numberOfVictoryCardsString$: Observable<string[]>
    = combineLatest(
        this.selectedPlayers$,
        this.cardPropertyList$,
        (selectedPlayers, cardPropertyList) =>
          selectedPlayers.map( pl =>
            pl.numberOfVictoryCards.toStr( cardPropertyList ) ) );



  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private user: UserService,
    private database: FireDatabaseService,
    private myRandomizerGroup: MyRandomizerGroupService,
  ) {
  }


  ngOnInit() {
  }


  async changePlace( place: string ) {
    await this.myRandomizerGroup.setNGRPlace( place );
  }

  // プレイヤー選択
  async changePlayersResultSelected(
    uid: string, selected: boolean, selectedPlayers: PlayerResult[]
  ) {
    await Promise.all([
      this.myRandomizerGroup.setNGRPlayerSelected( uid, selected ),
      this.resetTurnOrders( selectedPlayers ),
      this.changeLastTurnPlayerName(''),
    ]);
  }


  /* プレイヤーの順番 */
  private async submitTurnOrders( selectedPlayers: PlayerResult[] ) {
    await Promise.all([
      this.changeLastTurnPlayerName(''),
      selectedPlayers.map( player => {
        this.myRandomizerGroup.setNGRPlayersTurnOrder( player.uid, player.turnOrder );
      } )
    ]);
  }

  async setEmptyTurnOrder(
    playerIndex: number,
    nextMissingNumber: number,
    selectedPlayers: PlayerResult[]
  ) {
    // 手動入力
    // index == 2, turnOrders == [1, 0, 0, 2] -> [1, 0, 3, 2]
    const uid = selectedPlayers[ playerIndex ].uid;
    await this.myRandomizerGroup.setNGRPlayersTurnOrder( uid, nextMissingNumber );
  }

  async shuffleTurnOrders( selectedPlayers: PlayerResult[] ) {
    if ( selectedPlayers.length < 2 ) return;
    const shuffledArray
      = utils.number.random.getShuffled( utils.number.numSeq( 1, selectedPlayers.length ) );
    selectedPlayers.forEach( (e, i) => e.turnOrder = shuffledArray[i] );
    await this.submitTurnOrders( selectedPlayers );
  }

  async rotateAtRandom( selectedPlayers: PlayerResult[] ) {
    const rand = utils.number.random.genIntegerIn( 0, selectedPlayers.length -  1 );
    this.rotateTurnOrders( selectedPlayers, rand );
  }

  async rotateTurnOrders( selectedPlayers: PlayerResult[], step: number ) {
    if ( selectedPlayers.length < 2 ) return;
    const N = selectedPlayers.length;
    const next = (val: number) => (((val - 1) + N - step) % N) + 1;
    selectedPlayers.forEach( e => e.turnOrder = next( e.turnOrder ) );
    await this.submitTurnOrders( selectedPlayers );
  }

  async resetTurnOrders( selectedPlayers: PlayerResult[] ) {
    selectedPlayers.forEach( e => e.turnOrder = 0 );
    await this.submitTurnOrders( selectedPlayers );
  }


  /* 最終手番プレイヤー */
  async changeLastTurnPlayerName( name: string ) {
    await this.myRandomizerGroup.setNGRLastTurnPlayerName( name );
  }


  async VPClicked( uid: string, selectedPlayers: PlayerResult[] ) {
    const dialogRef = this.dialog.open( SetVpDialogComponent );
    dialogRef.componentInstance.VP = (selectedPlayers.find( e => e.uid === uid ) || { VP: 0 }).VP;
    const result = await dialogRef.afterClosed().toPromise();
    if ( !result ) return;
    await this.myRandomizerGroup.setNGRPlayerVP( uid, result );
  }


  async memoClicked( memoPrev: string ) {
    const dialogRef = this.dialog.open( SetMemoDialogComponent );
    dialogRef.componentInstance.memo = memoPrev;
    const memoCurr = await dialogRef.afterClosed().toPromise();
    if ( memoCurr === undefined ) return;
    this.myRandomizerGroup.setNGRMemo( memoCurr );
  }





  async submitGameResult(
    cardPropertyList:          CardProperty[],
    selectedExpansionNameList: string[],
    selectedCards:             SelectedCards,
    place:                     string,
    memo:                      string,
    selectedPlayers:           PlayerResult[],
    lastTurnPlayerName:        string,
  ) {
    const indexToId = (cardIndex: number) => cardPropertyList[cardIndex].cardId;

    const newGameResult = new GameResult( undefined, {
      timeStamp  : Date.now(),
      place      : place,
      memo       : memo,
      selectedExpansionNameList : selectedExpansionNameList,
      selectedCardsId : {
        Prosperity      : selectedCards.Prosperity,
        DarkAges        : selectedCards.DarkAges,
        KingdomCards10  : selectedCards.KingdomCards10 .map( indexToId ),
        BaneCard        : selectedCards.BaneCard       .map( indexToId ),
        EventCards      : selectedCards.EventCards     .map( indexToId ),
        Obelisk         : selectedCards.Obelisk        .map( indexToId ),
        LandmarkCards   : selectedCards.LandmarkCards  .map( indexToId ),
        BlackMarketPile : selectedCards.BlackMarketPile.map( indexToId ),
      },
      players : selectedPlayers.map( pl => ({
                name      : pl.name,
                VP        : pl.VP,
                turnOrder : pl.turnOrder,
                rank      : 1,
                score     : 0,
                NofVictoryCards: new NumberOfVictoryCards(),
              }) ),
      lastTurnPlayerName: lastTurnPlayerName,
    });

    this.myRandomizerGroup.setNGRDialogOpened(true);
    const dialogRef = this.dialog.open( SubmitGameResultDialogComponent, { autoFocus: false } );
    dialogRef.componentInstance.newGameResult = newGameResult;

    const result = await dialogRef.afterClosed().toPromise();
    this.myRandomizerGroup.setNGRDialogOpened(false);
    if ( result === 'OK Clicked' ) {
      await Promise.all([
        this.myRandomizerGroup.setSelectedIndexInHistory(-1),
        this.myRandomizerGroup.resetSelectedCardsCheckbox(),
        ...selectedPlayers.map( player =>
            this.myRandomizerGroup.setNGRPlayerVP( player.uid, 0 )),
        this.myRandomizerGroup.setNGRLastTurnPlayerName(''),
        this.myRandomizerGroup.setNGRMemo(''),
        this.myRandomizerGroup.resetVPCalculator(),
        this.rotateTurnOrders( selectedPlayers, 1 ),
      ]);
      this.openSnackBar();
    }
  }


  private openSnackBar() {
    this.snackBar.open( 'Successfully Submitted!', undefined, { duration: 3000 } );
  }
}
