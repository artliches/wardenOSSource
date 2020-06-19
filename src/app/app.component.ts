import { Component } from '@angular/core';
import { CharacterStats } from './interfaces/mosh.interface';
import { RandomNumberService } from './services/randomNumber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  buttonText = this.random.getRandomSaying(99, 1).text;
  bias = false;
  createCrewMember = false;
  defaultStatArray: CharacterStats;
  previousSaying = 0;
  randomSaying: any;
  constructor(private random: RandomNumberService) {}

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
    this.createCrewMember = true;
  }

  getRandomSaying() {
    this.randomSaying = this.random.getRandomSaying(this.previousSaying, 1);
    this.buttonText = this.randomSaying.text;

    this.previousSaying = this.randomSaying.num;
  }
 }
