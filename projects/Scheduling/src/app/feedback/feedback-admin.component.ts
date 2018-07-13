import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DatabaseService } from '../database/database.service';
import { Feedback } from './feedback';

@Component({
  selector: 'app-feedback-admin',
  template: `
    <ng-container *ngIf="{
          feedbacks: feedbacks$ | async
        } as data">
      <div class="body-with-padding">
        <table class="data-table  data-table--shadow3px data-table--vertical-line">
          <thead>
            <tr>
              <th>Done</th>
              <th>Name</th>
              <th>Category</th>
              <th>Issue</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let fb of data.feedbacks">
              <td>
                <mat-checkbox
                  [checked]="fb.closed"
                  (change)="issueClosedChange( fb.databaseKey, $event.checked )">
                </mat-checkbox>
              </td>
              <td>{{fb.name}}</td>
              <td>
                <div [ngSwitch]="fb.category">
                  <mat-icon *ngSwitchCase="'bugReport'" matTooltip="バグ報告">bug_report</mat-icon>
                  <mat-icon *ngSwitchCase="'suggestion'" matTooltip="アイデアなど">lightbulb_outline</mat-icon>
                  <span *ngSwitchDefault></span>
                </div>
              </td>
              <td class="data-table--cell-alignLeft">
                {{fb.content}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ng-container>
  `,
  styleUrls: [ '../my-own-library/data-table/data-table.component.css' ]
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
