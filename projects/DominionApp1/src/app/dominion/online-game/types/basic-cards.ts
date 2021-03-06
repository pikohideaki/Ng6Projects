import { DCard, getFiltered, initDCardArray } from './dcard';
import { utils } from '../../../mylib/utilities';
import { getDCardsByIdArray } from '../../functions/get-dcards-by-id-array';


export class BasicCards {
  Curse:    DCard[] = [];
  Copper:   DCard[] = [];
  Silver:   DCard[] = [];
  Gold:     DCard[] = [];
  Estate:   DCard[] = [];
  Duchy:    DCard[] = [];
  Province: DCard[] = [];
  Platinum: DCard[] = [];
  Colony:   DCard[] = [];
  Potion:   DCard[] = [];

  constructor( dataObj?: {
    Curse:    DCard[],
    Copper:   DCard[],
    Silver:   DCard[],
    Gold:     DCard[],
    Estate:   DCard[],
    Duchy:    DCard[],
    Province: DCard[],
    Platinum: DCard[],
    Colony:   DCard[],
    Potion:   DCard[],
  } ) {
    if ( !dataObj ) return;
    this.Curse    = initDCardArray( dataObj.Curse    );
    this.Copper   = initDCardArray( dataObj.Copper   );
    this.Silver   = initDCardArray( dataObj.Silver   );
    this.Gold     = initDCardArray( dataObj.Gold     );
    this.Estate   = initDCardArray( dataObj.Estate   );
    this.Duchy    = initDCardArray( dataObj.Duchy    );
    this.Province = initDCardArray( dataObj.Province );
    this.Platinum = initDCardArray( dataObj.Platinum );
    this.Colony   = initDCardArray( dataObj.Colony   );
    this.Potion   = initDCardArray( dataObj.Potion   );
  }

  getDCards( cardIdArray?: number[] ): DCard[] {
    const allDCards: DCard[] = [].concat( ...utils.object.entries( this ) );
    return getDCardsByIdArray( cardIdArray, allDCards );
  }

  removeDCards( cardIdArray: number[] ) {
    this.Curse    = getFiltered( cardIdArray, this.Curse    );
    this.Copper   = getFiltered( cardIdArray, this.Copper   );
    this.Silver   = getFiltered( cardIdArray, this.Silver   );
    this.Gold     = getFiltered( cardIdArray, this.Gold     );
    this.Estate   = getFiltered( cardIdArray, this.Estate   );
    this.Duchy    = getFiltered( cardIdArray, this.Duchy    );
    this.Province = getFiltered( cardIdArray, this.Province );
    this.Platinum = getFiltered( cardIdArray, this.Platinum );
    this.Colony   = getFiltered( cardIdArray, this.Colony   );
    this.Potion   = getFiltered( cardIdArray, this.Potion   );
  }

}
