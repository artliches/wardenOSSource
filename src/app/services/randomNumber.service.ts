import { Injectable } from '@angular/core';
import {PATCH_TABLE, TRINKET_TABLE, CLASSES} from './randomTables.constants';

@Injectable({
    providedIn: 'root'
})

export class RandomNumberService {
    // tslint:disable: no-string-literal
    getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    getTrinketOrPatch(min: number, max: number, isTrinket: boolean) {
        const rand = this.getRandomNumber(min, max);

        if (isTrinket) {
          return (TRINKET_TABLE.find(trinket => trinket.num === rand));
        } else {
          return (PATCH_TABLE.find(patch => patch.num === rand));
        }
    }

    createCrewMember(): any {
      const crewMember = {};
      let comScore = 0;
      let intScore = 0;
      let spdScore = 0;
      let strScore = 0;

      for (let i = 0; i < 6; i++) {
        comScore += this.getRandomNumber(1, 10);
        intScore += this.getRandomNumber(1, 10);
        spdScore += this.getRandomNumber(1, 10);
        strScore += this.getRandomNumber(1, 10);
      }
      crewMember['CLASS'] = CLASSES[this.getRandomNumber(0, 3)];
      crewMember['STRENGTH'] = strScore;
      crewMember['SPEED'] = spdScore;
      crewMember['INTELLECT'] = intScore;
      crewMember['COMBAT'] = comScore;

      if (crewMember['CLASS'] === 'TEAMSTER') {
        crewMember['STRENGTH'] += 5;
        crewMember['SPEED'] += 5;
      } else if (crewMember['CLASS'] === 'ANDROID') {
        crewMember['SPEED'] += 5;
        crewMember['INTELLECT'] += 5;
      } else if (crewMember['CLASS'] === 'SCIENTIST') {
        crewMember['INTELLECT'] += 10;
      } else {
        crewMember['COMBAT'] += 5;
      }

      return crewMember;
    }
}
