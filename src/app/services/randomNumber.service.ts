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

    getRandomSaying(previousNum: number, sayingsIndex: number) {
      const randomSayings = [
        'GIVE ME A POUND OF FLESH',
        'ONCE MORE UNTO THE BREACH',
        'ONE SMALL STEP FOR MAN',
        'SHOOT FOR THE MOON',
        'A TIME TO LIVE',
        'A TIME TO DIE',
        'A LAMB FOR THE SLAUGHTER',
        'IT\'S TIME TO GO',
        '01110011 01101111 01110011'
      ];

      const randomPerson = [
        'HERO',
        'LAMB',
        'MEATBAG',
        'MEAT-POPSICLE',
        'MULTIPASS',
        'ASTRONAUT',
        'EXPLORER',
        'SACRIFICE',
        'FOOL',
        'VILLIAN',
        'WANDERER',
        'SPACER',
        'REPLICANT',
        'POUND OF FLESH'
      ];

      const sayings = [
        randomSayings, randomPerson
      ];

      let chosenSaying: number;
      do {
        chosenSaying = this.getRandomNumber(0, sayings[sayingsIndex].length - 1);
      } while (chosenSaying === previousNum);

      return {num: chosenSaying, text: sayings[sayingsIndex][chosenSaying]};
    }
}
