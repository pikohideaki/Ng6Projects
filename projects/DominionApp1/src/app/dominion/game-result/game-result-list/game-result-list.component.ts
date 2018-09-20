import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest } from 'rxjs';

import { MatDialog } from '@angular/material';

import { slice } from '../../../mylib/data-table/functions/slice';
import { FireDatabaseService } from '../../../database/database.service';
import { SetMemoDialogComponent } from '../../sub-components/set-memo-dialog.component';
import { GameResultDetailDialogComponent    } from './game-result-detail-dialog/game-result-detail-dialog.component';
import { GameResult } from '../../../classes/game-result';
import { takeWhile, map } from 'rxjs/operators';


@Component({
  selector: 'app-game-result-list',
  templateUrl: './game-result-list.component.html',
  styleUrls: [ '../../../mylib/data-table/data-table.component.css' ]
})
export class GameResultListComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() private gameResultListFiltered$!: Observable<GameResult[]>;
  filteredDataLength$!: Observable<number>;

  // pagenation
  private selectedPageIndexSource = new BehaviorSubject<number>(0);
  selectedPageIndex$ = this.selectedPageIndexSource.asObservable();

  private itemsPerPageSource = new BehaviorSubject<number>(50);
  itemsPerPage$ = this.itemsPerPageSource.asObservable();

  currentPageData$!: Observable<GameResult[]>;


  constructor(
    public dialog: MatDialog,
    private database: FireDatabaseService
  ) {
  }

  ngOnInit() {
    this.currentPageData$
      = combineLatest(
          this.gameResultListFiltered$,
          this.itemsPerPage$,
          this.selectedPageIndex$,
          (gameResultListFiltered, itemsPerPage, selectedPageIndex) =>
              slice(
                  Array.from( gameResultListFiltered ).reverse(),
                  itemsPerPage,
                  selectedPageIndex ) );

    this.filteredDataLength$ = this.gameResultListFiltered$.pipe( map( e => e.length ) );

    this.gameResultListFiltered$
      .pipe( takeWhile( () => this.alive ) )
      .subscribe( _ => this.changeSelectedPageIndex(0) );
  }

  ngOnDestroy() {
    this.alive = false;
  }


  changeSelectedPageIndex( selectedPageIndex: number ) {
    this.selectedPageIndexSource.next( selectedPageIndex );
  }
  changeItemsPerPage( itemsPerPage: number ) {
    this.itemsPerPageSource.next( itemsPerPage );
    this.changeSelectedPageIndex(0);
  }



  getDetail( gameResult: GameResult ) {
    const databaseKey = gameResult.databaseKey;
    const dialogRef = this.dialog.open( GameResultDetailDialogComponent, { autoFocus: false } );
    dialogRef.componentInstance.gameResult = gameResult;
  }

  memoClicked( gameResult: GameResult ) {
    const dialogRef = this.dialog.open( SetMemoDialogComponent );
    dialogRef.componentInstance.memo = gameResult.memo;
    dialogRef.afterClosed().subscribe( result => {
      if ( result === undefined ) return;
      this.database.gameResult.setMemo( gameResult.databaseKey, result );
    });
  }
}
