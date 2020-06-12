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
  acceptedCommand = '';
  patchTrinket: any;
  crewManifest: any;
  briefList = [];
  brief: Brief;
  errorMessage: any;
  shipStatus: ShipStatus;
  rougeAI: string;

  objectKeys = Object.keys;

  acceptCommand(input: any) {
    this.errorMessage = '';
    this.briefList = [];
    this.rougeAI = '';

    if (input.includes('trinket') || input.includes('patch')) {
      const isTrinket = input === 'trinket -g' ? true : false;
      this.patchTrinket = this.random.getTrinketOrPatch(1, 100, isTrinket);
    } else if (input.includes('crew')) {
      // this.crewManifest = this.random.createCrewMember();
      this.rougeAI = '<<You don\'t deserve this yet>>';
    } else if (input.includes('mission_brief/')) {
      const numSectorIndex = input.indexOf('/') + 1;
      this.locateMissionBrief(input.slice(numSectorIndex));
    } else if (input.includes('ship/')) {
      const shipCommand = input.indexOf('/') + 1;
      this.commandShip(input.slice(shipCommand).toLowerCase());
    } else if (input === 'hello') {
      this.rougeAI = '<<greetings>>';
    } else if (input === 'kill') {
      this.rougeAI = '<<Do it yourself, meatbag>>';
    } else if (input === 'goodbye') {
      this.rougeAI = '<<Good riddance>>';
    }
    this.acceptedCommand = input;
  }

  commandShip(locator: any) {
    if (locator === 'status') {
      this.shipStatus = {
        primaryModules: {
          lifeSupport: 'online, no problems detected',
          command: 'online, no problems detected',
        },
        secondaryModules: {
          jumpDrives: 'online',
          computer: 'online',
          galley: 'structrually sound',
          livingQuarters: 'structrually sound',
          barracks: 'structurally sound',
          cargohold: {
            status: 'structrually sound',
            contents: ['None']
          },
          scienceLab: 'structrually sound, online',
          thrusters: 'online',
          engine: 'online',
          fuel: '5 units remain',
          frame: 'structrually sound'
        }
      };
    } else {
      this.errorMessage = `command ship/${locator} not recognized`; 
    }
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
