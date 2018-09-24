import { utils } from '../../utilities';
import { IHeaderSetting } from '../types/header-setting';
import { TCell, TCellPrimitive } from '../types/table-cell';


export const filterFunction = (
  tableLine: TCell[],
  headerSettings: IHeaderSetting[],
  headerValuesAll: (TCell|undefined)[],
): boolean => {
  for ( let colIndex = 0; colIndex < headerSettings.length; ++colIndex ) {
    const headerValue = headerValuesAll[ colIndex ];
    if ( headerValue === undefined ) continue;

    const header = headerSettings[ colIndex ];
    const cell = tableLine[ colIndex ];

    /* no mismatches => return true; 1 or more mismatches => return false */
    switch ( header.filterType ) {
      case 'input' :
        if ( typeof cell !== 'string' ) return false;
        if ( typeof headerValue !== 'string' ) return false;
        if ( !utils.string.submatch(
                cell, headerValue, true ) ) return false;
        break;

      case 'select' :
        if ( typeof cell !== 'string' &&
             typeof cell !== 'boolean' &&
             typeof cell !== 'number' ) return false;
        if ( cell !== headerValue ) return false;
        break;

      case 'multiSelect-and' :
        if ( !Array.isArray( headerValue ) ) return false;
        if ( !Array.isArray( cell ) ) return false;
        /* for any e \in headerValue, e \in cell */
        if ( !utils.array.isSubset( headerValue, cell as TCellPrimitive[] ) ) return false;
        break;

      case 'multiSelect-or' :
        /* headerValueの初期状態はundefinedなのでfilteringされなくなっており，
            headerValueの全選択初期化は不要になっている */
        if ( !Array.isArray( headerValue ) ) return false;
        if ( !Array.isArray( cell ) ) {
          if ( !(headerValue as TCellPrimitive[]).includes( cell ) ) return false;
        } else {
          /* for some e \in headerValue, e \in cell */
          if ( utils.array.setIntersection( headerValue as TCellPrimitive[], cell ).length === 0 ) return false;
        }
        break;

      default :
        break;
    }

  }

  return true;
};

