import { Sort } from '@angular/material';
import { TCell } from '../types/table-cell';
import { ITableSettings } from '../types/table-settings';

export const getSortedAsIndice = (
  indiceFiltered: number[],
  sortBy: Sort,
  table: TCell[][],
  settings: ITableSettings,
  NoColumn: string,
): number[] => {
  const indiceFilteredCopy = indiceFiltered.slice();
  if ( sortBy.direction === '' ) return indiceFiltered;
  if ( sortBy.active !== NoColumn ) {
    const colIndex = Number( sortBy.active );
    const cmp = settings.headerSettings[colIndex].compareFn;
    indiceFilteredCopy.sort( (x, y) => cmp(
                            table[x][colIndex],
                            table[y][colIndex] ) );
  }
  return ( sortBy.direction === 'desc'
              ? indiceFilteredCopy.reverse()
              : indiceFilteredCopy );
};
