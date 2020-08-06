import { Component, OnChanges, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { SPACE_STATION } from '../services/randomTables.constants';
import { RandomNumberService } from '../services/randomNumber.service';
import { StationAttributes } from '../interfaces/mosh.interface';

@Component({
  selector: 'app-space-station-generator',
  templateUrl: './space-station-generator.component.html',
  styleUrls: ['./space-station-generator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpaceStationGeneratorComponent implements OnChanges {
  @Input() coreOrRim: boolean;
  @Input() stationAttributes: StationAttributes;
  @Output() stationTitle = new EventEmitter<string>();
  amalgamationStructure = [];
  stationType = "";
  stationIdentifier = '';
  crisisOrSafe = '';
  locationDescrips = [];
  stationDescrip = '';
  stationNotableLocations = '';
  stationStructure = '';

  objectKeys = Object.keys;

  constructor(private random: RandomNumberService) { }

  ngOnChanges() {
    this.stationIdentifier = '';
    this.stationDescrip = '';
    this.crisisOrSafe = '';
    this.stationStructure = '';
    this.amalgamationStructure = [];
    this.generateRandomStation();
  }

  generateRandomStation() {
    this.objectKeys(SPACE_STATION).forEach(key => {
      this.stationAttributes[SPACE_STATION[key].title] =
        SPACE_STATION[key].table[this.random.getRandomNumber(0, SPACE_STATION[key].table.length - 1)];
    });

    const stationName = `<b class='magenta'>${this.stationAttributes.station_name1} ${this.stationAttributes.station_name2}</b>`;
    const numLocations = this.random.getRandomNumber(1, 10);
    const locationThemes = [];
    for (let i = 0; i < numLocations; i++) {
      locationThemes.push(SPACE_STATION[11].table[this.random.getRandomNumber(0, 9)]);
    }
    this.locationDescrips = [];
    locationThemes.forEach(theme => {
      if (SPACE_STATION[11].location_descrip[theme]) {
       this.locationDescrips.push(SPACE_STATION[11].location_descrip[theme][this.random.getRandomNumber(0, 99)]);
      }
    });

    if (this.coreOrRim) {
      this.stationType = `Corespace Station`;
      this.stationIdentifier = `${this.stationAttributes.station_name1.toUpperCase()} ${this.stationAttributes.station_name2.toUpperCase()}`;      
      this.stationDescrip = `
        ${stationName} is a(n) <b class='magenta'>${this.stationAttributes.core_station}</b>
        orbiting a(n) <b class='magenta'>${this.stationAttributes.celestial_body}</b>.
        It's run by a(n) <b class='magenta'>${this.stationAttributes.core_leader}</b>
        backed by <b class='magenta'>${this.stationAttributes.control_faction.trim()}
        </b>. Docking costs <b class='magenta'>${this.random.getRandomNumber(1, 10) * 100}
        </b>cr, and a cheap room is <b class='magenta'>${this.random.getRandomSum(2, 1, 100)}</b>cr/night.
      `;

      const isInCrisis  = this.random.getRandomNumber(1, 100) <= 5;
      if (isInCrisis){
        this.crisisOrSafe =
          `<div class='crisis-warning'>!!!WARNING!!!</div>${stationName} is in the midst of a
          ${this.random.rollStringDice(`${this.stationAttributes.crisis}`, 'd1')}
          <div class='crisis-warning'>!!!WARNING!!!</div>`;
      } else {
        const percentOff = this.random.getRandomNumber(1, 100) - 10;
        this.crisisOrSafe =
          `You can buy supplies and fuel as per normal, though at a hefty markup of
          <b class='magenta'>${this.random.getRandomSum(2, 1, 100)}</b>%. They also buy <b class='magenta'>${this.stationAttributes[6]}</b> at
          <b class='magenta'>${percentOff > 0 ? percentOff : 0}</b>% off and local free-traders have a line on where to find
          <b class='magenta'>${this.stationAttributes.resource}</b>.`;
      }

      this.stationStructure = this.createStationStructure(stationName);

      this.stationNotableLocations = `${stationName} has <b class='magenta'>${numLocations} notable location(s)</b>.`;
    } else {
      this.stationType = `Rimspace Outpost`;
      this.stationIdentifier = this.random.rollStringDice(`${this.stationAttributes.call_sign.trim()}`, '[d');
      this.stationDescrip = `
        Out on the rim, near a(n) <b class='magenta'>${this.stationAttributes.rim_landmarks.trim()}</b>,
        a(n) <b class='magenta'>${this.stationAttributes.rim_station.trim()}</b> station (call-sign
        <b class="magenta">${this.stationIdentifier}</b>) spins. It\'s outwardly controlled
        by <b class='magenta'>${this.stationAttributes.control_faction.trim()}</b>, though is subtly undermined by
        <b class='magenta'>${this.stationAttributes.rival_faction.trim()}</b>, led by a(n)
        <b class='magenta'>${this.stationAttributes.rival_leader.trim()}</b>.
      `;

      const isInCrisis = this.random.getRandomNumber(1, 100) <= 20;
      if (isInCrisis){
        this.crisisOrSafe =
          `<div class='crisis-warning'>!!!WARNING!!!</div>
          <b class="magenta">${this.stationIdentifier}</b> is in the midst of a ${this.random.rollStringDice(`${this.stationAttributes.crisis}`, 'd1')}
          <div class='crisis-warning'>!!!WARNING!!!</div>`;
       } else {
        this.crisisOrSafe =
          `You can buy fuel as normal, but they are currently only offering <b class='magenta'>${this.stationAttributes.goods}</b>
          for sale and there\'s a rumor going around that the station is in dire need of
          <b class='magenta'>${this.stationAttributes.resource}</b>.`;

       }

      this.stationStructure = this.createStationStructure(`<b class="magenta">${this.stationIdentifier}</b>`);
      this.stationNotableLocations = `<b class="magenta">${this.stationIdentifier}</b>
        has <b class='magenta'>${numLocations} notable location(s)</b>.`;
    }

    this.stationTitle.emit(`${this.stationIdentifier.toUpperCase()}`);
  }

  createAmalgamationStructure(numberOfRolls: number) {
    for (let i = numberOfRolls; i > 0; i--) {
      const rand = this.random.getRandomNumber(0, 9);
      if (rand === 9) {
        this.createAmalgamationStructure(i + 2);
      } else {
        // SPACE_STATION[9] is where the structures are stored.
        this.amalgamationStructure.push(` >> ${SPACE_STATION[9].table[rand]}`);
      }
    }
  }

  createStationStructure(name: string): string {
    let structure =  `${name}`;
    if (this.stationAttributes.structure.indexOf('Asteroid') !== -1) {
      structure += ` is built on an ${this.stationAttributes.structure}.`;
    } else if (this.stationAttributes.structure.indexOf('Modular') !== -1) {
      structure += ` is ${this.stationAttributes.structure}.`;
    } else if (this.stationAttributes.structure.indexOf('Amalgamation') !== -1) {
      this.createAmalgamationStructure(2);
      structure += ` is an amalagamation, with the following modules haphazardly conjoined:`;
    } else {
      structure += ` is built like a ${this.stationAttributes.structure}.`;
    }

    return structure;
  }

}
