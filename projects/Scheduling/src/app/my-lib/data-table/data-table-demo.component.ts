import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TCell } from './types/table-cell';
import { ITableSettings } from './types/table-settings';

@Component({
  selector: 'app-data-table-demo',
  template: `
    <div class="margined-element">
      <app-data-table
        [table]="table"
        [settings]="settings"
        (clickedCellPosition)="cellOnClick( $event )"
        (indiceFilteredChange)="indiceFilteredOnChange( $event )" >
      </app-data-table>
    </div>
  `
})

export class DataTableDemoComponent implements OnInit {
  table!: TCell[][];
  settings!: ITableSettings;

  constructor() {
    this.settings = {
      usepagination: true,
      displayNo: true,
      itemsPerPageInit: 50,
      itemsPerPageOptions: [25, 50, 100, 200],
      headerSettings: [
        {
          displayName : 'No.',
          filterType  : 'none',
          align       : 'r',
          isButton    : false,
          isLink      : false,
          enableSort  : false,
          compareFn   : (x, y) => 0,
          transform   : (val, pos) => val.toString(),
        },
        {
          displayName : 'name',
          filterType  : 'input',
          align       : 'l',
          isButton    : false,
          isLink      : false,
          enableSort  : false,
          compareFn   : (x, y) => 0,
          transform   : (val, pos) => val.toString(),
        },
        {
          displayName : 'password',
          filterType  : 'input',
          align       : 'l',
          isButton    : false,
          isLink      : false,
          enableSort  : false,
          compareFn   : (x, y) => 0,
          transform   : (val, pos) => val.toString(),
        },
      ],
    };

    this.table = [
      [1, 'aaa', 123],
      [2, 'bbb', 234],
      [3, 'ccc', 345],
    ];
  }

  ngOnInit() { }


  cellOnClick( event: any ) {
    console.log( event );
  }

  tableFilteredOnChange( event: any ) {
    console.log( event );
  }
  indiceFilteredOnChange( event: any ) {
    console.log( event );
  }

}
