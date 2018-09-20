import { filterFunction } from './filter-function';
import { IHeaderSetting } from '../types/header-setting';
import { TCell } from '../types/table-cell';


export const indexOnRawData = (
    rawData: TCell[][],
    indexOnTableFiltered: number,
    headerSettings: IHeaderSetting[],
    headerValuesAll: TCell[],
): number => {
  for ( let i = 0, numberRemaining = 0; i < rawData.length; ++i ) {
    if ( filterFunction( rawData[i], headerSettings, headerValuesAll ) ) {
      numberRemaining++;
    }
    if ( numberRemaining > indexOnTableFiltered ) return i;
  }
  return rawData.length - 1;
};
