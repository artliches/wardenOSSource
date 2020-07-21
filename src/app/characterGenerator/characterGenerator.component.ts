import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { RandomNumberService } from '../services/randomNumber.service';
import { CharSheet, CharacterTrinketPatch } from '../interfaces/mosh.interface';
import { FIRST_NAMES, LAST_NAMES, SKILLS, ITEMS, STRESS_PANIC } from '../services/randomTables.constants';

@Component({
    selector: 'app-character-generator',
    templateUrl: './characterGenerator.component.html',
    styleUrls: ['./characterGenerator.component.scss']
})

export class CharacterGeneratorComponent implements OnChanges {
    // tslint:disable: no-string-literal

    @Input() bias: boolean;
    @Input() charSheet: CharSheet;
    @Input() uploadedSheet: CharSheet;
    @Output() charName = new EventEmitter<string>();
    @Output() jsonToDownload = new EventEmitter<any>();

    classArray = [
        'teamster',
        'android',
        'scientist',
        'marine'
    ];
    class = '';
    currStats = {
        max_Health: 0,
        stress: 0,
        resolve: 0,
    };
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
    jsonObj = {};
    loadoutName = '';
    name = '';
    notes = '';
    rolledCheckTotal = {
        strength: null,
        speed: null,
        intellect: null,
        combat: null
    };
    rolledCheckNums = [0, 0];
    rolledSaveNums = [0, 0];
    rolledSaveTotal = {
        sanity: null,
        fear: null,
        body: null,
        armor: null
    };
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
    statMod = {
        strength: 0,
        speed: 0,
        intellect: 0,
        combat: 0,
        sanity: 0,
        fear: 0,
        body: 0,
        armor: 0,
    };
    trinketPatch = [];
    trinket = {};
    patch = {};
    objectKeys = Object.keys;

    constructor(private randomNumber: RandomNumberService) {}

    ngOnChanges() {
        this.startCharacterGen();
    }

    saveModChanges(newVal: number, key: any) {
        this.jsonObj[key] = newVal;
    }

    startCharacterGen() {
        if (this.uploadedSheet.name !== '') {
            // display existing char
            this.charSheet = this.uploadedSheet;
        } else {
            // create new char
            this.generateName();
            this.rollStats();
            this.rollClass();
            this.assignSaves();
            this.assignSkills();
            this.getEquipment(false);
            this.getTrinketPatch();
        }
        this.charName.emit(`${this.charSheet.name.toUpperCase()} THE ${this.charSheet.class.toUpperCase()}`);
        this.charSheet.currMods.max_Health = this.charSheet.statsArray.max_Health;
        this.currStats.stress = this.charSheet.statsArray.stress;
        this.currStats.resolve = this.charSheet.statsArray.resolve;

        this.createJsonToDownload();
    }

    assignSaves() {
        this.charSheet.savesArray = this.savesPresets[this.charSheet.class];
    }

    assignSkills() {
        const baseSkills = this.skillsPresets[this.charSheet.class].base;
        const pickOne = this.skillsPresets[this.charSheet.class].pickOne;
        const pickTwo = this.skillsPresets[this.charSheet.class].pickTwo;
        let points = this.skillsPresets[this.charSheet.class].skillPoints;
        const skillsToFind = [];
        let pickTwoCounter = 0;
        this.charSheet.skillsArray = [];

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
                        this.skillsPresets[this.charSheet.class].thematics &&
                        this.skillsPresets[this.charSheet.class].thematics.includes(skill.title.toLowerCase())
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
            this.charSheet.skillsArray.push(SKILLS.find(x => x.title.toLowerCase() === skill.toLowerCase()));
        });
    }

    changeCredits(newCredits: number) {
        this.charSheet.credits = newCredits;
        this.jsonObj['credits'] = this.charSheet.credits;
    }

    changeName(newName: string) {
        this.charSheet.name = newName.toUpperCase();
        const title = `${this.charSheet.name} THE ${this.charSheet.class.toUpperCase()}`;

        this.jsonObj['name'] = this.charSheet.name;
        this.charName.emit(title);
    }

    changeNotes(newNote: string) {
        this.charSheet.notes = newNote;
        this.jsonObj['notes'] = this.charSheet.notes;
    }

    createJsonToDownload() {
        this.jsonObj = {
            name: `${this.charSheet.name.trim()}`,
            class: `${this.charSheet.class.toUpperCase()}`,
            statsArray: this.charSheet.statsArray,
            savesArray: this.charSheet.savesArray,
            skillsArray: this.charSheet.skillsArray,
            equipmentArray: this.charSheet.equipmentArray,
            credits: this.charSheet.credits,
            trinket: this.charSheet.trinket,
            patch: this.charSheet.patch,
            notes: this.charSheet.notes,
            currMods: this.charSheet.currMods,
            loadoutName: this.charSheet.loadoutName,
        };

        this.jsonToDownload.emit(this.jsonObj);
    }

    getEquipment(chooseNew: boolean) {
        this.charSheet.equipmentArray = [];
        this.trinketPatch = [];
        this.charSheet.credits = 0;
        let chosenLoadout;
        const keys = Object.keys(this.equipmentPresets);

        if (this.bias && !chooseNew) {
            if (this.charSheet.class === 'marine') {
                chosenLoadout = 2; // extermination
            } else {
                const skillTitles = this.charSheet.skillsArray.map(skill => skill.title.toLowerCase());
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
            if (chooseNew) {
                const prevLoadout = this.loadoutName;
                do {
                    chosenLoadout = this.randomNumber.getRandomNumber(0, 3);
                } while (prevLoadout === keys[chosenLoadout]);
            } else {
                chosenLoadout = this.randomNumber.getRandomNumber(0, 3);
            }
        }

        this.charSheet.loadoutName = keys[chosenLoadout];
        this.charSheet.equipmentArray = this.equipmentPresets[keys[chosenLoadout]].map(item => {
            return ITEMS.find(x => x.title.toLowerCase().trim() === item.toLowerCase());
        });

        for (let i = 0; i < 5; i++) {
            this.charSheet.credits += this.randomNumber.getRandomNumber(1, 10);
        }
        this.charSheet.credits = this.charSheet.credits * 10;

        if (chooseNew) {
            this.jsonObj['loadoutName'] = this.charSheet.loadoutName;
            this.jsonObj['equipmentArray'] = this.charSheet.equipmentArray;
            this.jsonObj['credits'] = this.charSheet.credits;
        }
    }

    getTrinketPatch(reroll?: boolean, trinketOrPatch?: number) {
        if (reroll) {
            let tempTrinketPatch: CharacterTrinketPatch;
            if (trinketOrPatch === 0) {
                tempTrinketPatch = this.randomNumber.getTrinketOrPatch(0, 99, true);
                if (tempTrinketPatch['num'] === this.charSheet.trinket['num']) {
                    this.getTrinketPatch(true, 0);
                } else {
                    this.charSheet.trinket = tempTrinketPatch;
                }
            } else {
                tempTrinketPatch = this.randomNumber.getTrinketOrPatch(0, 99, false);
                if (tempTrinketPatch['num'] === this.charSheet.patch['num']) {
                    this.getTrinketPatch(true, 1);
                } else {
                    this.charSheet.patch = this.randomNumber.getTrinketOrPatch(0, 99, false);
                }
            }
        } else {
            this.charSheet.trinket = this.randomNumber.getTrinketOrPatch(0, 99, true);
            this.charSheet.patch = this.randomNumber.getTrinketOrPatch(0, 99, false);
        }
        this.jsonObj['trinket'] = this.charSheet.trinket;
        this.jsonObj['patch'] = this.charSheet.patch;
    }

    generateName() {
        this.charSheet.name = '';
        const firstNameNum = this.randomNumber.getRandomNumber(0, 99);
        const lastNameNum = this.randomNumber.getRandomNumber(0, 99);
        this.charSheet.name = `${FIRST_NAMES[firstNameNum]} ${LAST_NAMES[lastNameNum]}`.trim();
    }

    getSavesSubtext(save: string) {
        return this.savesPresetsExplain[save];
    }

    getStress() {

        return STRESS_PANIC.find(x => x.title.toLowerCase() === this.charSheet.class.toLowerCase());
    }

    rollClass() {
        if (this.bias) {
            if (
                this.charSheet.statsArray.combat > this.charSheet.statsArray.strength &&
                this.charSheet.statsArray.combat > this.charSheet.statsArray.speed &&
                this.charSheet.statsArray.combat > this.charSheet.statsArray.intellect
                ) {
                    this.charSheet.class = 'marine';
                } else if (
                  this.charSheet.statsArray.intellect > this.charSheet.statsArray.strength &&
                  this.charSheet.statsArray.intellect > this.charSheet.statsArray.speed
                ) {
                    this.charSheet.class = 'scientist';
                } else if (
                    this.charSheet.statsArray.strength + this.charSheet.statsArray.speed >
                    this.charSheet.statsArray.speed + this.charSheet.statsArray.intellect
                ) {
                    this.charSheet.class = 'teamster';
                } else {
                    this.charSheet.class = 'android';
                }
        } else {
            this.charSheet.class = this.classArray[this.randomNumber.getRandomNumber(0, 3)];
        }

        switch (this.charSheet.class) {
            case 'teamster': {
                this.charSheet.statsArray.strength += 5;
                this.charSheet.statsArray.speed += 5;
                break;
            }
            case 'android' : {
                this.charSheet.statsArray.speed += 5;
                this.charSheet.statsArray.intellect += 5;
                break;
            }
            case 'scientist' : {
                this.charSheet.statsArray.intellect += 10;
                break;
            }
            case 'marine' : {
                this.charSheet.statsArray.combat += 5;
                break;
            }
        }

        this.charSheet.statsArray.max_Health = this.charSheet.statsArray.strength * 2;
    }

    rollStats() {
        for (let i = 0; i < 6; i++) {
            this.charSheet.statsArray.strength += this.randomNumber.getRandomNumber(1, 10);
            this.charSheet.statsArray.speed += this.randomNumber.getRandomNumber(1, 10);
            this.charSheet.statsArray.intellect += this.randomNumber.getRandomNumber(1, 10);
            this.charSheet.statsArray.combat += this.randomNumber.getRandomNumber(1, 10);
        }
    }

    rollCheckOrSave(key: any, isCheck: boolean) {
        if (isCheck) {
            this.objectKeys(this.rolledCheckTotal).forEach(objKey => this.rolledCheckTotal[objKey] = null);
            this.rolledCheckNums = this.rolledCheckNums.map(() => {
                return this.randomNumber.getRandomNumber(0, 9);
            });
            this.rolledCheckTotal[key] = Number(`${this.rolledCheckNums[0]}${this.rolledCheckNums[1]}`);
        } else {
            this.objectKeys(this.rolledSaveTotal).forEach(objKey => this.rolledSaveTotal[objKey] = null);
            this.rolledSaveNums = this.rolledSaveNums.map(() => {
                return this.randomNumber.getRandomNumber(0, 9);
            });
            this.rolledSaveTotal[key] = Number(`${this.rolledSaveNums[0]}${this.rolledSaveNums[1]}`);
        }
    }

    growWidth(event: any) {
        event.target.style.width = '0px';
        event.target.style.width = (event.target.scrollWidth + 20) + 'px';
    }

    growTextarea(event: any) {
        event.target.style.height = '0px';
        event.target.style.height = (event.target.scrollHeight + 5) + 'px';

        this.jsonObj['notes'] = this.charSheet.notes;
    }
}
