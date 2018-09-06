import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOwnCustomMaterialModule } from '../my-own-custom-material.module';
import { MyLibModule } from '../mylib/mylib';

import { SchedulingModule      } from './scheduling/scheduling.module';
import { ToyBoxModule          } from './toy-box/toy-box.module';
import { ToolsCollectionModule } from './tools-collection/tools-collection.module';

@NgModule({
  imports: [
    CommonModule,
    MyOwnCustomMaterialModule,
    MyLibModule,
    SchedulingModule,
    ToyBoxModule,
    ToolsCollectionModule,
  ],
  exports: [
    SchedulingModule,
    ToyBoxModule,
    ToolsCollectionModule,
  ],
  declarations: []
})
export class PikoAppsModule { }
