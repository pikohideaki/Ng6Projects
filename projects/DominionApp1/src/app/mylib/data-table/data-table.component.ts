import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest, merge, ReplaySubject } from 'rxjs';
import { map, withLatestFrom, debounceTime, startWith, skip } from 'rxjs/operators';

import { filterFunction } from './functions/filter-function';
import { indexOnRawData } from './functions/index-on-raw-data';
import { slice } from './functions/slice';
import { makeSelectOptions } from './functions/make-select-options';
import { SelectorOption } from './types/selector-option';
import { TCell } from './types/table-cell';
import { CellPosition } from './types/cell-position';
import { ITableSettings } from './types/table-settings';
import { isValidSetting } from './functions/is-valid-setting';
import { Sort } from '@angular/material';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  /**
   * sypported cell types:
   *   * number
   *   * string
   *   * boolean,
   *   * Array<number>
   *   * Array<string>
   *   * Array<boolean>
   */

  private tableSource = new ReplaySubject<TCell[][]>(1);
  table$: Observable<TCell[][]> = this.tableSource.asObservable();
  @Input() set table( value: TCell[][] ) {
    // console.log( 'table', value );
    if ( !value || !Array.isArray( value ) || !Array.isArray( value[0] ) ) return;
    this.tableSource.next( value );
  }


  private settingsSource = new ReplaySubject<ITableSettings>(1);
  private _settings!: ITableSettings;
  @Input() set settings( value: ITableSettings ) {
    if ( !value ) return;
    this.settingsSource.next( value );
    this._settings = value;
  }
  settings$ = this.settingsSource.asObservable();
  usePagenation$: Observable<boolean>
    = this.settings$.pipe( map( e => !!e.usepagination ) );
  displayNo$: Observable<boolean>
    = this.settings$.pipe( map( e => !!e.displayNo ) );


  @Output() cellClicked = new EventEmitter<CellPosition>();

  @Output() tableFilteredChange = new EventEmitter<TCell[][]>();
  @Output() indiceFilteredChange = new EventEmitter<number[]>();

  private headerValuesAllSource = new BehaviorSubject<(TCell|undefined)[]>([]);
  headerValuesAll$!: Observable<(TCell|undefined)[]>;

  selectorOptionsAll$!: Observable<SelectorOption[][]>;

  private pageNumberSource = new BehaviorSubject<number>(1);
  private itemsPerPageSource = new BehaviorSubject<number>(100);

  private sortBySource = new BehaviorSubject<Sort>({ active: 'NoColumn', direction: '' });
  private sortBy$!: Observable<Sort>;

  itemsPerPage$!: Observable<number>;
  pageLength$!: Observable<number>;
  pageNumber$!: Observable<number>;

  private tableWithDefault$!: Observable<TCell[][]>;
  private tableFiltered$!: Observable<TCell[][]>;
  private indiceFiltered$!: Observable<number[]>;
  tableFilteredRowSize$!: Observable<number>;

  private indiceFilteredSorted$!: Observable<number[]>;

  private indiceSliced$!: Observable<number[]>;
  private tableSliced$!: Observable<TCell[][]>;
  tableSlicedTransformed$!: Observable<string[][]>;

  private resetAllClickedSource = new BehaviorSubject<void>( undefined );
  resetAllClicked$ = this.resetAllClickedSource.asObservable().pipe( skip(1) );



  constructor() { }

  ngOnInit() {
    this.itemsPerPageSource.next( this._settings.itemsPerPageInit );

    /* observables */

    this.sortBy$ = merge(
      this.sortBySource.asObservable(),
      this.resetAllClicked$.pipe( map( () => <Sort>({ active: '', direction: '' }) )) );

    this.tableWithDefault$
      = this.table$
          .pipe( map( table => isValidSetting( this._settings ) ? table : [] ) );

    this.headerValuesAll$
      = this.headerValuesAllSource.asObservable()
              .pipe( debounceTime(300) );

    this.indiceFiltered$
      = combineLatest(
          this.tableWithDefault$,
          this.headerValuesAll$,
          (table, headerValuesAll) =>
            table.map( (e, i) => ({ val: e, idx: i }) )
              .filter( e => filterFunction(
                              e.val,
                              this._settings.headerSettings,
                              headerValuesAll ) )
              .map( e => e.idx ) );

    this.tableFiltered$
      = this.indiceFiltered$.pipe(
          withLatestFrom( this.tableWithDefault$ ),
          map( ([indice, table]) => indice.map( idx => table[idx] ) )
        );

    this.selectorOptionsAll$
      = this.tableFiltered$.pipe(
          withLatestFrom( this.tableWithDefault$ ),
          map( ([tableFiltered, table]) =>
                  makeSelectOptions(
                    table,
                    tableFiltered,
                    this._settings.headerSettings, ) )
        );

    this.tableFilteredRowSize$
      = this.tableFiltered$.pipe( map( e => e.length ) );

    this.itemsPerPage$
      = this.itemsPerPageSource.asObservable().pipe( skip(1) )
          .pipe( startWith( this._settings.itemsPerPageInit || 100 ) );

    this.pageLength$
      = combineLatest(
          this.tableFilteredRowSize$,
          this.itemsPerPage$,
          (length, itemsPerPage) =>
            Math.ceil( length / itemsPerPage ) );

    this.pageNumber$
      = merge(
          this.pageNumberSource.asObservable(),
          this.pageLength$.pipe( map( _ => 1 ) ) );

    this.indiceFilteredSorted$
      = combineLatest(
          this.indiceFiltered$,
          this.sortBy$,
        ).pipe(
          withLatestFrom( this.tableFiltered$ ),
          map( ([[indiceFiltered, sortBy], tableFiltered]) => {
            // console.log( indiceFiltered, sortBy, tableFiltered);

            if ( sortBy.direction === '' ) return indiceFiltered;

            let sorted = indiceFiltered.slice();

            if ( sortBy.active === 'NoColumn') {
              if ( sortBy.direction === 'desc') sorted.reverse();
              return sorted;
            } else {
              const colIndex = Number( sortBy.active );
              const cmp = this._settings.headerSettings[colIndex].compareFn;
              if ( Array.isArray( tableFiltered[0][colIndex] ) ) {
                throw new Error('要素が配列型の列のソートは非対応です。');
              }
              sorted = indiceFiltered.sort( (x, y) => cmp(
                                      tableFiltered[x][colIndex],
                                      tableFiltered[y][colIndex] ) );
              if ( sortBy.direction === 'desc') sorted.reverse();
              return sorted;
            }
          })
        );

    this.indiceSliced$
      = combineLatest(
          this.itemsPerPage$,
          this.pageNumber$,
          this.usePagenation$,
          this.indiceFilteredSorted$,
          (itemsPerPage, pageNumber, usePagenation, indiceFiltered) =>
            ( usePagenation ? slice( indiceFiltered, itemsPerPage, pageNumber )
                            : indiceFiltered ) );


    this.tableSliced$
      = this.indiceSliced$.pipe(
          withLatestFrom( this.tableWithDefault$ ),
          map( ([indice, table]) => indice.map( idx => table[idx] ) )
        );

    this.tableSlicedTransformed$
      = this.tableSliced$.pipe(
          map( table => table.map( line =>
            line.map( (elm, idx) =>
              this._settings.headerSettings[idx].transform( elm ) ) )) );
            // ( Array.isArray( elm )
            //         ? elm.map( e => this.transform( key, e ) ).join(', ')
            //         : this.transform( key, elm ) );



    // this.headerValuesAll$
    //   .subscribe( val => console.log( 'headerValuesAll', val ) );
    // this.sortBy$
    //   .subscribe( val => console.log( 'sortBy', val ) );
    this.indiceFiltered$
      .subscribe( val => console.log( 'indiceFiltered', val ) );

    this.indiceFilteredSorted$
      .subscribe( val => console.log( 'indiceFilteredSorted', val ) );

    this.indiceSliced$
      .subscribe( val => console.log( 'indiceSliced', val ) );


  }



  itemsPerPageOnChange( itemsPerPage: number ) {
    this.itemsPerPageSource.next( itemsPerPage );
  }

  pageNumberOnChange( pageNumber: number ) {
    this.pageNumberSource.next( pageNumber );
  }

  headerValueOnChange(
    columnIndex: number,
    value: TCell|undefined,
    indiceFiltered: number[],
    tableFiltered: TCell[][],
  ) {
    const headerValues = this.headerValuesAllSource.getValue();
    headerValues[columnIndex] = value;
    this.headerValuesAllSource.next( headerValues );
    this.indiceFilteredChange.emit( indiceFiltered );
    this.tableFilteredChange.emit( tableFiltered );
  }

  reset(
    columnIndex: number,
    indiceFiltered: number[],
    tableFiltered: TCell[][],
  ) {
    this.headerValueOnChange( columnIndex, undefined, indiceFiltered, tableFiltered );
  }

  resetAll() {
    const headerValues = this.headerValuesAllSource.getValue();
    headerValues.fill( undefined );
    this.headerValuesAllSource.next( headerValues );
    this.resetAllClickedSource.next( undefined );
    // this.sortBySource.next({ active: '', direction: '' });
  }

  cellOnClick(
    rawData: TCell[][],
    rowIndexInThisPage: number,
    columnIndex: number,
    headerValuesAll: TCell[],
  ) {
    const rowIndexInTableFiltered
       = this.itemsPerPageSource.value * this.pageNumberSource.value
            + rowIndexInThisPage;
    this.cellClicked.emit({
      rowIndex: indexOnRawData(
                  rawData,
                  rowIndexInTableFiltered,
                  this._settings.headerSettings,
                  headerValuesAll ),
      rowIndexInTableFiltered: rowIndexInTableFiltered,
      columnIndex: columnIndex
    });
  }

  sortOnClick( sortBy: Sort ) {
    this.sortBySource.next( sortBy );
  }


}
