import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
import { DataTableDemoComponent } from './data-table/data-table-demo.component';

import { WaitingSpinnerComponent } from './waiting-spinner.component';
import { AppListComponent } from './app-list/app-list.component';
import { MultipleDatePickerComponent } from './multiple-date-picker/multiple-date-picker.component';
import { MultipleDatePickerDemoComponent } from './multiple-date-picker/multiple-date-picker-demo.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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
    DataTableDemoComponent,
    MultipleDatePickerComponent,
    MultipleDatePickerDemoComponent,
  ],
  declarations: [
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
    DataTableDemoComponent,
    MultipleDatePickerComponent,
    MultipleDatePickerDemoComponent,
  ],
  entryComponents: [
    MessageDialogComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
  ]
})
export class MyLibModule { }
