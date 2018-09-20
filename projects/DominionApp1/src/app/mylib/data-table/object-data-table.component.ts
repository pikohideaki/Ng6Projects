import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { TCell } from './types/table-cell';
import { CellPosition } from './types/cell-position';
import { IObjectTableSettings } from './types/object-table-settings';

@Component({
  selector: 'app-object-data-table',
  template: `
    <app-data-table
        [table]="table$ | async">
    </app-data-table>
  `,
  styles: []
})
export class ObjectDataTableComponent implements OnInit {

  @Input() table$!: Observable<TCell[][]>;
  @Input() settings!: IObjectTableSettings;

  @Output() cellClicked = new EventEmitter<CellPosition>();

  @Output() tableFilteredChange = new EventEmitter<TCell[][]>();
  @Output() indiceFilteredChange = new EventEmitter<number[]>();

  // private headerValuesSource = new BehaviorSubject<TableCell[]>([]);
  // private pageNumberSource = new BehaviorSubject<number>(1);
  // private itemsPerPageSource = new BehaviorSubject<number>(100);


  constructor() { }

  ngOnInit() {
  }

}
