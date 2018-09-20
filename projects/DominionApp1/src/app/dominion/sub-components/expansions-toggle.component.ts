import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';

import { FireDatabaseService } from '../../database/database.service';
import { startWith } from 'rxjs/operators';


@Component({
  selector: 'app-expansions-toggle',
  template: `
    <div *ngFor="let expansion of (expansions$ | async)" >
      <mat-slide-toggle color="primary"
          [checked]="expansion.selected"
          (change)="toggleExpansion( $event.checked, expansion.index )">
        {{expansion.name}}
      </mat-slide-toggle>
    </div>
  `,
  styles: []
})
export class ExpansionsToggleComponent implements OnInit {

  @Input()  isSelectedExpansions$!: Observable<boolean[]>;
  @Output() isSelectedExpansionsPartEmitter
    = new EventEmitter<{ index: number, checked: boolean }>();

  expansions$!: Observable<{ selected: boolean, name: string, index: number }[]>;


  constructor(
    private database: FireDatabaseService,
  ) {
  }

  ngOnInit() {
    this.expansions$
      = combineLatest(
          this.isSelectedExpansions$,
          this.database.expansionNameList$,
          (isSelectedList, nameList) =>
            isSelectedList.map( (e, i) =>
              ({ selected: e, name: nameList[i], index: i }) ) )
        .pipe( startWith([]) );
  }

  toggleExpansion( checked: boolean, index: number ) {
    this.isSelectedExpansionsPartEmitter.emit({ checked: checked, index: index });
  }
}
