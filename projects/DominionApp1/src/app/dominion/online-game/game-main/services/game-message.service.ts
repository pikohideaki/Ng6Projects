import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { concatMap, delayWhen } from 'rxjs/operators';

import { UserService } from '../../../../database/user.service';


@Injectable()
export class GameMessageService {

  private gameMessageSource = new BehaviorSubject<string>('');
  private gameMessage$ = this.gameMessageSource.asObservable().skip(1);

  gameMessageList$
    = this.gameMessage$
        .scan( (acc: string[], val: string, idx: number) => [].concat( acc, [`${idx + 1}. ${val}`] ), [] );

  gameMessageIndex$ = this.gameMessage$.map( (value, index) => index );
  gameMessageIndexDelayed$ = this.gameMessageIndex$.delay( 2000 );

  gameMessageListSliced$
    = combineLatest(
        this.gameMessageList$,
        this.gameMessageIndexDelayed$,
        this.gameMessageIndex$,
        (list, begin, end) => list.slice( begin + 1, end + 1 ) );



  constructor( private user: UserService ) {
  }


  pushMessage( message: string ) {
    this.gameMessageSource.next( message );
  }
}
