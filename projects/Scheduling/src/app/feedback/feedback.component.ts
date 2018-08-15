import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';

import { DatabaseService } from '../database/database.service';
import { ConfirmDialogComponent } from '../my-lib/confirm-dialog.component';
import { Feedback } from './feedback';
import { FeedbackCategory } from './feedback-category';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: [ '../my-lib/data-table/data-table.component.css' ]
})
export class FeedbackComponent implements OnInit {

  name: string = '';
  report: string = '';
  category: FeedbackCategory = '';

  feedbacks$: Observable<Feedback[]>;

  constructor(
    private dialog: MatDialog,
    private database: DatabaseService
  ) {
    this.feedbacks$ = this.database.feedbacks$;
  }

  ngOnInit() {
  }

  nameChange( name: string ) {
    this.name = name;
  }

  reportChange( report: string ) {
    this.report = report;
  }

  categoryChange( category: FeedbackCategory ) {
    this.category = category;
  }


  submit() {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = '送信してもよろしいですか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        this.database.feedbacks.add( new Feedback( {
          id:        '',
          name:      this.name,
          content:   this.report,
          timestamp: Date.now(),
          closed:    false,
          category:  this.category,
        }) );
        this.name = '';
        this.report = '';
      }
    });
  }
}
