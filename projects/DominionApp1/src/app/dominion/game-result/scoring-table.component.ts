import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FireDatabaseService } from '../../database/database.service';
import { HeaderSetting } from '../../mylib/data-table/types/header-setting';
import { map } from 'rxjs/operators';
import { ITableSettings } from '../../mylib/data-table/types/table-settings';


@Component({
  selector: 'app-scoring-table',
  template: `
    <div class="body-with-padding">
      <app-data-table
        [table]='scoringTableForView$ | async'
        [settings]='settings'>
      </app-data-table>
      <app-waiting-spinner [waiting]="!(scoringTableForView$ | async)"></app-waiting-spinner>
    </div>
  `,
  styles: []
})
export class ScoringTableComponent implements OnInit {

  scoringTableForView$: Observable<{
    numberOfPlayers: number,
    rank_1st: string,
    rank_2nd: string,
    rank_3rd: string,
    rank_4th: string,
    rank_5th: string,
    rank_6th: string,
  }[]>;

  settings: ITableSettings = {
    displayNo: false,
    itemsPerPageInit: 100,
    itemsPerPageOptions: [100],
    usepagination: false,
    headerSettings: [
      new HeaderSetting({ align: 'c', displayName: 'プレイヤー数' }),
      new HeaderSetting({ align: 'c', displayName: '1位' }),
      new HeaderSetting({ align: 'c', displayName: '2位' }),
      new HeaderSetting({ align: 'c', displayName: '3位' }),
      new HeaderSetting({ align: 'c', displayName: '4位' }),
      new HeaderSetting({ align: 'c', displayName: '5位' }),
      new HeaderSetting({ align: 'c', displayName: '6位' }),
    ],
  };


  constructor(
    private database: FireDatabaseService
  ) {
    this.scoringTableForView$
      = this.database.scoringTable$
          .pipe( map( scoringTable =>
            scoringTable
              .map( (value, index) => ({ numberOfPlayers: index, score: value }) )
              .filter( e => e.score[1] > 0 )
              .map( e => ({
                  numberOfPlayers : e.numberOfPlayers,
                  rank_1st : ( e.score[1] < 0 ? '' : e.score[1].toString() ),
                  rank_2nd : ( e.score[2] < 0 ? '' : e.score[2].toString() ),
                  rank_3rd : ( e.score[3] < 0 ? '' : e.score[3].toString() ),
                  rank_4th : ( e.score[4] < 0 ? '' : e.score[4].toString() ),
                  rank_5th : ( e.score[5] < 0 ? '' : e.score[5].toString() ),
                  rank_6th : ( e.score[6] < 0 ? '' : e.score[6].toString() ),
                }) )
          ) );
  }

  ngOnInit() {
  }

}
