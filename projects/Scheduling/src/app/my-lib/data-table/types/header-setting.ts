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
  enableSort:  boolean;
  compareFn: (x: TCell, y: TCell) => number;
  transform: (value: TCell, pos?: CellPosition) => string;
}
