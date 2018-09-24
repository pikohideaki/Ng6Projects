import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Sort, SortDirection } from '@angular/material';

import { Observable, combineLatest, merge, ReplaySubject } from 'rxjs';
import { map, scan, startWith, takeWhile } from 'rxjs/operators';

import { shareWithCache } from '../my-rxjs-operators/share-with-cache';
import { avoidGlitch    } from '../my-rxjs-operators/avoid-glitch';

import { filterFunction    } from './functions/filter-function';
import { slice             } from './functions/slice';
import { makeSelectOptions } from './functions/make-select-options';
import { isValidSetting    } from './functions/is-valid-setting';

import { SelectorOption    } from './types/selector-option';
import { TCell             } from './types/table-cell';
import { CellPosition      } from './types/cell-position';
import { ITableSettings    } from './types/table-settings';
import { isValidTable      } from './functions/is-valid-table';
import { GetSortedAsIndice } from './functions/get-sorted-indice';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {
  private alive = true;

  /**
   * sypported cell types:
   *   * number
   *   * string
   *   * boolean,
   *   * Array<number>
   *   * Array<string>
   *   * Array<boolean>
   */


  // input & output

  private tableSource = new ReplaySubject<TCell[][]>(1);
  table$: Observable<TCell[][]> = this.tableSource.asObservable();
  @Input() set table( value: TCell[][] ) {
    if ( !isValidTable( value ) ) return;
    this.tableSource.next( value );
  }

  private settingsSource = new ReplaySubject<ITableSettings>(1);
  settings$ = this.settingsSource.asObservable();
  @Input() set settings( value: ITableSettings ) {
    if ( !value ) return;
    this.settingsSource.next( value );
  }

  @Output() clickedCellPosition = new EventEmitter<CellPosition>();

  @Output() indiceFilteredChange = new EventEmitter<number[]>();

  /***************************************************************************/


  /* user input */

  private itemsPerPageSource = new ReplaySubject<number>(1);
  private itemsPerPageChange$ = this.itemsPerPageSource.asObservable();

  private pageNumberSource = new ReplaySubject<number>(1);
  private pageNumberChange$ = this.pageNumberSource.asObservable();

  private headerValueSource
    = new ReplaySubject<{ columnIndex: number, value: any }>(1);
  private headerValueChange$ = this.headerValueSource.asObservable();

  private resetAllClickSource = new ReplaySubject<void>(1);
  private resetAllClick$ = this.resetAllClickSource.asObservable();

  private resetClickSource = new ReplaySubject<number>(1);
  private resetClick$ = this.resetClickSource.asObservable();

  private sortBySource = new ReplaySubject<Sort>(1);
  private sortByChange$ = this.sortBySource.asObservable();


  /***************************************************************************/

  itemsPerPage$!:           Observable<number>;
  pageNumber$!:             Observable<number>;
  headerValuesAll$!:        Observable<(TCell|undefined)[]>;
  selectorOptionsAll$!:     Observable<SelectorOption[][]>;
  indiceSliced$!:           Observable<number[]>;
  tableSlicedTransformed$!: Observable<string[][]>;
  filteredRowSize$!:        Observable<number>;

  readonly NoColumn = 'No.Column';


  constructor() { }


  ngOnDestroy() {
    this.alive = false;
  }

  ngOnInit() {

    const tableWithDefault$: Observable<TCell[][]>
      = combineLatest(
          this.table$,
          this.settings$
        ).pipe(
          avoidGlitch(),
          map( ([table, settings]) => ( isValidSetting( settings, table ) ? table : [] ) ),
          shareWithCache(),
        );


    /* table header */

    this.headerValuesAll$
      = merge(
          this.settings$.pipe( map( e => e.headerSettings.map( () => undefined ) ) ),  // 初期値
          this.resetAllClick$.pipe( map( () => ({ columnIndex: -1, value: undefined }) ) ),
          this.resetClick$.pipe( map( colIndex => ({ columnIndex: colIndex, value: undefined }) )),
          this.headerValueChange$,
        ).pipe(
          avoidGlitch(),
          scan( ( acc: (TCell|undefined)[],
              value: { columnIndex: number, value: any } | undefined[]
            ) => {
              if ( Array.isArray( value ) ) {
                return value;
              } else {
                if ( value.columnIndex === -1 ) {
                  acc.forEach( (_, i, a) => a[i] = undefined );
                  return acc;
                } else {
                  acc[ value.columnIndex ] = value.value;
                  return acc;
                }
              }
            },
            [] as (TCell|undefined)[] ),
          shareWithCache(),
        );

    const sortBy$: Observable<Sort>
      = merge(
          this.sortByChange$,
          this.resetAllClick$.pipe( map( () => ({ active: '', direction: <SortDirection>'' }) ))
        ).pipe(
          avoidGlitch(),
          startWith({ active: this.NoColumn , direction: <SortDirection>'' }),
          shareWithCache(),
        );


    const indiceFiltered$: Observable<number[]>
      = combineLatest(
          tableWithDefault$,
          this.headerValuesAll$,
          this.settings$
        ).pipe(
          avoidGlitch(),
          map( ([table, headerValuesAll, settings]) =>
            table.map( (e, i) => ({ val: e, idx: i }) )
              .filter( e => filterFunction(
                              e.val,
                              settings.headerSettings,
                              headerValuesAll ) )
              .map( e => e.idx ) ),
          shareWithCache(),
        );

    this.filteredRowSize$
      = indiceFiltered$.pipe( map( e => e.length ) );


    /* pagenation */

    const pageLength$: Observable<number>
      = combineLatest(
          this.filteredRowSize$,
          this.itemsPerPage$
        ).pipe(
          avoidGlitch(),
          map( ([length, itemsPerPage]) =>
            Math.ceil( length / itemsPerPage ) ),
          shareWithCache(),
        );

    this.pageNumber$
      = merge(
          this.pageNumberChange$,
          pageLength$.pipe( map( () => 1 ) )
        ).pipe(
          startWith(1),
          shareWithCache(),
        );

    this.itemsPerPage$
      = merge(
          this.settings$.pipe( map( e => e.itemsPerPageInit || 100 ) ),
          this.itemsPerPageChange$
        ).pipe(
          avoidGlitch(),
          shareWithCache(),
        );


    /* table */

    const indiceFilteredSorted$: Observable<number[]>
      = combineLatest(
          indiceFiltered$,
          sortBy$,
          tableWithDefault$,
          this.settings$
        ).pipe(
          avoidGlitch(),
          map( ([indiceFiltered, sortBy, table, settings]) =>
            GetSortedAsIndice( indiceFiltered, sortBy, table, settings, this.NoColumn ) ),
          shareWithCache(),
        );

    this.indiceSliced$
      = combineLatest(
          this.itemsPerPage$,
          this.pageNumber$,
          this.settings$.pipe( map( e => !!e.usepagination ) ),
          indiceFilteredSorted$
        ).pipe(
          avoidGlitch(),
          map( ([itemsPerPage, pageNumber, usePagenation, indiceFiltered]) =>
            ( usePagenation ? slice( indiceFiltered, itemsPerPage, pageNumber )
                            : indiceFiltered ) ),
          shareWithCache(),
        );

    const tableSliced$: Observable<TCell[][]>
      = combineLatest(
          this.indiceSliced$,
          tableWithDefault$
        ).pipe(
          avoidGlitch(),
          map( ([indice, table]) => indice.map( idx => table[idx] ) ),
          shareWithCache(),
        );

    this.tableSlicedTransformed$
      = combineLatest(
          tableSliced$,
          this.settings$
        ).pipe(
          avoidGlitch(),
          map( ([table, settings]) => table.map( line =>
            line.map( (elm, idx) =>
              settings.headerSettings[idx].transform( elm ) ) )),
          shareWithCache(),
        );


    const tableFiltered$: Observable<TCell[][]>
      = combineLatest(
          indiceFiltered$,
          tableWithDefault$,
        ).pipe(
          avoidGlitch(),
          map( ([indice, table]) => indice.map( idx => table[idx] ) ),
          shareWithCache(),
        );

    this.selectorOptionsAll$
      = combineLatest(
          tableFiltered$,
          tableWithDefault$,
          this.settings$,
        ).pipe(
          avoidGlitch(),
          map( ([tableFiltered, table, settings]) =>
              makeSelectOptions(
                table,
                tableFiltered,
                settings.headerSettings ) ),
          shareWithCache(),
        );

    indiceFiltered$.pipe(
      takeWhile( () => this.alive )
    ).subscribe(
      val => this.indiceFilteredChange.emit( val )
    );
  }



  itemsPerPageOnChange( itemsPerPage: number ) {
    this.itemsPerPageSource.next( itemsPerPage );
  }

  pageNumberOnChange( pageNumber: number ) {
    this.pageNumberSource.next( pageNumber );
  }

  headerValueOnChange( columnIndex: number, value: TCell|undefined ) {
    this.headerValueSource.next({ columnIndex: columnIndex, value: value });
  }

  resetOnClick( columnIndex: number ) {
    this.resetClickSource.next( columnIndex );
  }

  resetAllOnClick() {
    this.resetAllClickSource.next( undefined );
  }

  sortOnChange( sortBy: Sort ) {
    this.sortBySource.next( sortBy );
  }


  cellOnClick(
    rowIndexInThisPage: number,
    columnIndex:        number,
    indiceSliced:       number[],
    itemsPerPage:       number,
    pageNumber:         number,
  ) {
    this.clickedCellPosition.emit({
      rowIndex: indiceSliced[ rowIndexInThisPage ],
      rowIndexInTableFiltered: itemsPerPage * (pageNumber - 1) + rowIndexInThisPage,
      columnIndex: columnIndex
    });
  }
}
