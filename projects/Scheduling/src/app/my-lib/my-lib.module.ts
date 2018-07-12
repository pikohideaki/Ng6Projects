import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { PaginationComponent } from './data-table/pagination/pagination.component';
import { AppListComponent } from './app-list/app-list.component';
import { MultipleDatePickerComponent } from './multiple-date-picker/multiple-date-picker.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DataTableComponent, PaginationComponent, AppListComponent, MultipleDatePickerComponent]
})
export class MyLibModule { }
