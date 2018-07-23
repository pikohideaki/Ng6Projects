import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest, merge } from 'rxjs';
import { map,
         withLatestFrom,
         debounceTime,
         takeWhile,
         startWith,
         skip
        } from 'rxjs/operators';

import { filterFunction } from './functions/filter-function';
import { indexOnRawData } from './functions/index-on-raw-data';
import { slice } from './functions/slice';
import { makeSelectOptions } from './functions/make-select-options';
import { SelectorOption } from './types/selector-option';
import { TCell } from './types/table-cell';
import { CellPosition } from './types/cell-position';
import { TableSettings } from './types/table-settings';
import { isValidSetting } from './functions/is-valid-setting';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  /**
   * number, string, boolean or Array of those are supported for cell type
   */

  @Input() table$!: Observable<TCell[][]>;
  @Input() settings!: TableSettings;

  @Output() cellClicked = new EventEmitter<CellPosition>();

  @Output() tableFilteredChange = new EventEmitter<TCell[][]>();
  @Output() indiceFilteredChange = new EventEmitter<number[]>();

  private headerValuesAllSource = new BehaviorSubject<TCell[]>([]);
  private pageNumberSource = new BehaviorSubject<number>(1);
  private itemsPerPageSource = new BehaviorSubject<number>(100);

  headerValuesAll$: Observable<TCell[]>;
  selectorOptionsAll$: Observable<SelectorOption[][]>;

  private tableWithDefault$: Observable<TCell[][]>;
  private tableFiltered$: Observable<TCell[][]>;
  private indiceFiltered$: Observable<number[]>;
  tableFilteredRowSize$: Observable<number>;
  itemsPerPage$: Observable<number>;
  pageLength$: Observable<number>;
  pageNumber$: Observable<number>;
  private tableSliced$: Observable<TCell[][]>;
  tableSlicedTransformed$: Observable<string[][]>;



  constructor() { }

  ngOnInit() {
    /* Input check */
    console.assert( !!this.table$,
      'テーブルデータが与えられていません。' );

    console.assert( !!this.settings,
      '設定が与えられていません。' );

    this.itemsPerPageSource.next( this.settings.itemsPerPageInit );

    /* observables */
    this.tableWithDefault$
      = this.table$
          .pipe( map( table => isValidSetting( this.settings ) ? table : [] ) );

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
                              this.settings.headerSettings,
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
                    this.settings.headerSettings, ) )
        );

    this.tableFilteredRowSize$
      = this.tableFiltered$.pipe( map( e => e.length ) );

    this.itemsPerPage$
      = this.itemsPerPageSource.asObservable().pipe( skip(1) )
          .pipe( startWith( this.settings.itemsPerPageInit || 100 ) );

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


    this.tableSliced$
      = combineLatest(
          this.itemsPerPage$,
          this.pageNumber$
        ).pipe(
          withLatestFrom( this.tableFiltered$ ),
          map( ([[itemsPerPage, pageNumber], tableFiltered]) =>
            slice( tableFiltered, itemsPerPage, pageNumber ) ),
        );

    this.tableSlicedTransformed$
      = this.tableSliced$.pipe(
          map( table => table.map( line =>
            line.map( (elm, idx) =>
              this.settings.headerSettings[idx].transform( elm ) ))
          ));
            // ( Array.isArray( elm )
            //         ? elm.map( e => this.transform( key, e ) ).join(', ')
            //         : this.transform( key, elm ) );


    /* subscriptions */
    this.indiceFiltered$
      .pipe( takeWhile( () => this.alive ) )
      .subscribe( val => {
        this.indiceFilteredChange.emit( val );
      });

    this.tableFiltered$
      .pipe( takeWhile( () => this.alive ) )
      .subscribe( val => this.tableFilteredChange.emit( val ) );

    this.tableSlicedTransformed$
      .pipe( takeWhile( () => this.alive ) )
      .subscribe( val => console.log( 'tst', val ) );
  }



  ngOnDestroy() {
    this.alive = false;
  }


  itemsPerPageOnChange( value ) {
    this.itemsPerPageSource.next( value );
  }

  pageNumberOnChange( value ) {
    this.pageNumberSource.next( value );
  }

  headerValueOnChange( columnIndex: number, value: TCell ) {
    const headerValues = this.headerValuesAllSource.getValue();
    headerValues[columnIndex] = value;
    this.headerValuesAllSource.next( headerValues );
  }

  reset( columnIndex: number ) {
    this.headerValueOnChange( columnIndex, undefined );
  }

  resetAll() {
    const headerValues = this.headerValuesAllSource.getValue();
    headerValues.fill( undefined );
    this.headerValuesAllSource.next( headerValues );
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
                  this.settings.headerSettings,
                  headerValuesAll ),
      rowIndexInTableFiltered: rowIndexInTableFiltered,
      columnIndex: columnIndex
    });
  }

}
