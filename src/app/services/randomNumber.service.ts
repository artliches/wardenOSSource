import { Injectable } from '@angular/core';
import {PATCH_TABLE, TRINKET_TABLE} from './randomTables.constants';

@Injectable({
    providedIn: 'root'
})

export class RandomNumberService {
    // tslint:disable: no-string-literal
    getRandomSum(numRolls: number, min: number, max: number) {
      let sum = 0;
      for (let i = 0; i < numRolls; i++) {
        sum += this.getRandomNumber(min, max);
      }
      return sum;
    }
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

    rollStringDice(stringToParse: string, parseKey: string): string {
      let iterations: any;
      let units = 0;
      let dieEndIndex: number;
      let dieSize: number;
      let dieIndex = stringToParse.indexOf(parseKey);

      if (parseKey === '[d') {
        iterations = 1;
        const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        do {
          dieIndex = stringToParse.indexOf(parseKey);
          dieEndIndex = stringToParse.indexOf('0]', dieIndex);
          const letterIndex = stringToParse.indexOf('[Letter]');

          if (dieEndIndex > -1 && dieIndex > -1) {
            dieSize = Number(stringToParse.slice(dieIndex + 2, dieEndIndex + 1));

            units = this.getRandomSum(iterations, 1, dieSize);
            stringToParse = stringToParse.replace(`[d${dieSize}]`, units.toString());
          }

          if (letterIndex > -1) {
            const randAlpha = alpha[this.getRandomNumber(0, alpha.length - 1)];
            stringToParse = stringToParse.replace('[Letter]', randAlpha);
          }

        } while (stringToParse.indexOf('[') > -1);
      } else if (parseKey === 'd1')  {
        const additionIndex = stringToParse.indexOf('+');
        const kcrIndex = stringToParse.indexOf('kcr');

        if (dieIndex > -1) {
          let removeUnderline = false;
          iterations = stringToParse[dieIndex - 1];
          dieEndIndex = stringToParse.indexOf(' ', dieIndex);
          dieSize = Number(stringToParse.slice(dieIndex + 1, dieEndIndex));
          units += this.getRandomSum(iterations, 1, dieSize);

          if (additionIndex > -1) {
            let addition = 0;
            if (kcrIndex > -1) {
              addition = Number(stringToParse.slice(additionIndex + 1, stringToParse.indexOf('kcr', additionIndex)));
            } else {
              addition = Number(stringToParse.slice(additionIndex + 1, stringToParse.indexOf('x', additionIndex)));
            }
            units += addition;
            stringToParse = stringToParse.replace(` + ${addition}`, '');
          } else if (kcrIndex > -1) {
            removeUnderline = true;
            dieEndIndex = stringToParse.indexOf('kcr', dieIndex);
            dieSize = Number(stringToParse.slice(dieIndex + 1, kcrIndex));
            units = this.getRandomSum(iterations, 1, dieSize) * 10;
          }
          stringToParse = removeUnderline ?
            stringToParse.replace(`<u>${iterations}d${dieSize}kcr</u>`, `<b class="magenta">${units.toString()}</b>kcr`) :
            stringToParse.replace(`${iterations}d${dieSize}`, `${units.toString()}`);
        }
      }
      return stringToParse;
    }

    getRandomSaying(previousNum: number, sayingsIndex: number) {
      const randomSayings = [
        'T-MINUS 10...',
        'GIVE ME A POUND OF FLESH',
        'ONCE MORE UNTO THE BREACH',
        'ONE SMALL STEP FOR MAN',
        'SHOOT FOR THE MOON',
        'A TIME TO LIVE',
        'A TIME TO DIE',
        'A LAMB FOR THE SLAUGHTER',
        '01110011 01101111 01110011',
        'GAME OVER MAN!',
        'ALLMOTHER, ARE YOU AWAKE?',
        'IF DREAMS CAN COME TRUE, WHAT DOES THAT SAY ABOUT NIGHTMARES?',
        'LIKE TEARS IN THE RAIN',
        'A BLACK BLOOD NOTHINGNESS BEGAN TO SPIN',
        'A SYSTEM OF CELLS INTERLINKED WITHIN CELLS INTERLINKED WITHIN CELLS INTERLINKED WITHIN ONE STEM',
        'AND DREADFULLY DISTINCT AGAINST THE DARK A TALL WHITE FOUNTAIN PLAYED',
        'YOU\'RE NOT HELPING. WHY IS THAT?'
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

      const randomDerelict = [
        'DERELICT',
        'HUSK',
        'GRAVE',
        'COFFIN',
        'DEATH-TRAP',
        'SEPULCHER',
      ];

      const sayings = [
        randomSayings, randomPerson, randomDerelict
      ];

      let chosenSaying: number;
      do {
        chosenSaying = this.getRandomNumber(0, sayings[sayingsIndex].length - 1);
      } while (chosenSaying === previousNum);

      return {num: chosenSaying, text: sayings[sayingsIndex][chosenSaying]};
    }
}
