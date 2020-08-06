import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterGeneratorComponent } from './characterGenerator/characterGenerator.component';
import { TrinketPatchDisplayComponent } from './trinketPatchDisplay/trinketPatchDisplay.component';
import { DerelictGeneratorComponent } from './derelictGenerator/derelict-generator/derelict-generator.component';
import { SpaceStationGeneratorComponent } from './space-station-generator/space-station-generator.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CharacterGeneratorComponent,
    TrinketPatchDisplayComponent,
    DerelictGeneratorComponent,
    SpaceStationGeneratorComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
