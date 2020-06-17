import { Component } from '@angular/core';
import { RandomNumberService } from './services/randomNumber.service';
import { MISSION_BRIEF } from './services/missionBriefings.constants';
import { Brief, ShipStatus } from './interfaces/mosh.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private random: RandomNumberService) {}
 }
