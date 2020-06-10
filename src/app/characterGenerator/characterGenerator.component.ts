import { Component } from '@angular/core';
import { RandomNumberService } from '../services/randomNumber.service';

@Component({
    selector: 'app-character-generator',
    templateUrl: './characterGenerator.component.html',
    styleUrls: ['./characterGenerator.component.scss']
})

export class CharacterGeneratorComponent {
    combatScore: number;
    intellectScore: number;
    speedScore: number;
    strengthScore: number;

    statGen = false;

    constructor(private randomNumber: RandomNumberService) {}

    rollStats() {
        this.combatScore = 0;
        this.intellectScore = 0;
        this.speedScore = 0;
        this.strengthScore = 0;

        for (let i = 0; i < 6; i++) {
            this.combatScore += this.randomNumber.getRandomNumber(1, 10);
            this.intellectScore += this.randomNumber.getRandomNumber(1, 10);
            this.speedScore += this.randomNumber.getRandomNumber(1, 10);
            this.strengthScore += this.randomNumber.getRandomNumber(1, 10);
        }

        this.statGen = true;
    }
}
