import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { utils } from '../../utilities';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input()  rowSize$: Observable<number>;
  @Input()  itemsPerPage$: Observable<number>;
  @Input()  pageNumber$: Observable<number>;
  @Output() pageNumberChange = new EventEmitter<number>();

  pageLength$: Observable<number>;
  rangeStart$: Observable<number>;
  rangeEnd$:   Observable<number>;
  pageIndice$: Observable<number[]>;


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
