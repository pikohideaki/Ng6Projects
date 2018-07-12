import { TCell } from './table-cell';
import { CellPosition } from './cell-position';

export type FilterType = ''|'input'
                          //  |'autoComplete'
                          //  |'numberRange'
                          //  |'dateRange'
                           |'select'
                           |'multiSelect-and'
                           |'multiSelect-or';

export class HeaderSetting {
  displayName: string;
  filterType?:  FilterType = '';
  align?:       'l'|'c'|'r' = 'l';  // left, center, right
  isButton?:    boolean = false;
  isLink?:      boolean = false;
  enableSort?:  boolean = false;

  /**
   * function to be used in Array.sort()
   * default is `(x, y) => Number(x) - Number(y)`
   */
  compareFn?: (x: TCell, y: TCell) => number
    = ((x, y) => Number(x) - Number(y) );

  /**
   * function to be used just before displaying data
   * default is `(value, _) => value.toString()`
   */
  transform?: (value: TCell, pos?: CellPosition) => string
    = ((value, _) => value.toString());

  constructor() {}
}
