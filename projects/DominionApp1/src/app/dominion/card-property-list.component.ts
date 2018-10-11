import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FireDatabaseService } from '../database/database.service';

import { CardPropertyDialogComponent } from './sub-components/card-property-dialog/card-property-dialog.component';
import { HeaderSetting } from '../mylib/data-table/types/header-setting';
import { ITableSettings } from '../mylib/data-table/types/table-settings';
import { CellPosition } from '../mylib/data-table/types/cell-position';
import { TCell } from '../mylib/data-table/types/table-cell';
import { cardCostToStr, cardTypeToJpStr, implementedToStr, randomizerCandidateToStr } from './functions/transform-card-property';
import { CardType } from './types/card-type';



@Component({
  selector: 'app-card-property-list',
  template: `
    <div class="body-with-padding">
      <app-data-table
        [table]='table$ | async'
        [settings]='settings'
        (clickedCellPosition)='showDetail( $event )'
        (filteredIndiceOnChange)="filteredIndiceOnChange( $event )">
      </app-data-table>
    </div>
  `,
})
export class CardPropertyListComponent implements OnInit {

  settings: ITableSettings = {
    displayNo: true,
    usepagination: true,
    itemsPerPageInit: 50,
    itemsPerPageOptions: [25, 50, 100, 200],
    headerSettings: [
      new HeaderSetting({
        filterType  : 'input',
        displayName : '名前',
        isButton    : true,
      }),
      new HeaderSetting({
        filterType  : 'input',
        displayName : 'Name',
      }),
      new HeaderSetting({
        filterType  : 'multiSelect-or',
        displayName : 'セット名',
      }),
      new HeaderSetting({
        filterType  : 'select',
        displayName : '分類',
      }),
      new HeaderSetting({
        filterType  : 'multiSelect-and',
        displayName : '種別',
        transform   : value => cardTypeToJpStr( <CardType>value ),
      }),
      new HeaderSetting({
        filterType  : 'none',
        displayName : 'コスト',
      }),
      new HeaderSetting({
        filterType  : 'none',
        displayName : 'VP',
      }),
      new HeaderSetting({
        filterType  : 'none',
        displayName : '+card',
      }),
      new HeaderSetting({
        filterType  : 'none',
        displayName : '+action',
      }),
      new HeaderSetting({
        filterType  : 'none',
        displayName : '+buy',
      }),
      new HeaderSetting({
        filterType  : 'none',
        displayName : '+coin',
      }),
      new HeaderSetting({
        filterType  : 'none',
        displayName : '+VPtoken',
      }),
      new HeaderSetting({
        filterType  : 'select',
        displayName : 'ゲーム実装状況',
        transform   : value => implementedToStr( <boolean>value ),
      }),
      new HeaderSetting({
        filterType  : 'select',
        displayName : 'ランダマイザー対象',
        transform   : value => randomizerCandidateToStr( <boolean>value ),
      }),
    ],
  };

  table$: Observable<TCell[][]>
    = this.database.cardPropertyList$.pipe(
              map( list => list.map( obj => [
                obj.nameJp, // '名前'
                obj.nameEng, // 'Name'
                obj.expansionName, // 'セット名'
                obj.category, // '分類'
                obj.cardTypes, // '種別'
                cardCostToStr( obj.cost ), // 'コスト'
                obj.VP, // 'VP'
                obj.drawCard, // '+card'
                obj.action, // '+action'
                obj.buy, // '+buy'
                obj.coin, // '+coin'
                obj.VPtoken, // '+VPtoken'
                obj.implemented, // 'ゲーム実装状況'
                obj.randomizerCandidate, // 'ランダマイザー対象'
              ] ))
  );

  filteredIndice: number[] = [];

  constructor(
    public dialog: MatDialog,
    private database: FireDatabaseService,
  ) {
  }

  ngOnInit() {
  }

  showDetail( position: CellPosition ) {
    const dialogRef = this.dialog.open( CardPropertyDialogComponent, { autoFocus: false } );
    dialogRef.componentInstance.indiceInCardList = this.filteredIndice;
    dialogRef.componentInstance.showingIndexInit = position.rowIndexInTableFiltered;
  }

  filteredIndiceOnChange( indice: number[] ) {
    this.filteredIndice = indice;
  }
}
