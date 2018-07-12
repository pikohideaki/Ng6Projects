import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TCell } from './types/table-cell';
import { SelectorOption } from './types/selector-option';
import { HeaderSetting } from './types/header-setting';

@Component({
  selector: 'app-header-cell',
  template: `
    <ng-container [ngSwitch]="headerSetting.filterType">
      <ng-container *ngSwitchCase="'input'">
        <mat-form-field>
          <input matInput
              [placeholder]="headerSetting.displayName"
              [value]="headerValue || ''"
              (input)="changeHeaderValue( $event.target.value )" >
          <button matSuffix mat-icon-button (click)="resetOnClick()">
            <mat-icon class='clear-select-icon'>clear</mat-icon>
          </button>
        </mat-form-field>
      </ng-container>
      <ng-container *ngSwitchCase="'select'">
        <mat-form-field>
          <mat-select
              [placeholder]="headerSetting.displayName"
              [value]="headerValue || ''"
              (change)="changeHeaderValue( $event.value )" >
            <mat-option *ngFor="let option of selectorOptions"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick()">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchCase="'multiSelect-and'">
        <mat-form-field>
          <mat-select
                [placeholder]="headerSetting.displayName"
                [value]="headerValue || '' "
                (change)="changeHeaderValue( $event.value )"
                multiple>
            <mat-option *ngFor="let option of selectorOptions"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick()">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchCase="'multiSelect-or'">
        <mat-form-field>
          <mat-select
                [placeholder]="headerSetting.displayName"
                [value]="headerValue || '' "
                (change)="changeHeaderValue( $event.value )"
                multiple>
            <mat-option *ngFor="let option of selectorOptions"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick()">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <span> {{headerSetting.displayName}} </span>
      </ng-container>
    </ng-container>
  `,
  styles: []
})
export class HeaderCellComponent implements OnInit {

  @Input() headerSetting!: HeaderSetting;
  @Input() selectorOptions!: SelectorOption[];

  @Input() headerValue!: TCell;
  @Output() headerValueChange = new EventEmitter<TCell>();


  constructor() { }

  ngOnInit() {
  }

  changeHeaderValue( value: TCell ) {
    this.headerValueChange.emit( value );
  }

  resetOnClick() {
    this.changeHeaderValue( undefined );
  }
}
