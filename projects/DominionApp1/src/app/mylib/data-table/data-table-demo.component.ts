import { Component, OnInit } from '@angular/core';
import { TCell } from './types/table-cell';
import { ITableSettings } from './types/table-settings';
import { HeaderSetting } from './types/header-setting';
import { utils } from '../utilities';

@Component({
  selector: 'app-data-table-demo',
  template: `
    <div class="margined-element">
      <app-data-table
        [table]="table"
        [settings]="settings"
        (cellclicked)="cellOnClick( $event )"
        (tableFilteredChange)="tableFilteredOnChange( $event )"
        (indiceFilteredChange)="indiceFilteredOnChange( $event )" >
      </app-data-table>
    </div>
  `
})

export class DataTableDemoComponent implements OnInit {

  private alph = utils.string.getAlphabets('lower');

  table: TCell[][] = utils.number.seq0(100).map( () => {
      const randomAlphabets = this.alph.filter( () => Math.random() >= 0.5 );
      return [
          utils.number.random.getShuffled( randomAlphabets ).join(''),
          // randomAlphabets.join(''),
          randomAlphabets,
          randomAlphabets.length,
        ];
    });

  settings: ITableSettings = {
      usepagination: true,
      displayNo: true,
      itemsPerPageInit: 25,
      itemsPerPageOptions: [10, 20, 25, 50, 100],
      headerSettings: [
        new HeaderSetting({
          displayName : 'alphabets',
          filterType  : 'input',
          sort        : true,
        }),
        new HeaderSetting({
          displayName : 'alphabets set',
          filterType  : 'multiSelect-and',
          sort        : false,
        }),
        new HeaderSetting({
          displayName : 'length',
          filterType  : 'select',
          sort        : true,
          compareFn   : (x, y) => Number(x) - Number(y),
        }),
      ],
    };

  constructor() {
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
