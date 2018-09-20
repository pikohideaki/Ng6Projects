import { TCell } from './table-cell';
import { CellPosition } from './cell-position';

export type FilterType = 'none'
                           |'input'
                          //  |'autoComplete'
                          //  |'numberRange'
                           |'select'
                           |'multiSelect-and'
                           |'multiSelect-or';

export interface IHeaderSetting {
  displayName: string;
  filterType:  FilterType;
  align:       'l'|'c'|'r';
  isButton:    boolean;
  isLink:      boolean;
  sort:  boolean;
  compareFn:   (x: TCell, y: TCell) => number;
  transform:   (value: TCell, pos?: CellPosition) => string;
}


export class HeaderSetting implements IHeaderSetting {
  displayName: string;
  filterType:  FilterType;
  align:       'l'|'c'|'r';
  isButton:    boolean;
  isLink:      boolean;
  sort:  boolean;
  compareFn:   (x: TCell, y: TCell) => number;
  transform:   (value: TCell, pos?: CellPosition) => string;

  constructor( initializer?: {
    displayName: string,
    filterType?: FilterType,
    align?:      'l'|'c'|'r',
    isButton?:   boolean,
    isLink?:     boolean,
    sort?: boolean,
    compareFn?:  (x: TCell, y: TCell) => number,
    transform?:  (value: TCell, pos?: CellPosition) => string,
  }) {
    if ( !initializer ) {
      this.displayName = '';
      this.filterType  = 'none';
      this.align       = 'c';
      this.isButton    = false;
      this.isLink      = false;
      this.sort  = false;
      this.compareFn   = ((x: TCell, y: TCell) => x.toString().localeCompare( y.toString() ) ),
      this.transform   = ((value, _) => value.toString());
    } else {
      this.displayName = initializer.displayName || '';
      this.filterType  = initializer.filterType  || 'none';
      this.align       = initializer.align       || 'c';
      this.isButton    = initializer.isButton    || false;
      this.isLink      = initializer.isLink      || false;
      this.sort  = initializer.sort  || false;
      this.compareFn   = initializer.compareFn   || ((x: TCell, y: TCell) => x.toString().localeCompare( y.toString() ) );
      this.transform   = initializer.transform   || ((value, _) => value.toString());
    }
  }
}
