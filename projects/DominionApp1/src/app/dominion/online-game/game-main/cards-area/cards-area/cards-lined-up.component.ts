import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { GameConfigService } from '../../services/game-config.service';
import { DCard } from '../../../../../classes/online-game/dcard';


@Component({
  selector: 'app-cards-lined-up',
  template: `
    <app-cards-area
      displayStyle="lineUp"
      [showArraySize]="false"
      [showCardProperty]="showCardProperty"
      [hideNonButtonCards]="hideNonButtonCards"
      [myIndex$]="myIndex$"
      [DCardArray$]="DCardArray$"
      [cardWidth$]="widthShrunk$"
      [defaultArrayLength]="defaultArrayLength"
      [padding]="2"
      (cardClicked)="onClicked( $event )" >
    </app-cards-area>
  `,
  styles: [],
})
export class CardsLinedUpComponent implements OnInit {

  @Input() showCardProperty:   boolean = false;
  @Input() hideNonButtonCards: boolean = false;

  @Input() myIndex$:    Observable<number>;
  @Input() DCardArray$: Observable<DCard[]>;

  @Input() width$: Observable<number>;
  @Input() defaultArrayLength: number = 1;  // min-width
  widthShrunk$: Observable<number>; // カードの枚数が増えるごとにカードサイズを縮小

  @Output() cardClicked = new EventEmitter<DCard>();

  // @Input() overlayDisplay: boolean = false;


  constructor(
    private config: GameConfigService,
  ) {
  }

  ngOnInit() {
    this.widthShrunk$
      = combineLatest(
            this.width$,
            this.DCardArray$.map( e => e.length ).distinctUntilChanged(),
            this.config.cardSizeAutoChange$,
            (width, size, autoChange) =>
                width * ( 1.0 - ( autoChange ? size / 100 : 0 ) ) )
                // autoChange --> (1 - (カード枚数 / 100))倍
          .debounceTime(100);
  }


  onClicked( dcard: DCard ) {
    this.cardClicked.emit( dcard );
  }
}
