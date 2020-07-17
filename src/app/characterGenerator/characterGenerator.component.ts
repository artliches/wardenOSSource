import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { RandomNumberService } from '../services/randomNumber.service';
import { CharacterStats, CharacterSaves } from '../interfaces/mosh.interface';
import { FIRST_NAMES, LAST_NAMES, SKILLS, ITEMS, STRESS_PANIC, DERELICT } from '../services/randomTables.constants';

@Component({
    selector: 'app-character-generator',
    templateUrl: './characterGenerator.component.html',
    styleUrls: ['./characterGenerator.component.scss']
})

export class CharacterGeneratorComponent implements OnChanges {
    @Input() bias: boolean;
    @Input() statsArray: CharacterStats;
    @Output() charName = new EventEmitter<string>();

    classArray = [
        'teamster',
        'android',
        'scientist',
        'marine'
    ];
    class = '';
    credits = 0;
    equipmentArray = [];
    equipmentPresets = {
        excavation: [
            'Crowbar',
            'Hand Welder',
            'Laser Cutter',
            'Body Cam',
            'Bioscanner',
            'Infrared Goggles',
            'Lockpick Set',
            'Vaccsuit',
            'Oxygen Tank',
            'Mag-Boots',
            'Short-range Comms'
        ],
        exploration: [
            'Vibechete',
            'Rigging Gun',
            'Flare Gun',
            'First Aid Kit',
            'Vaccsuit',
            'Long-range Comms',
            'Oxygen Tank',
            'Survey Kit',
            'Water Filter',
            'Locator',
            'Rebreather',
            'Binoculars',
            'Flashlight',
            'Camping Gear',
            'MRE (x7)'
        ],
        extermination: [
            'SMG',
            'Frag Grenade (x6)',
            'Standard Battle Dress',
            'Heads-up Display',
            'Body Cam',
            'Short-range Comms',
            'Stimpak (x6)',
            'Electronic Tool Set'
        ],
        examination: [
            'Scalpel',
            'Tranq Pistol',
            'Stun Baton',
            'Hazard Suit',
            'Medscanner',
            'Automed (x6)',
            'Pain Pills (x6)',
            'Stimpak (x6)',
            'Cybernetic Diagnostic Scanner'
        ]
    };
    loadoutName = '';
    name = '';
    rolledSaveNums = [0, 0];
    rolledSaveTotal = {
        sanity: 0,
        fear: 0,
        body: 0,
        armor: 0
    };
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
    savesPresetsExplain = {
        sanity: 'Rationalization, Logic',
        fear: 'Surprise, Loneliness',
        body: 'Hunger, Disease, Infection',
        armor: 'Physical Damage'
    };
    skillsArray = [];
    skillsPresets = {
        teamster : {
            base: ['zero-g', 'mechanical repair'],
            pickOne: ['heavy machinery', 'piloting'],
            thematics: ['scavenging', 'driving', 'rimwise', 'athletics'],
            skillPoints: 4
        },
        android: {
            base: ['linguistics', 'computers', 'mathematics'],
            thematics: ['military training', 'mechanical repair', 'biology'],
            skillPoints: 2
        },
        scientist: {
            pickTwo: ['biology', 'hydroponics',
                'geology', 'computers',
                'mathematics', 'chemistry'],
            thematics: ['linguistics', 'first aid', 'archaeology'],
            skillPoints: 3
        },
        marine: {
            base: ['military training'],
            thematics: ['first aid', 'driving', 'rimwise', 'athletics'],
            skillPoints: 3
        }
    };
    trinketPatch = [];
    objectKeys = Object.keys;

    constructor(private randomNumber: RandomNumberService) {}

    ngOnChanges() {
        this.startCharacterGen();
    }

    startCharacterGen() {
        this.generateName();
        this.rollStats();
        this.rollClass();
        this.assignSaves();
        this.assignSkills();
        this.getEquipment();
        this.charName.emit(`${this.name.toUpperCase()} THE ${this.class.toUpperCase()}`);
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
        this.skillsArray = [];

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
        // choose a random skill
        do {
            let filteredSkills;
            const randomBias = this.randomNumber.getRandomNumber(1, 4);
            if (this.bias && randomBias <= 2) {
                filteredSkills = SKILLS.filter(skill => {
                    return skill.cost <= points &&
                    (
                        this.skillsPresets[this.class].thematics &&
                        this.skillsPresets[this.class].thematics.includes(skill.title.toLowerCase())
                    ) && (!skillsToFind.includes(skill.title.toLowerCase()));
                });
            } else if (this.bias && randomBias >= 3 && points >= 2) {
                // try to take master skill
                filteredSkills = SKILLS.filter(skill => {
                    return skill.cost === 3 && points >= 3 &&
                        (skill.pre.some(item => skillsToFind.includes(item.toLowerCase())) || skill.pre.length === 0) &&
                        (!skillsToFind.includes(skill.title.toLowerCase()));
                });

                // otherwise take expert skill
                if (filteredSkills.length === 0) {
                    filteredSkills = SKILLS.filter(skill => {
                        return skill.cost === 2 && points >= 2 &&
                            (skill.pre.some(item => skillsToFind.includes(item.toLowerCase())) || skill.pre.length === 0) &&
                            (!skillsToFind.includes(skill.title.toLowerCase()));
                    });
                }
            } else if (!this.bias || (this.bias && randomBias >= 3)) {
                // pick any random skill where the point value is not larger than what we have and that we match the prerequisetes
                filteredSkills = SKILLS.filter(skill => {
                    return skill.cost <= points &&
                        (skill.pre.some(item => skillsToFind.includes(item.toLowerCase())) || skill.pre.length === 0) &&
                        (!skillsToFind.includes(skill.title.toLowerCase()));
                });
            }

            const skillToPush = filteredSkills[this.randomNumber.getRandomNumber(0, filteredSkills.length - 1)];
            skillsToFind.push(skillToPush.title.toLowerCase());
            points -= skillToPush.cost;
        } while (points > 0);

        skillsToFind.forEach(skill => {
            this.skillsArray.push(SKILLS.find(x => x.title.toLowerCase() === skill.toLowerCase()));
        });
    }

    changeName(newName: any) {
        this.name = newName.toUpperCase();
        this.charName.emit(`${newName.toUpperCase()} THE ${this.class.toUpperCase()}`);
    }

    getEquipment() {
        this.equipmentArray = [];
        this.trinketPatch = [];
        this.credits = 0;
        let chosenLoadout;
        const keys = Object.keys(this.equipmentPresets);

        if (this.bias) {
            if (this.class === 'marine') {
                chosenLoadout = 2; // extermination
            } else {
                const skillTitles = this.skillsArray.map(skill => skill.title.toLowerCase());
                if (skillTitles.includes('first aid') || skillTitles.includes('biology')) { // examination
                    chosenLoadout = 3;
                } else if (skillTitles.includes('scavenging') || skillTitles.includes('heavy machinery')) { // excavation
                    chosenLoadout = 0;
                } else if (skillTitles.includes('geology') || skillTitles.includes('archaeology')) { // exploration
                    chosenLoadout = 1;
                } else {
                    chosenLoadout = this.randomNumber.getRandomNumber(0, 3);
                }
            }
        } else {
            chosenLoadout = this.randomNumber.getRandomNumber(0, 3);
        }

        this.loadoutName = keys[chosenLoadout];
        this.equipmentArray = this.equipmentPresets[keys[chosenLoadout]].map(item => {
            return ITEMS.find(x => x.title.toLowerCase().trim() === item.toLowerCase());
        });

        for (let i = 0; i < 2; i++) {
            const trinketOrPatch = i % 2 ? false : true;
            this.trinketPatch.push(this.randomNumber.getTrinketOrPatch(0, 99, trinketOrPatch));
        }

        for (let i = 0; i < 5; i++) {
            this.credits += this.randomNumber.getRandomNumber(1, 10);
        }
        this.credits = this.credits * 10;
    }

    generateName() {
        this.name = '';
        const firstNameNum = this.randomNumber.getRandomNumber(0, 99);
        const lastNameNum = this.randomNumber.getRandomNumber(0, 99);
        this.name = `${FIRST_NAMES[firstNameNum]} ${LAST_NAMES[lastNameNum]}`.trim();
    }

    getSavesSubtext(save: string) {
        return this.savesPresetsExplain[save];
    }

    getStress() {
        return STRESS_PANIC.find(x => x.title === this.class);
    }

    rollClass() {
        if (this.bias) {
            if (
                this.statsArray.combat > this.statsArray.strength &&
                this.statsArray.combat > this.statsArray.speed &&
                this.statsArray.combat > this.statsArray.intellect
                ) {
                    this.class = 'marine';
                } else if (
                  this.statsArray.intellect > this.statsArray.strength &&
                  this.statsArray.intellect > this.statsArray.speed
                ) {
                    this.class = 'scientist';
                } else if (
                    this.statsArray.strength + this.statsArray.speed >
                    this.statsArray.speed + this.statsArray.intellect
                ) {
                    this.class = 'teamster';
                } else {
                    this.class = 'android';
                }
        } else {
            this.class = this.classArray[this.randomNumber.getRandomNumber(0, 3)];
        }

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

    rollSave(key: any) {
        this.objectKeys(this.rolledSaveTotal).forEach(objKey => this.rolledSaveTotal[objKey] = 0);
        this.rolledSaveNums = this.rolledSaveNums.map(() => {
            return this.randomNumber.getRandomNumber(0, 9);
        });
        this.rolledSaveTotal[key] = Number(`${this.rolledSaveNums[0]}${this.rolledSaveNums[1]}`);
    }
}
