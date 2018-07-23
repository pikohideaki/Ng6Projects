import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DatabaseService } from '../database/database.service';
import { Feedback } from './feedback';

@Component({
  selector: 'app-feedback-admin',
  templateUrl: './feedback-admin.component.html',
  styleUrls: [ '../my-lib/data-table/data-table.component.css' ]
})
export class FeedbackAdminComponent implements OnInit {

  feedbacks$: Observable<Feedback[]>;

  constructor(
    private database: DatabaseService
  ) {
    this.feedbacks$ = this.database.feedbacks$;
  }

  ngOnInit() {
  }

  issueClosedChange( feedbackID: string, value: boolean ) {
    this.database.feedbacks.closeIssue( feedbackID, value );
  }

}
