import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AlertDialogComponent } from './my-lib/alert-dialog.component';
import { ConfirmDialogComponent } from './my-lib/confirm-dialog.component';
import { MessageDialogComponent } from './my-lib/message-dialog.component';
import { WaitingSpinnerComponent } from './my-lib/waiting-spinner.component';
import { HeaderCellComponent } from './my-lib/data-table/header-cell.component';
import { ItemsPerPageComponent } from './my-lib/data-table/items-per-page.component';
import { ObjectDataTableComponent } from './my-lib/data-table/object-data-table.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    WaitingSpinnerComponent,
    HeaderCellComponent,
    ItemsPerPageComponent,
    ObjectDataTableComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
