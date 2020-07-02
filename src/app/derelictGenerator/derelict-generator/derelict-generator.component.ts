import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DERELICT, SHIP_NAMES, SPACE_STATION } from 'src/app/services/randomTables.constants';
import { RandomNumberService } from 'src/app/services/randomNumber.service';

@Component({
  selector: 'app-derelict-generator',
  templateUrl: './derelict-generator.component.html',
  styleUrls: ['./derelict-generator.component.scss']
})
export class DerelictGeneratorComponent implements OnChanges {
  @Input() genDerelict = false;
  derelictObject: any;
  derelictName = '';
  objectKeys = Object.keys;

  constructor(private random: RandomNumberService) { }

  ngOnChanges() {
    this.rollRandomDerelict();
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
    SHIP_NAMES.forEach(name => {
      this.derelictName = `${this.derelictName} ${name[this.random.getRandomNumber(0, 9)]}`.trim();
    });
  }
}
