import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { MyLibModule } from './my-lib/my-lib.module';
import { DatabaseModule } from './database/database.module';

import { AppComponent } from './app.component';

import { HomeComponent } from './home.component';
import { NotFoundPageComponent } from './not-found-page.component';
import { NewEventComponent } from './scheduling/new-event/new-event.component';

import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackAdminComponent } from './feedback/feedback-admin.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundPageComponent,
    NewEventComponent,
    FeedbackComponent,
    FeedbackAdminComponent,
  ],
  imports: [
    BrowserModule,
    AngularMaterialModule,
    AppRoutingModule,
    MyLibModule,
    DatabaseModule,
  ],
  // providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
