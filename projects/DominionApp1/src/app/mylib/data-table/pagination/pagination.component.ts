import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, combineLatest, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { utils } from '../../utilities';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  private rowSizeSource = new ReplaySubject<number>(1);
  rowSize$: Observable<number> = this.rowSizeSource.asObservable();
  @Input() set rowSize( value: number ) {
    if ( value === undefined || value === null ) return;
    this.rowSizeSource.next( value );
  }

  private itemsPerPageSource = new ReplaySubject<number>(1);
  itemsPerPage$: Observable<number> = this.itemsPerPageSource.asObservable();
  @Input() set itemsPerPage( value: number ) {
    if ( value === undefined || value === null ) return;
    this.itemsPerPageSource.next( value );
  }

  private pageNumberSource = new ReplaySubject<number>(1);
  pageNumber$: Observable<number> = this.pageNumberSource.asObservable();
  @Input() set pageNumber( value: number ) {
    if ( value === undefined || value === null ) return;
    this.pageNumberSource.next( value );
  }

  @Output() pageNumberChange = new EventEmitter<number>();

  pageLength$!: Observable<number>;
  rangeStart$!: Observable<number>;
  rangeEnd$!:   Observable<number>;
  pageIndice$!: Observable<number[]>;


  constructor(
  ) {
  }

  ngOnInit() {
    this.pageLength$
      = combineLatest( this.rowSize$, this.itemsPerPage$,
          (rowSize, itemsPerPage) => Math.ceil( rowSize / itemsPerPage ) );

    this.pageIndice$
      = this.pageLength$.pipe( map( len => utils.number.numSeq( 1, len ) ) );

    this.rangeStart$ = combineLatest(
        this.itemsPerPage$,
        this.pageNumber$,
        (itemsPerPage, pageNumber) =>
          itemsPerPage * (pageNumber - 1) + 1 );

    this.rangeEnd$ = combineLatest(
        this.itemsPerPage$,
        this.pageNumber$,
        this.rowSize$,
        (itemsPerPage, pageNumber, rowSize) =>
          Math.min( rowSize, (itemsPerPage * pageNumber) ) );
  }

  setPageNumber( pageNumber: number ) {
    this.pageNumberChange.emit( pageNumber );
  }
}
