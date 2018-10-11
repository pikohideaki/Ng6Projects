import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { Observable, BehaviorSubject, combineLatest, ReplaySubject, merge } from 'rxjs';

import { CardProperty } from '../../types/card-property';
import { FireDatabaseService } from '../../../database/database.service';
import { utils } from '../../../mylib/utilities';
import { map, mapTo, scan } from 'rxjs/operators';
import { cardPropertyToStr } from '../../functions/transform-card-property';


@Component({
  selector: 'app-card-property-dialog',
  templateUrl: './card-property-dialog.component.html',
  styleUrls: [
    '../../../mylib/data-table/data-table.component.css',
    './card-property-dialog.component.css'
  ]
})
export class CardPropertyDialogComponent implements OnInit {

  private indiceInCardListSource = new ReplaySubject<number[]>(1);
  indiceInCardList$ = this.indiceInCardListSource.asObservable();
  set indiceInCardList( value: number[] ) {
    if ( !value ) return;
    this.indiceInCardListSource.next( value );
  }

  // option（Dialogを開いたまま次のカード情報を見る）
  private showingIndexInputSource = new ReplaySubject<number>(1);
  showingIndexInput$ = this.showingIndexInputSource.asObservable();
  set showingIndexInit( value: number ) { // input (option)
    if ( value === undefined ) return;
    this.showingIndexInputSource.next( value );
  }

  private showingIndexIncrementSource = new ReplaySubject<void>(1);
  private showingIndexDecrementSource = new ReplaySubject<void>(1);

  showingIndex$!: Observable<number>;


  private cardPropertyList$ = this.database.cardPropertyList$;

  card$!: Observable<CardProperty>;
  cardForView$!: Observable<object>;

  items = [
    { memberName: 'no'           , name: 'Card No.' },
    { memberName: 'nameJp'       , name: '和名' },
    { memberName: 'nameJpYomi'   , name: '読み' },
    { memberName: 'nameEng'      , name: '英名' },
    { memberName: 'expansionName', name: 'セット' },
    { memberName: 'cost_coin'    , name: 'コスト（コイン）' },
    { memberName: 'cost_potion'  , name: 'コスト（ポーション）' },
    { memberName: 'cost_debt'    , name: 'コスト（借金）' },
    { memberName: 'category'     , name: '種類' },
    { memberName: 'cardTypesStr' , name: '属性' },
    { memberName: 'VP'           , name: 'VP' },
    { memberName: 'drawCard'     , name: '+Draw Cards' },
    { memberName: 'action'       , name: '+Action' },
    { memberName: 'buy'          , name: '+Buy' },
    { memberName: 'coin'         , name: '+Coin' },
    { memberName: 'VPtoken'      , name: '+VP-token' },
    { memberName: 'implemented'  , name: 'オンラインゲーム実装状況' },
  ];


  constructor(
    public dialogRef: MatDialogRef<CardPropertyDialogComponent>,
    private database: FireDatabaseService,
  ) {
  }

  ngOnInit() {
    const showingIndexIncrement$: Observable<string>
      = this.showingIndexIncrementSource.asObservable()
          .pipe( mapTo('increment') );

    const showingIndexDecrement$: Observable<string>
      = this.showingIndexDecrementSource.asObservable()
          .pipe( mapTo('decrement') );

    this.showingIndex$
      = merge(
          showingIndexIncrement$,
          showingIndexDecrement$,
          this.showingIndexInput$,
      ).pipe(
        scan( (acc: number, value: number|'increment'|'decrement' ) => {
          switch (value) {
            case 'increment' : return acc + 1;
            case 'decrement' : return acc - 1;
            default : return value;
          }
        }, 0 ),
      );

    this.card$ = combineLatest(
        this.showingIndex$,
        this.indiceInCardList$,
        this.cardPropertyList$,
        (showingIndex, indiceInCardList, cardPropertyList) =>
          ( indiceInCardList.length === 0 ||
            !utils.array.isInArrayRange( showingIndex, indiceInCardList )
              ? new CardProperty()
              : cardPropertyList[ indiceInCardList[ showingIndex ] ] ) );

    this.cardForView$ = this.card$.pipe( map( cardPropertyToStr ) );
  }


  goToNextCard() {
    this.showingIndexIncrementSource.next();
  }

  goToPreviousCard() {
    this.showingIndexDecrementSource.next();
  }

  cardListLinkPath( linkId: number ) {
    return `http://suka.s5.xrea.com/dom/list.cgi?mode=show&id=${linkId}`;
  }

  /**
   * innerHeight, innerWidth : app window size
   * outerHeight, outerWidth : browser window size
   */
}
