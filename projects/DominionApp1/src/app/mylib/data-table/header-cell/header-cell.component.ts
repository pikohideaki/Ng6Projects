import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TCell } from '../types/table-cell';
import { SelectorOption } from '../types/selector-option';
import { HeaderSetting } from '../types/header-setting';

@Component({
  selector: 'app-header-cell',
  templateUrl: './header-cell.component.html',
  styles: []
})
export class HeaderCellComponent implements OnInit {

  @Input() headerSetting!: HeaderSetting;
  @Input() selectorOptions!: SelectorOption[];

  @Input() headerValue!: TCell;
  @Output() headerValueChange = new EventEmitter<TCell>();


  constructor() { }

  ngOnInit() {
    this.headerSetting = this.headerSetting || new HeaderSetting();
    this.selectorOptions = this.selectorOptions || [];
    this.headerValue = this.headerValue || '';
  }

  changeHeaderValue( value: TCell|undefined ) {
    this.headerValueChange.emit( value );
  }

  resetOnClick() {
    this.changeHeaderValue( undefined );
  }
}
