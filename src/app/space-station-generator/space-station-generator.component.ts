import { Component, OnInit, OnChanges, Input, ViewEncapsulation } from '@angular/core';
import { SPACE_STATION, SHIP_NAMES } from '../services/randomTables.constants';
import { RandomNumberService } from '../services/randomNumber.service';

@Component({
  selector: 'app-space-station-generator',
  templateUrl: './space-station-generator.component.html',
  styleUrls: ['./space-station-generator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpaceStationGeneratorComponent implements OnChanges {
  @Input() coreOrRim: boolean;
  @Input() stationAblib = [];
  amalgamationStructure = [];
  callSign = '';
  crisisOrSafe = '';
  locationDescrips = [];
  stationDescrip = '';
  stationNotableLocations = '';
  stationStructure = '';

  objectKeys = Object.keys;

  constructor(private random: RandomNumberService) { }

  ngOnChanges() {
    this.callSign = '';
    this.stationDescrip = '';
    this.crisisOrSafe = '';
    this.stationStructure = '';
    this.amalgamationStructure = [];
    this.generateRandomStation();
  }

  generateRandomStation() {
    this.objectKeys(SPACE_STATION).forEach(key => {
      this.stationAblib.push(SPACE_STATION[key].table[this.random.getRandomNumber(0, SPACE_STATION[key].table.length - 1)]);
    });
    this.stationAblib.push(this.random.getRandomNumber(1, 100) <= 20);
    this.stationAblib.push(this.random.getRandomNumber(1, 100) <= 5);

    const stationName = `<b class='magenta'>${this.stationAblib[0]} ${this.stationAblib[1]}</b>`;
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
      this.stationDescrip = `
      ${stationName} is a(n) <b class='magenta'>${this.stationAblib[2]}</b>
      orbiting a(n) <b class='magenta'>${this.stationAblib[3]}</b>. It's run by a(n) <b class='magenta'>${this.stationAblib[4]}</b>
      backed by <b class='magenta'>${this.stationAblib[5]}</b>. Docking costs <b class='magenta'>${this.random.getRandomNumber(1, 10) * 100}
      </b>cr, and a cheap room is <b class='magenta'>${this.random.getRandomSum(2, 1, 100)}</b>cr/night.
    `;

      this.crisisOrSafe = this.stationAblib[this.stationAblib.length - 1] ?
        `<div class='crisis-warning'>!!!WARNING!!!</div>${stationName} is in the midst of a
        ${this.random.rollStringDice(`${this.stationAblib[8]}`, 'd1')}
        <div class='crisis-warning'>!!!WARNING!!!</div>` :
        `You can buy supplies and fuel as per normal, though at a hefty markup of
        <b class='magenta'>${this.random.getRandomSum(2, 1, 100)}</b>%. They also buy <b class='magenta'>${this.stationAblib[6]}</b> at
        <b class='magenta'>${this.random.getRandomNumber(1, 100) - 10 > 0 ? this.random.getRandomNumber(1, 100) - 10 : 0}
        </b>% off and local free-traders have a line on where to find <b class='magenta'>${this.stationAblib[7]}</b>.`;

      this.stationStructure = this.createStationStructure(stationName);

      this.stationNotableLocations = `${stationName} has <b class='magenta'>${numLocations} notable location(s)</b>.`;
    } else {
      this.callSign = this.random.rollStringDice(`${this.stationAblib[14].trim()}`, '[d');
      this.stationDescrip = `
        Out on the rim, near a(n) <b class='magenta'>${this.stationAblib[12].trim()}</b>,
        a(n) <b class='magenta'>${this.stationAblib[13].trim()}</b> station (call-sign
        <b class="magenta">${this.callSign}</b>) spins. It\'s outwardly controlled
        by <b class='magenta'>${this.stationAblib[15].trim()}</b>, though is subtly undermined by
        <b class='magenta'>${this.stationAblib[16].trim()}</b>, led by a(n)
        <b class='magenta'>${this.stationAblib[17].trim()}</b>.
      `;

      this.crisisOrSafe = this.stationAblib[this.stationAblib.length - 2] ?
        `<div class='crisis-warning'>!!!WARNING!!!</div>
        <b class="magenta">${this.callSign}</b> is in the midst of a ${this.random.rollStringDice(`${this.stationAblib[8]}`, 'd1')}
        <div class='crisis-warning'>!!!WARNING!!!</div>` :
        `You can buy fuel as normal, but they are currently only offering <b class='magenta'>${this.stationAblib[6]}</b>
        for sale and there\'s a rumor going around that the station is in dire need of <b class='magenta'>${this.stationAblib[7]}</b>.
      `;

      this.stationStructure = this.createStationStructure(`<b class="magenta">${this.callSign}</b>`);
      this.stationNotableLocations = `<b class="magenta">${this.callSign}</b>
        has <b class='magenta'>${numLocations} notable location(s)</b>.`;

    }
  }

  createAmalgamationStructure(numberOfRolls: number) {
    for (let i = numberOfRolls; i > 0; i--) {
      const rand = this.random.getRandomNumber(0, 9);
      if (rand === 9) {
        this.createAmalgamationStructure(i + 2);
      } else {
        this.amalgamationStructure.push(` ${SPACE_STATION[9].table[rand]}`);
      }
    }
  }

  createStationStructure(name: string): string {
    let structure =  `${name}`;
    if (this.stationAblib[9].indexOf('Asteroid') !== -1) {
      structure += ` is built on an ${this.stationAblib[9]}.`;
    } else if (this.stationAblib[9].indexOf('Amalgamation') !== -1) {
      this.createAmalgamationStructure(2);
      structure += ` is an amalagamation of the following structure-types:${this.amalgamationStructure}.`;
    } else {
      structure += ` is built like a ${this.stationAblib[9]}.`;
    }

    return structure;
  }

}
