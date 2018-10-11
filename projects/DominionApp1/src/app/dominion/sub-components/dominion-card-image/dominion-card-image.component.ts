import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable, combineLatest, ReplaySubject, merge } from 'rxjs';

import { CardProperty } from '../../types/card-property';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { isWideCard } from '../../functions/is-wide-card';
import { shareWithCache } from '../../../mylib/my-rxjs-operators/share-with-cache';


@Component({
  selector: 'app-dominion-card-image',
  templateUrl: './dominion-card-image.component.html',
  styleUrls: ['./dominion-card-image.component.css']
})
export class DominionCardImageComponent implements OnInit {

  @Output() private cardClicked = new EventEmitter<void>();

  @Input() description: string = '';

  private cardSource = new ReplaySubject<CardProperty>(1);
  card$ = this.cardSource.asObservable();
  @Input() set card( value: CardProperty ) {
    if ( !value ) return;
    this.cardSource.next( value );
  }

  private widthSource    = new ReplaySubject<number>(1);
  widthInput$ = this.widthSource.asObservable().pipe( distinctUntilChanged() );
  @Input() set width( value: number ) {
    if ( value === undefined ) return;
    this.widthSource.next( value || 0 );
  }

  private heightSource = new ReplaySubject<number>(1);
  heightInput$ = this.heightSource.asObservable().pipe( distinctUntilChanged() );
  @Input() set height( value: number ) {
    if ( value === undefined ) return;
    this.heightSource.next( value || 0 );
  }

  private faceUpSource = new ReplaySubject<boolean>(1);
  faceUp$ = this.faceUpSource.asObservable().pipe( distinctUntilChanged() );
  @Input() set faceUp( value: boolean ) {
    if ( value === undefined ) return;
    this.faceUpSource.next( !!value );
  }

  private isButtonSource = new ReplaySubject<boolean>(1);
  isButton$ = this.isButtonSource.asObservable().pipe( distinctUntilChanged() );
  @Input() set isButton( value: boolean ) {
    if ( value === undefined ) return;
    this.isButtonSource.next( !!value );
  }

  private emptySource = new ReplaySubject<boolean>(1);
  empty$ = this.emptySource.asObservable().pipe( distinctUntilChanged() );
  @Input() set empty( value: boolean ) {
    if ( value === undefined ) return;
    this.emptySource.next( !!value );
  }


  width$!: Observable<number>;
  height$!: Observable<number>;
  borderWidth$!:  Observable<number>;
  borderRadius$!: Observable<number>;
  sourceDir$!: Observable<string>;


  constructor() {}


  ngOnInit() {
    const isWideCard$: Observable<boolean>
      = this.card$.pipe(
          map( e => isWideCard( e.cardTypes ) ),
          shareWithCache(),
        );

    this.width$
      = merge(  // widthから計算
          this.widthInput$,
          combineLatest(
            isWideCard$,
            this.heightInput$,
            (wide, heightInput) =>
              Math.floor( heightInput * ( wide ? (15 / 23) : (23 / 15) ) ) )
        ).pipe(
          distinctUntilChanged(),
          shareWithCache(),
        );

    this.height$
      = merge(  // widthから計算
          this.heightInput$,
          combineLatest(
            isWideCard$,
            this.widthInput$,
            (wide, widthInput) =>
              Math.floor( widthInput * ( wide ? (15 / 23) : (23 / 15) ) ) )
        ).pipe(
          distinctUntilChanged(),
          shareWithCache(),
        );

    this.borderWidth$
      = combineLatest(
          this.widthInput$,
          this.height$,
          (width, height) => (18 / 250) * Math.floor( Math.min( width, height ) ) );

    this.borderRadius$ = this.borderWidth$;

    const CARD_IMAGE_DIR = 'projects/DominionApp1/assets/img/card';
    this.sourceDir$ = combineLatest(
      this.empty$, this.faceUp$, this.card$,
      (empty, faceUp, card) => {
        if ( empty ) return 'assets/img/blank.png';
        if ( !faceUp ) {
          if ( card.cardTypes.includes('Boon') ) return `${CARD_IMAGE_DIR}/Boon-back.jpg`;
          if ( card.cardTypes.includes('Hex' ) ) return `${CARD_IMAGE_DIR}/Hex-back.jpg`;
          if ( card.cardId === 'Stash' )         return `${CARD_IMAGE_DIR}/Stash-back.jpg`;
          return `${CARD_IMAGE_DIR}/Card_back.jpg`;
        }
        return `${CARD_IMAGE_DIR}/${this.card.nameEng.replace( / /g , '_' )}.jpg`;
      } );
  }


  private widthFromHeight( card: CardProperty, height: number ) {
    return Math.floor( height * ( isWideCard( card.cardTypes ) ? (23 / 15) : (15 / 23) ) );
  }

  onClicked() {
    if ( this.isButton ) {
      this.cardClicked.emit();
    }
  }
}
