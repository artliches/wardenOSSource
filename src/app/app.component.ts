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
  charName = '';
  defaultStatArray: CharacterStats;
  derelictButtonText = this.random.getRandomSaying(99, 2).text;
  displayCrewMember = false;
  displayDerelict = false;
  displayPrintButton = false;
  displayTrinketPatch = false;
  genDerelict = false;
  personButtonText = this.random.getRandomSaying(99, 1).text;
  previousSaying = [];
  randomSaying = [];
  trinketPatch = [];
  wardenSubtext = this.random.getRandomSaying(99, 0).text;

  constructor(private random: RandomNumberService) {}

  ngOnInit() {
    document.title = 'WARDEN OS ONLINE';
  }

  generateDerelict() {
    document.title = `WARDEN OS ONLINE`;

    this.displayTrinketPatch = false;
    this.displayCrewMember = false;
    this.displayPrintButton = false;
    this.displayDerelict = true;

    this.genDerelict = !this.genDerelict;
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
    this.displayDerelict = false;
    this.displayTrinketPatch = false;
    this.displayCrewMember = true;
    this.displayPrintButton = true;
  }

  generateRandomTrinketPatch() {
    this.trinketPatch = [];
    this.trinketPatch.push({ type: 'trinket', info: this.random.getTrinketOrPatch(0, 99, true)});
    this.trinketPatch.push({ type: 'patch', info: this.random.getTrinketOrPatch(0, 99, false)});

    document.title = `WARDEN OS ONLINE`;

    this.displayDerelict = false;
    this.displayTrinketPatch = true;
    this.displayCrewMember = false;
    this.displayPrintButton = false;
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

  passCharName(name: string) {
    this.charName = name;
    document.title = `MOTHERSHIP_${this.charName}`;
  }

  print() {
    window.print();
  }
 }
