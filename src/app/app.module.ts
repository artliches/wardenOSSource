import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterGeneratorComponent } from './characterGenerator/characterGenerator.component';
import { CommandLineInterfaceComponent } from './commandLineInterface/commandLineInterface.component';
import { TrinketPatchDisplayComponent } from './trinketPatchDisplay/trinketPatchDisplay.component';
import { DerelictGeneratorComponent } from './derelictGenerator/derelict-generator/derelict-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    CommandLineInterfaceComponent,
    CharacterGeneratorComponent,
    TrinketPatchDisplayComponent,
    DerelictGeneratorComponent,
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
