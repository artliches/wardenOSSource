import { Component, OnInit } from '@angular/core';
import { RandomNumberService } from '../services/randomNumber.service';
import { CharacterStats, CharacterSaves } from '../interfaces/mosh.interface';
import { FIRST_NAMES, LAST_NAMES, SKILLS } from '../services/randomTables.constants';

@Component({
    selector: 'app-character-generator',
    templateUrl: './characterGenerator.component.html',
    styleUrls: ['./characterGenerator.component.scss']
})

export class CharacterGeneratorComponent implements OnInit {
    classArray = [
        'teamster',
        'android',
        'scientist',
        'marine'
    ];
    class = '';
    name = '';
    savesArray: CharacterSaves;
    savesPresets = {
        teamster: {
            sanity : 30,
            fear: 35,
            body: 30,
            armor: 35
        },
        android: {
            sanity : 20,
            fear: 85,
            body: 40,
            armor: 25
        },
        scientist: {
            sanity : 40,
            fear: 25,
            body: 25,
            armor: 30
        },
        marine: {
            sanity : 25,
            fear: 30,
            body: 35,
            armor: 40
        }
    };
    skillsArray = [];
    skillsPresets = {
        teamster : {
            base: ['zero-g', 'mechanical repair'],
            pickOne: ['heavy machinery', 'piloting'],
            skillPoints: 4
        },
        android: {
            base: ['linguistics', 'computers', 'mathematics'],
            skillPoints: 2
        },
        scientist: {
            pickTwo: ['biology', 'hydroponics',
                'geology', 'computers',
                'mathematics', 'chemistry'],
            skillPoints: 3
        },
        marine: {
            base: ['military training'],
            skillPoints: 3
        }
    };
    statsArray: CharacterStats;
    objectKeys = Object.keys;

    constructor(private randomNumber: RandomNumberService) {}

    ngOnInit() {
        this.statsArray = {
            stress: 2,
            resolve: 0,
            max_Health: 0,
            strength: 0,
            speed: 0,
            intellect: 0,
            combat: 0
        };
        this.generateName();
        this.rollStats();
        this.rollClass();
        this.assignSaves();
        this.assignSkills();
    }

    assignSaves() {
        this.savesArray = this.savesPresets[this.class];
    }

    assignSkills() {
        const baseSkills = this.skillsPresets[this.class].base;
        const pickOne = this.skillsPresets[this.class].pickOne;
        const pickTwo = this.skillsPresets[this.class].pickTwo;
        let points = this.skillsPresets[this.class].skillPoints;
        const skillsToFind = [];
        let pickTwoCounter = 0;

        if (baseSkills) {
            skillsToFind.push(...baseSkills);
        }
        if (pickOne) {
            skillsToFind.push(pickOne[this.randomNumber.getRandomNumber(0, 1)]);
        }
        if (pickTwo) {
            do {
                const chosenSkill = pickTwo[this.randomNumber.getRandomNumber(0, 5)];

                if (!skillsToFind.includes(chosenSkill)) {
                    pickTwoCounter ++;
                    skillsToFind.push(chosenSkill);
                }
            } while (pickTwoCounter !== 2);
        }

        // point buy
        do {
            // pick any random skill where the point value is not larger than what we have and that we match the prerequisetes
            const filteredSkills = SKILLS.filter(skill => {
                return skill.cost <= points &&
                    (skill.pre.some(item => skillsToFind.includes(item.toLowerCase())) || skill.pre.length === 0) &&
                    (!skillsToFind.includes(skill.descrip.slice(0, skill.descrip.indexOf(':')).toLowerCase()));
            });
            const skillToPush = filteredSkills[this.randomNumber.getRandomNumber(0, filteredSkills.length - 1)];
            skillsToFind.push(skillToPush.descrip.slice(0, skillToPush.descrip.indexOf(':')).toLowerCase());
            points -= skillToPush.cost;
        } while (points > 0);


        skillsToFind.forEach(skill => {
            this.skillsArray.push(SKILLS.find(x => x.descrip.slice(0, x.descrip.indexOf(':')).toLowerCase() === skill.toLowerCase()));
        });
    }

    generateName() {
        this.name = `${FIRST_NAMES[this.randomNumber.getRandomNumber(0, 99)]} ${LAST_NAMES[this.randomNumber.getRandomNumber(0, 99)]}`;
    }

    rollClass() {
        this.class = this.classArray[this.randomNumber.getRandomNumber(0, 3)];
        switch (this.class) {
            case 'teamster': {
                this.statsArray.strength += 5;
                this.statsArray.speed += 5;
                break;
            }
            case 'android' : {
                this.statsArray.speed += 5;
                this.statsArray.intellect += 5;
                break;
            }
            case 'scientist' : {
                this.statsArray.intellect += 10;
                break;
            }
            case 'marine' : {
                this.statsArray.combat += 5;
                break;
            }
        }
        this.statsArray.max_Health = this.statsArray.strength * 2;
    }

    rollStats() {
        for (let i = 0; i < 6; i++) {
            this.statsArray.strength += this.randomNumber.getRandomNumber(1, 10);
            this.statsArray.speed += this.randomNumber.getRandomNumber(1, 10);
            this.statsArray.intellect += this.randomNumber.getRandomNumber(1, 10);
            this.statsArray.combat += this.randomNumber.getRandomNumber(1, 10);
        }
    }
}
