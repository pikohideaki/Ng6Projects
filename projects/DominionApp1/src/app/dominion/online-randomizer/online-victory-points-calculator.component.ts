import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { combineLatest, filter } from 'rxjs/operators';

import { FireDatabaseService } from '../../database/database.service';
import { MyRandomizerGroupService      } from './my-randomizer-group.service';
import { UserService             } from '../../database/user.service';

import { SelectedCards } from '../../classes/selected-cards';
import { NumberOfVictoryCards } from '../../classes/number-of-victory-cards';
import { PlayerResult } from '../../classes/online-randomizer/player-result';


@Component({
  selector: 'app-online-victory-points-calculator',
  template: `
    <ng-container *ngIf="(uid$ | async) as uid">
      <div class="body-with-padding">
        <app-victory-points-calculator *ngIf="!!uid"
          [selectedCards$]="selectedCards$"
          [resetVPCalculator$]="resetVPCalculator$"
          [numberOfVictoryCards$]="numberOfVictoryCards$"
          (numberOfVictoryCardsChange)="numberOfVictoryCardsOnChange( $event, uid )"
          (VPtotalChange)="VPtotalOnChange( $event, uid )">
        </app-victory-points-calculator>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class OnlineVictoryPointsCalculatorComponent implements OnInit {

  selectedCards$ = this.myRandomizerGroup.selectedCards$;  // 存在するもののみ表示
  resetVPCalculator$ = this.myRandomizerGroup.resetVPCalculator$;
  uid$: Observable<string> = this.user.uid$;
  numberOfVictoryCards$
    = combineLatest(
        this.myRandomizerGroup.newGameResult.players$,
        this.uid$.pipe( filter( uid => !!uid ) ),
        (players, uid) => ( players.find( e => e.uid === uid ) || new PlayerResult() )
                            .numberOfVictoryCards );


  constructor(
    private user: UserService,
    private database: FireDatabaseService,
    private myRandomizerGroup: MyRandomizerGroupService,
  ) {
  }

  ngOnInit() {
  }

  VPtotalOnChange( VPtotal: number, uid: string ) {
    if ( !uid ) return;
    this.myRandomizerGroup.setNGRPlayerVP( uid, VPtotal );
  }

  numberOfVictoryCardsOnChange(
    numberOfVictoryCards: NumberOfVictoryCards,
    uid: string
  ) {
    if ( !uid ) return;
    this.myRandomizerGroup.setNGRPlayerNumberOfVictoryCards(
        uid, numberOfVictoryCards );
  }
}
