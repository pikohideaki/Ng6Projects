import { utils } from '../mylib/utilities';

export type CardType = 'Curse'
                      |'Action'
                      |'Treasure'
                      |'Victory'
                      |'Attack'
                      |'Reaction'
                      |'Duration'
                      |'Ruins'
                      |'Prize'
                      |'Looter'
                      |'Shelter'
                      |'Knights'
                      |'Reserve'
                      |'Traveller'
                      |'Castle'
                      |'Gather'
                      |'EventCards'
                      |'LandmarkCards'
                      |'Spirit'
                      |'Night'
                      |'Fate'
                      |'Doom'
                      |'Heirloom'
                      |'Zombie'
                      |'Boon'
                      |'Hex'
                      |'State';

export class CardProperty {
  indexInList:         number = 0;
  no:                  number = 0;
  cardId:              string = '';
  nameJp:              string = '';
  nameJpYomi:          string = '';
  nameEng:             string = '';
  expansionName:       string[] = [];
  cost:                CardCost = new CardCost({ coin: 0, potion: 0, debt: 0 });
  category:            string = '';
  cardTypes:           CardType[] = [];
  VP:                  number = 0;
  drawCard:            number = 0;
  action:              number = 0;
  buy:                 number = 0;
  coin:                number = 0;
  VPtoken:             number = 0;
  implemented:         boolean = false;
  randomizerCandidate: boolean = false;
  linkId:              number = -1;

  constructor( indexInList?: number, initObj?: {
    no:                  number,
    cardId:              string,
    nameJp:              string,
    nameJpYomi:          string,
    nameEng:             string,
    expansionName:       string,
    cost:                CardCost,
    category:            string,
    cardTypes:           string,
    VP:                  number,
    drawCard:            number,
    action:              number,
    buy:                 number,
    coin:                number,
    VPtoken:             number,
    implemented:         boolean,
    randomizerCandidate: boolean,
    linkId:              number,
  }) {
    this.indexInList = ( indexInList || 0 );
    if ( !initObj ) return;

    this.no                  = ( initObj.no            || 0 );
    this.cardId              = ( initObj.cardId        || '' );
    this.nameJp              = ( initObj.nameJp        || '' );
    this.nameJpYomi          = ( initObj.nameJpYomi    || '' );
    this.nameEng             = ( initObj.nameEng       || '' );
    this.expansionName       = ( initObj.expansionName || '' ).split(',');
    this.cost                = new CardCost( initObj.cost );
    this.category            = ( initObj.category      || '' );
    this.cardTypes           = ( <CardType[]>( initObj.cardTypes || '' ).split(',') || [] );
    this.VP                  = ( initObj.VP            || 0 );
    this.drawCard            = ( initObj.drawCard      || 0 );
    this.action              = ( initObj.action        || 0 );
    this.buy                 = ( initObj.buy           || 0 );
    this.coin                = ( initObj.coin          || 0 );
    this.VPtoken             = ( initObj.VPtoken       || 0 );
    this.implemented         = !!initObj.implemented;
    this.randomizerCandidate = !!initObj.randomizerCandidate;
    this.linkId              = ( initObj.linkId        || -1 );
  }

  from( cardProperty: CardProperty ): CardProperty {
    utils.object.forEach( cardProperty, (_, key) => (this as any)[key] = (cardProperty as any)[key] );
    this.cost = new CardCost( cardProperty.cost );
    return this;
  }

  isWideType(): boolean {
    return (
         this.cardTypes.includes('EventCards')
      || this.cardTypes.includes('LandmarkCards')
      || this.cardTypes.includes('Boon')
      || this.cardTypes.includes('Hex')
      || this.cardTypes.includes('State')
    );
  }

  transformAll(): any {
    return {
      indexInList         : this.indexInList,
      no                  : this.no,
      cardId              : this.cardId,
      nameJp              : this.nameJp,
      nameJpYomi          : this.nameJpYomi,
      nameEng             : this.nameEng,
      expansionName       : this.expansionName.join('，'),
      cost_coin           : this.cost.coin,
      cost_potion         : this.cost.potion,
      cost_debt           : this.cost.debt,
      costStr             : transform( 'cost', this.cost ),
      category            : this.category,
      cardTypesStr        : this.cardTypes.map( e => transform( 'cardTypes', e ) ).join('，'),
      cardTypes           : this.cardTypes,
      VP                  : this.VP,
      drawCard            : this.drawCard,
      action              : this.action,
      buy                 : this.buy,
      coin                : this.coin,
      VPtoken             : this.VPtoken,
      implemented         : transform( 'implemented', this.implemented ),
      randomizerCandidate : transform( 'randomizerCandidate', this.randomizerCandidate ),
    };
  }


  isBasicTreasure(): boolean {
    return ( this.cardId === 'Copper'
          || this.cardId === 'Silver'
          || this.cardId === 'Gold'
          || this.cardId === 'Platinum'
          || this.cardId === 'Potion'
          || this.cardId === 'Harem'
          || this.cardId === 'Stash'
          || this.cardId === 'Humble_Castle'
          || this.cardId === 'Pasture'
          || this.cardId === 'Pouch'
    );
  }
}






export function transform( property: string, value: any ) {
  switch ( property ) {

    case 'cardTypes' :
      switch (value) {
        case 'Curse'         : return '呪い';
        case 'Action'        : return 'アクション';
        case 'Treasure'      : return '財宝';
        case 'Victory'       : return '勝利点';
        case 'Attack'        : return 'アタック';
        case 'Reaction'      : return 'リアクション';
        case 'Duration'      : return '持続';
        case 'Ruins'         : return '廃墟';
        case 'Prize'         : return '褒賞';
        case 'Looter'        : return '略奪者';
        case 'Shelter'       : return '避難所';
        case 'Knights'       : return '騎士';
        case 'Reserve'       : return 'リザーブ';
        case 'Traveller'     : return 'トラベラー';
        case 'Castle'        : return '城';
        case 'Gather'        : return '集合';
        case 'EventCards'    : return 'イベント';
        case 'LandmarkCards' : return 'ランドマーク';
        default              : return value;
      }

    case 'cost' :
      return value.toStr();

    case 'implemented' :
      return ( value ?  '実装済み' : '未実装' );

    case 'randomizerCandidate' :
      return ( value ?  '〇' : '×' );

    case 'indexInList' :
    case 'no' :
    case 'cardId' :
    case 'expansionName' :
    case 'nameJp' :
    case 'nameJpYomi' :
    case 'nameEng' :
    case 'category' :
    case 'VP' :
    case 'drawCard' :
    case 'action' :
    case 'buy' :
    case 'coin' :
    case 'VPtoken' :
    case 'linkId' :
      return value;

    default:
      throw new Error(`unknown property name '${property}'`);
  }
}



export class CardCost {
  coin   = 0;
  potion = 0;
  debt   = 0;

  constructor( initObj: { coin: number, potion: number, debt: number } ) {
    if ( !initObj ) return;
    this.coin   = ( initObj.coin   || 0 );
    this.potion = ( initObj.potion || 0 );
    this.debt   = ( initObj.debt   || 0 );
  }


  toStr(): string {
    let result = '';
    if ( this.coin > 0 || ( this.potion <= 0 && this.debt <= 0 ) ) {
      result += this.coin.toString();
    }
    if ( this.potion > 0 ) {
      for ( let i = 0; i < this.potion; ++i ) result += 'P';
    }
    if ( this.debt   > 0 ) {
      result += `<${this.debt.toString()}>`;
    }
    return result;
  }

  gt( cost1: CardCost, cost2: CardCost ): boolean {
    return cost1.coin   > cost2.coin
        && cost1.potion > cost2.potion
        && cost1.debt   > cost2.debt;
  }

  lt( cost1: CardCost, cost2: CardCost ): boolean {
    return cost1.coin   < cost2.coin
        && cost1.potion < cost2.potion
        && cost1.debt   < cost2.debt;
  }

  eq( cost1: CardCost, cost2: CardCost ): boolean {
    return cost1.coin   === cost2.coin
        && cost1.potion === cost2.potion
        && cost1.debt   === cost2.debt;
  }

  geq( cost1: CardCost, cost2: CardCost ): boolean {
    return this.gt( cost1, cost2 ) || this.eq( cost1, cost2 );
  }

  leq( cost1: CardCost, cost2: CardCost ): boolean {
    return this.lt( cost1, cost2 ) || this.eq( cost1, cost2 );
  }
}

export function toListIndex( cardPropertyList: CardProperty[], cardId: string ) {
  return cardPropertyList.findIndex( e => e.cardId === cardId );
}


export function numberToPrepare(
    cardPropertyList: CardProperty[],
    cardIndex: number,
    numberOfPlayer: number,
    DarkAges: boolean
  ): number {
  switch ( cardPropertyList[cardIndex].cardId ) {
    case 'Copper'  : return 60;
    case 'Silver'  : return 40;
    case 'Gold'    : return 30;
    case 'Platinum': return 12;
    case 'Potion'  : return 16;
    case 'Curse'   : return ( numberOfPlayer - 1 ) * 10;
    default : break;
  }
  if ( cardPropertyList[cardIndex].cardId === 'Estate' ) {
    if ( DarkAges ) return ( numberOfPlayer > 2 ? 12 : 8 );
    return numberOfPlayer * 3 + ( numberOfPlayer > 2 ? 12 : 8 );
  }
  if ( cardPropertyList[cardIndex].cardTypes.includes('Victory') ) {
    return ( numberOfPlayer > 2 ? 12 : 8 );
  }
  if ( cardPropertyList[cardIndex].cardTypes.includes('Prize') ) return 1;
  return 10; /* KingdomCard default */
}
