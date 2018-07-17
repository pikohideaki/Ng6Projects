import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material.module';

// message dialog
import { MessageDialogComponent  } from './message-dialog.component';
import { AlertDialogComponent    } from './alert-dialog.component';
import { ConfirmDialogComponent  } from './confirm-dialog.component';

// data table
import { ItemsPerPageComponent } from './data-table/items-per-page.component';
import { DataTableComponent } from './data-table/data-table.component';
import { PaginationComponent } from './data-table/pagination/pagination.component';
import { ObjectDataTableComponent } from './data-table/object-data-table.component';
import { HeaderCellComponent } from './data-table/header-cell.component';

import { WaitingSpinnerComponent } from './waiting-spinner.component';
import { AppListComponent } from './app-list/app-list.component';
import { MultipleDatePickerComponent } from './multiple-date-picker/multiple-date-picker.component';



@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
  ],
  exports: [
    MessageDialogComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    WaitingSpinnerComponent,
    AppListComponent,
    DataTableComponent,
    ItemsPerPageComponent,
    PaginationComponent,
    ObjectDataTableComponent,
    HeaderCellComponent,
    MultipleDatePickerComponent,
  ],
  declarations: [
    MessageDialogComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    WaitingSpinnerComponent,
    ItemsPerPageComponent,
    DataTableComponent,
    PaginationComponent,
    ObjectDataTableComponent,
    HeaderCellComponent,
    AppListComponent,
    MultipleDatePickerComponent,
  ],
  entryComponents: [
    MessageDialogComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
  ]
})
export class MyLibModule { }
