import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RandomTablesComponent } from './randomTables/randomTables.component';
import { CharacterGeneratorComponent } from './characterGenerator/characterGenerator.component';
import { CommandLineInterfaceComponent } from './commandLineInterface/commandLineInterface.component';
import { TrinketPatchDisplayComponent } from './trinketPatchDisplay/trinketPatchDisplay.component';

@NgModule({
  declarations: [
    AppComponent,
    CommandLineInterfaceComponent,
    CharacterGeneratorComponent,
    RandomTablesComponent,
    TrinketPatchDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
