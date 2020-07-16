import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DERELICT, SHIP_NAMES, SPACE_STATION } from 'src/app/services/randomTables.constants';
import { RandomNumberService } from 'src/app/services/randomNumber.service';
import { title } from 'process';

@Component({
  selector: 'app-derelict-generator',
  templateUrl: './derelict-generator.component.html',
  styleUrls: ['./derelict-generator.component.scss']
})
export class DerelictGeneratorComponent implements OnChanges {
  @Input() genDerelict = false;
  @Output() derelictTitle = new EventEmitter<string>();
  derelictObject: any;
  derelictName = '';
  objectKeys = Object.keys;

  constructor(private random: RandomNumberService) { }

  ngOnChanges() {
    this.rollRandomDerelict();
  }

  reRoll(selector: string) {
    const rand = this.random.getRandomNumber(0, 99);
    const sIndex = selector === '-1' ? 'dTitle' : this.derelictObject.findIndex(x => x.title.toUpperCase() === selector);

    if (sIndex === 'dTitle') {
      this.getDerelictName();
    } else {
      this.rollNewSection(sIndex, rand);
    }
  }

  private rollNewSection(sIndex: any, rand: number) {
    const derelict = DERELICT[sIndex];
    let tableResults = this.random.rollStringDice(derelict.table[rand], 'd1');
    let previousValue = this.derelictObject[sIndex].table;

    const salvage1 = derelict.title === 'salvage_2' ? this.random.rollStringDice(DERELICT[sIndex - 1].table[rand], 'd1') : '';
    const previousSalvage1 = derelict.title === 'salvage_2' ? this.derelictObject[sIndex - 1].table : '';

    if (salvage1 !== '' && previousSalvage1 !== '') {
      previousValue = `${previousSalvage1}, ${previousValue}`;
      tableResults = `${salvage1}, ${tableResults}`;
    }

    if (previousValue === tableResults) {
      this.rollNewSection(sIndex, this.random.getRandomNumber(0, 99));
    } else {
      this.derelictObject[sIndex].table = tableResults;
    }
  }

  rollRandomDerelict() {
    let salvage = '';
    this.derelictName = '';
    this.derelictObject = this.objectKeys(DERELICT).map((key) => {
      const rand = this.random.getRandomNumber(0, 99);
      const derelict = DERELICT[key];
      const tableResults = this.random.rollStringDice(derelict.table[rand], 'd1') ;

      if (derelict.title === 'salvage_1' || derelict.title === 'salvage_2') {
        salvage = salvage + tableResults;
        if (derelict.title === 'salvage_1') {
          salvage = salvage + ', ';
        }
      }

      return {
        title: derelict.title === 'salvage_2' ? 'salvage' : derelict.title,
        table: derelict.title === 'salvage_2' ? salvage :  tableResults
      };
    });
    this.getDerelictName();
  }

  private getDerelictName() {
    this.derelictName = '';
    SHIP_NAMES.forEach(name => {
      this.derelictName = `${this.derelictName} ${name[this.random.getRandomNumber(0, 9)]}`.trim();
    });
    this.derelictTitle.emit(`THE ${this.derelictName}`);
  }
}
