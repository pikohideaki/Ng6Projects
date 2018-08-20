export type ScheduleSymbolId = ''
                              |'fav'
                              |'ok'
                              |'maybe'
                              |'depends'
                              |'late'
                              |'unknown'
                              |'ng'
                              |'kusonemi';

export interface IScheduleSymbol {
  id:          ScheduleSymbolId;
  useThis:     boolean;
  description: string;
  score:       number;
}


export class ScheduleSymbol implements IScheduleSymbol {
  id:          ScheduleSymbolId = '';
  useThis:     boolean          = false;
  description: string           = '';
  score:       number           = 0;


  constructor( initializer?: IScheduleSymbol ) {
    if ( !initializer ) return;

    this.id          = ( initializer.id          || ''    );
    this.useThis     = ( initializer.useThis     || false );
    this.description = ( initializer.description || ''    );
    this.score       = ( initializer.score       || 0     );
  }

  matIconName = (symbolId: ScheduleSymbolId): string => {
    switch (symbolId) {
      case 'fav'      : return 'favorite';
      case 'ok'       : return 'radio_button_unchecked';
      case 'maybe'    : return 'change_history';
      case 'depends'  : return 'watch';
      case 'late'     : return 'schedule';
      case 'unknown'  : return 'help_outline';
      case 'ng'       : return 'clear';
      case 'kusonemi' : return 'hotel';
      default: return '';
    }
  }
}
