import { Component, OnInit } from '@angular/core';
import { CharacterStats } from './interfaces/mosh.interface';
import { RandomNumberService } from './services/randomNumber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  bias = false;
  pagePrintTitle = '';
  coreOrRim: boolean;
  defaultStatArray: CharacterStats;
  derelictButtonText = this.random.getRandomSaying(99, 2).text;
  flags = {
    crew: false,
    derelict: false,
    print: false,
    trinket: false,
    station: false
  };
  genDerelict = false;
  genSpaceStation = [];
  personButtonText = this.random.getRandomSaying(99, 1).text;
  previousSaying = [];
  randomSaying = [];
  trinketPatch = [];
  wardenSubtext = this.random.getRandomSaying(99, 0).text;

  objectKeys = Object.keys;

  constructor(private random: RandomNumberService) {}

  ngOnInit() {
    document.title = 'WARDEN OS ONLINE';
  }

  flipFlags(flagName: string) {
    this.objectKeys(this.flags).forEach(key => {
      if (flagName === key) {
        this.flags[key] = true;
      } else {
        this.flags[key] = false;
      }
    });
  }

  generateDerelict() {
    document.title = `WARDEN OS ONLINE`;
    this.genDerelict = !this.genDerelict;
    this.flags.print = true;
  }

  generateRandomCrewMember(bias: boolean) {
    this.bias = bias;
    this.defaultStatArray = {
      stress: 2,
      resolve: 0,
      max_Health: 0,
      strength: 0,
      speed: 0,
      intellect: 0,
      combat: 0
  };
    this.flags.print = true;
  }

  generateRandomTrinketPatch() {
    this.trinketPatch = [];
    this.trinketPatch.push({ type: 'trinket', info: this.random.getTrinketOrPatch(0, 99, true)});
    this.trinketPatch.push({ type: 'patch', info: this.random.getTrinketOrPatch(0, 99, false)});

    document.title = `WARDEN OS ONLINE`;
  }

  generateRandomSpaceStation(coreOrRim) {
    document.title = `WARDEN OS ONLINE`;
    this.coreOrRim = coreOrRim;
    this.genSpaceStation = [];

    this.flags.print = true;
  }

  getRandomDerelictSaying() {
    this.randomSaying[1] = this.random.getRandomSaying(this.previousSaying[1], 2);
    this.derelictButtonText = this.randomSaying[1].text;
    this.previousSaying[1] = this.randomSaying[1].num;
  }

  getRandomPersonSaying() {
    this.randomSaying[0] = this.random.getRandomSaying(this.previousSaying[0], 1);
    this.personButtonText = this.randomSaying[0].text;
    this.previousSaying[0] = this.randomSaying[0].num;
  }

  getRandomWardenSubtext() {
    this.randomSaying[2] = this.random.getRandomSaying(this.previousSaying[2], 0);
    this.wardenSubtext = this.randomSaying[2].text;
    this.previousSaying[2] = this.randomSaying[2].num;
  }

  passPagePrintTitle(name: string) {
    this.pagePrintTitle = name;
    document.title = `MOTHERSHIP_${this.pagePrintTitle}`;
  }

  print() {
    window.print();
  }
 }
