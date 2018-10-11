import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SignaturePadModule } from 'angular2-signaturepad';

import { MyOwnCustomMaterialModule } from './my-own-custom-material.module';

import { AppComponent } from './app.component';
import { MnistComponent } from './mnist/mnist.component';

@NgModule({
  declarations: [
    AppComponent,
    MnistComponent
  ],
  imports: [
    BrowserModule,
    SignaturePadModule,
    MyOwnCustomMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
