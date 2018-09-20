import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GameResult } from '../../../../../classes/game-result';
import { CardProperty } from '../../../../../classes/card-property';


@Component({
  selector: 'app-online-game-result-dialog',
  templateUrl: './online-game-result-dialog.component.html',
  styleUrls: [
    '../../../../../mylib/data-table/data-table.component.css',
    './online-game-result-dialog.component.css'
  ]
})
export class OnlineGameResultDialogComponent implements OnInit {

  gameResult$!: Observable<GameResult>;  // input
  cardPropertyList$!: Observable<CardProperty[]>;


  constructor() {}

  ngOnInit() {}
}
