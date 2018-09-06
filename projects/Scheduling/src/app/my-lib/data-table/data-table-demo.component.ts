import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TCell } from './types/table-cell';
import { ITableSettings } from './types/table-settings';

@Component({
  selector: 'app-data-table-demo',
  template: `
    <div class="margined-element">
      <app-data-table
        [table$]="table$"
        [settings]="settings"
        (cellclicked)="cellOnClick( $event )"
        (tableFilteredChange)="tableFilteredOnChange( $event )"
        (indiceFilteredChange)="indiceFilteredOnChange( $event )" >
      </app-data-table>
    </div>
  `
})

export class DataTableDemoComponent implements OnInit {
  table$!: Observable<TCell[][]>;
  settings!: ITableSettings;

  constructor() {
    this.settings = {
      usepagination: true,
      displayNo: true,
      itemsPerPageInit: 50,
      itemsPerPageOptions: [25, 50, 100, 200],
      headerSettings: [],
    };
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
