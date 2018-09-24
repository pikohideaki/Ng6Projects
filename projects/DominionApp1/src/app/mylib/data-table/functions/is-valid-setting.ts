import { ITableSettings } from '../types/table-settings';
import { TCell } from '../types/table-cell';
import { isValidTable } from './is-valid-table';

export const isValidSetting = (settings: ITableSettings, table: TCell[][]) => {

  /* settingsに不正な値がある場合 */
  if ( !settings ) return false;
  if ( !settings.headerSettings
        || !settings.itemsPerPageInit
        || !settings.itemsPerPageOptions ) return false;
  if ( typeof settings.displayNo !== 'boolean' ) return false;
  if ( typeof settings.usepagination !== 'boolean' ) return false;
  if ( typeof settings.itemsPerPageInit !== 'number' ) return false;
  if ( !Array.isArray( settings.itemsPerPageOptions ) ) return false;
  if ( !Array.isArray( settings.headerSettings ) ) return false;

  /* tableとの齟齬チェック */
  if ( !isValidTable( table ) ) return false;
  if ( settings.headerSettings.length !== table[0].length ) return false;

  return true;
};
