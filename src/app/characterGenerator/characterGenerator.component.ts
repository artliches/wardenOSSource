import { Component, OnChanges, Input } from '@angular/core';
import { RandomNumberService } from '../services/randomNumber.service';
import { CharacterStats, CharacterSaves } from '../interfaces/mosh.interface';
import { FIRST_NAMES, LAST_NAMES, SKILLS, ITEMS, STRESS_PANIC } from '../services/randomTables.constants';

@Component({
    selector: 'app-character-generator',
    templateUrl: './characterGenerator.component.html',
    styleUrls: ['./characterGenerator.component.scss']
})

export class CharacterGeneratorComponent implements OnChanges {
    @Input() statsArray: CharacterStats;

    classArray = [
        'teamster',
        'android',
        'scientist',
        'marine'
    ];
    class = '';
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

        // point buy
        do {
            // pick any random skill where the point value is not larger than what we have and that we match the prerequisetes
            const filteredSkills = SKILLS.filter(skill => {
                return skill.cost <= points &&
                    (skill.pre.some(item => skillsToFind.includes(item.toLowerCase())) || skill.pre.length === 0) &&
                    (!skillsToFind.includes(skill.title.toLowerCase()));
            });
            const skillToPush = filteredSkills[this.randomNumber.getRandomNumber(0, filteredSkills.length - 1)];
            skillsToFind.push(skillToPush.title.toLowerCase());
            points -= skillToPush.cost;
        } while (points > 0);

        skillsToFind.forEach(skill => {
            this.skillsArray.push(SKILLS.find(x => x.title.toLowerCase() === skill.toLowerCase()));
        });
    }

    getEquipment() {
        this.equipmentArray = [];
        this.trinketPatch = [];

        const keys = Object.keys(this.equipmentPresets);
        const chosenLoadout = this.randomNumber.getRandomNumber(0, 3);
        this.loadoutName = keys[chosenLoadout];

        this.equipmentArray = this.equipmentPresets[keys[chosenLoadout]].map(item => {
            return ITEMS.find(x => x.title.toLowerCase().trim() === item.toLowerCase());
        });

        for (let i = 0; i < 2; i++) {
            const trinketOrPatch = i % 2 ? false : true;
            this.trinketPatch.push(this.randomNumber.getTrinketOrPatch(0, 99, trinketOrPatch));
        }
    }

    generateName() {
        this.name = '';
        const firstNameNum = this.randomNumber.getRandomNumber(0, 99);
        const lastNameNum = this.randomNumber.getRandomNumber(0, 99);
        this.name = `${FIRST_NAMES[firstNameNum]} ${LAST_NAMES[lastNameNum]}`;
    }

    getStress() {
        return STRESS_PANIC.find(x => x.title === this.class);
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
