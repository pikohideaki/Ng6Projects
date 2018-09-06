import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent          } from './home.component';
import { NotFoundPageComponent  } from './not-found-page.component';
import { EditDatabaseComponent  } from './database/edit-database.component';
import { UserAdminComponent     } from './database/user-admin/user-admin.component';
import { FeedbackComponent      } from './feedback/feedback.component';
import { FeedbackAdminComponent } from './feedback/feedback-admin.component';

/* toy-box */
import { ToyBoxComponent } from './piko-apps/toy-box/toy-box.component';
import { LambdaInterpreterComponent } from './piko-apps/toy-box/lambda-interpreter/lambda-interpreter.component';

/* Tools-Collection */
import { ToolsCollectionComponent } from './piko-apps/tools-collection/tools-collection.component';
import { Tsv2jsonComponent } from './piko-apps/tools-collection/tsv2json/tsv2json.component';
import { JsonPrettyPrintComponent } from './piko-apps/tools-collection/json-pretty-print/json-pretty-print.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { component: HomeComponent,              path: '' },
      { component: EditDatabaseComponent,      path: 'edit-database' },
      { component: UserAdminComponent,         path: 'user-admin' },
      { component: FeedbackComponent,          path: 'feedback' },
      { component: FeedbackAdminComponent,     path: 'feedback-admin' },
      { component: ToyBoxComponent,            path: 'toybox' },
      { component: LambdaInterpreterComponent, path: 'toybox/lambda-interpreter' },
      { component: ToolsCollectionComponent,   path: 'tools-collection' },
      { component: Tsv2jsonComponent,          path: 'tools-collection/tsv2json' },
      { component: JsonPrettyPrintComponent,   path: 'tools-collection/json-pretty-print' },
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
