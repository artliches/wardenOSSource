import { Component, OnInit } from '@angular/core';
import { CharacterStats } from './interfaces/mosh.interface';
import { RandomNumberService } from './services/randomNumber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  buttonText = this.random.getRandomSaying(99, 1).text;
  bias = false;
  charName = '';
  displayCrewMember = false;
  displayDerelict = false;
  displayPrintButton = false;
  displayTrinketPatch = false;
  defaultStatArray: CharacterStats;
  previousSaying = 0;
  randomSaying: any;
  trinketPatch = [];
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
    document.title = `MOTHERSHIP_${this.charName}`;
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

  getRandomSaying() {
    this.randomSaying = this.random.getRandomSaying(this.previousSaying, 1);
    this.buttonText = this.randomSaying.text;
    this.previousSaying = this.randomSaying.num;
  }

  passCharName(name: string) {
    this.charName = name;
  }

  print() {
    document.title = `MOTHERSHIP_${this.charName}`;
    window.print();
    document.title = `WARDEN OS ONLINE`;
  }
 }
