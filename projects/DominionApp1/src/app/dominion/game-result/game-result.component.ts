import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, first } from 'rxjs/operators';

import { utils } from '../../mylib/utilities';
import { FireDatabaseService } from '../../database/database.service';

import { GameResult } from '../types/game-result';


@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.css']
})
export class GameResultComponent implements OnInit {

  private dateBeginSource = new BehaviorSubject<Date>( new Date() );
  dateBegin$ = this.dateBeginSource.asObservable().pipe( distinctUntilChanged() );

  private dateEndSource   = new BehaviorSubject<Date>( new Date() );
  dateEnd$ = this.dateEndSource.asObservable().pipe( distinctUntilChanged() );

  private numberOfPlayersOptionsSource
    = new BehaviorSubject<{ numberOfPlayers: number, checked: boolean }[]>(
        utils.number.numberSequence( 2, 5 )
          .map( i => ({ numberOfPlayers: i, checked: (i <= 4) })) );
          // [2:true, 3:true, 4:true, 5:false, 6:false]
  numberOfPlayersOptions$: Observable<{ numberOfPlayers: number, checked: boolean }[]>
    = this.numberOfPlayersOptionsSource.asObservable();

  gameResultList$ = this.database.gameResultList$;

  gameResultListFiltered$: Observable<GameResult[]>
    = combineLatest(
        this.gameResultList$,
        this.dateBegin$,
        this.dateEnd$,
        this.numberOfPlayersOptions$,
        ( gameResultList: GameResult[],
          dateBegin: Date,
          dateEnd: Date,
          numberOfPlayersChecked ) =>
            gameResultList.filter( gr => {
              const mDate = utils.date.toMidnight( gr.date );
              return (   mDate >= dateBegin
                      && mDate <= dateEnd
                      && (numberOfPlayersChecked
                            .find( e => e.numberOfPlayers === gr.players.length )
                          || {checked: false})
                          .checked );
            }) );


  constructor(
    private database: FireDatabaseService
  ) {
    this.gameResultList$.pipe( first() )
      .subscribe( list => this.resetFormControls( list ) );
  }


  ngOnInit() {
  }


  changeDateBegin( date: Date ) {
    this.dateBeginSource.next( new Date(date) );
  }
  changeDateEnd( date: Date ) {
    this.dateEndSource.next( new Date(date) );
  }
  latestResultClicked( gameResultList: GameResult[] ) {
    this.setDateToLatest( gameResultList );
  }
  resetAllClicked( gameResultList: GameResult[] ) {
    this.resetFormControls( gameResultList );
  }
  numberOfPlayersOnCheck( checked: boolean, numberOfPlayers: number ) {
    const options = this.numberOfPlayersOptionsSource.value;
    (options.find( e => e.numberOfPlayers === numberOfPlayers )
        || {checked: false})
      .checked = checked;
    this.numberOfPlayersOptionsSource.next( options );
  }


  private setDateToLatest( gameResultList: GameResult[] ) {
    if ( gameResultList.length === 0 ) return;
    const latestDate = utils.date.toMidnight( utils.array.back( gameResultList ).date );
    this.changeDateBegin( latestDate );
    this.changeDateEnd( latestDate );
  }

  private resetFormControls( gameResultList: GameResult[] ) {
    if ( gameResultList.length === 0 ) return;
    const dateBegin = utils.date.toMidnight( utils.array.front( gameResultList ).date );
    const dateEnd   = utils.date.toMidnight( utils.array.back ( gameResultList ).date );
    const numberOfPlayersOptions
      = utils.array.uniq( gameResultList.map( e => e.players.length ) )
                  .sort( (a, b) => a - b )
                  .map( num => ({ numberOfPlayers: num, checked: true }) );
    this.changeDateBegin( dateBegin );
    this.changeDateEnd( dateEnd );
    this.numberOfPlayersOptionsSource.next( numberOfPlayersOptions );
  }
}
