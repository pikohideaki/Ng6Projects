import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent          } from './home.component';
import { NotFoundPageComponent  } from './not-found-page.component';
// import { EditDatabaseComponent  } from './firebase-mediator/edit-database.component';
// import { UserAdminComponent     } from './firebase-mediator/user-admin/user-admin.component';
import { FeedbackComponent      } from './feedback/feedback.component';
import { FeedbackAdminComponent } from './feedback/feedback-admin.component';

/* scheduling */
import { NewEventComponent } from './scheduling/new-event/new-event.component';
// import { AnswerPageComponent } from './scheduling/answer-page/answer-page.component';
// import { EditEventComponent  } from './scheduling/edit-event/edit-event.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { component: HomeComponent,              path: '' },
      { component: NewEventComponent,          path: 'new-event' },
      // { component: EditDatabaseComponent,      path: 'edit-database' },
      // { component: UserAdminComponent,         path: 'user-admin' },
      { component: FeedbackComponent,          path: 'feedback' },
      { component: FeedbackAdminComponent,     path: 'feedback-admin' },
      // { component: AnswerPageComponent,        path: 'scheduling/answer/:eventId' },
      // { component: EditEventComponent,         path: 'scheduling/edit-event/:eventId' },
      { component: NotFoundPageComponent,      path: '**' },
    ], { useHash: true } ),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
  ]
})
export class AppRoutingModule { }
