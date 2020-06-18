import { Component } from '@angular/core';
import { CharacterStats } from './interfaces/mosh.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  createCrewMember = false;
  defaultStatArray: CharacterStats;
  constructor() {}

  generateRandomCrewMember() {
    this.defaultStatArray = {
      stress: 2,
      resolve: 0,
      max_Health: 0,
      strength: 0,
      speed: 0,
      intellect: 0,
      combat: 0
  };
    this.createCrewMember = true;
  }
 }
