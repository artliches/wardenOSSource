import { Component } from '@angular/core';
import { RandomNumberService } from './services/randomNumber.service';
import { MISSION_BRIEF } from './services/missionBriefings.constants';
import { Brief } from './interfaces/brief.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private random: RandomNumberService) {}
  acceptedCommand = '';
  patchTrinket: any;
  crewManifest: any;
  briefList = [];
  brief: Brief;
  errorMessage: any;

  objectKeys = Object.keys;

  acceptCommand(input: any) {
    this.errorMessage = '';
    this.briefList = [];

    if (input.includes('trinket') || input.includes('patch')) {
      const isTrinket = input === 'trinket -g' ? true : false;
      this.patchTrinket = this.random.getTrinketOrPatch(1, 100, isTrinket);
    } else if (input.includes('crew')) {
      this.crewManifest = this.random.createCrewMember();
    } else if (input.includes('mission_brief/')) {
      const numSectorIndex = input.indexOf('/') + 1;
      this.locateMissionBrief(input.slice(numSectorIndex));
    }
    this.acceptedCommand = input;
  }

  locateMissionBrief(locator: any) {
    if (locator === 'list') {
      this.briefList = MISSION_BRIEF.map(brief => {
        return brief;
      });
    } else {
      this.brief = MISSION_BRIEF.find(brief => brief.num === Number(locator));
    }
    if (typeof this.brief === 'undefined' && locator !== 'list') {
      this.errorMessage = `mission_brief/${locator} not found`;
    }
  }
}
