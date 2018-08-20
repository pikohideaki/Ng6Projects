import { utils } from '../../../my-lib/utilities';
import { Answer } from '../../answer';
import { ScheduleSymbol } from '../../schedule-symbol';
import { Schedule } from '../../schedule';

/* for print */
export const getAverageScore = (
  event: Schedule,
  date: Date
): number => {
  // const symbolIdsOfDate
  //   = event.answers
  //       .map( ans => ans.selection )
  //       .map( selections => selections.find( e => e.date.valueOf() === date.valueOf() ) )
  //       .filter( e => e !== undefined )
  //       .map( e => e.symbolID );
  // const scores = symbolIdsOfDate.map( id =>
  //     (event.symbols.find( e => e.id === id ) || new ScheduleSymbol() ).score );
  // return utils.number.roundAt( utils.array.average( scores ), 1 );
  return 0;
};

export const getIconName = (
  answer: Answer,
  date: Date,
  symbols: ScheduleSymbol[]
): string => {
  // const selection = answer.selection.find( e => e.date.valueOf() === date.valueOf() );
  // if ( !selection ) return '';
  // const symbol = symbols.find( e => e.id === selection.symbolID );
  // return ( !!symbol ? symbol.iconName : '' );
  return '';
};


