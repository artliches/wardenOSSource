import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RandomTablesComponent } from './randomTables/randomTables.component';
import { CharacterGeneratorComponent } from './characterGenerator/characterGenerator.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterGeneratorComponent,
    RandomTablesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
