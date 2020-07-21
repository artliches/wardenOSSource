import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CharacterStats, CharSheet } from './interfaces/mosh.interface';
import { RandomNumberService } from './services/randomNumber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('fileUploadInput', {static: false}) inputRef;

  bias = false;
  pagePrintTitle = '';
  coreOrRim: boolean;
  defaultStatArray: CharacterStats;
  derelictButtonText = this.random.getRandomSaying(99, 2).text;
  flags = {
    crew: false,
    derelict: false,
    download: false,
    print: false,
    trinket: false,
    station: false
  };
  genDerelict = false;
  genSpaceStation = [];
  jsonToDownload: any;
  personButtonText = this.random.getRandomSaying(99, 1).text;
  previousSaying = [];
  randomSaying = [];
  trinketPatch = [];
  charSheet: CharSheet;
  wardenSubtext = this.random.getRandomSaying(99, 0).text;
  uploadedSheet: CharSheet;

  objectKeys = Object.keys;

  constructor(private random: RandomNumberService) {}

  ngOnInit() {
    document.title = 'WARDEN OS ONLINE';
  }

  uploadFile(event: any) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(selectedFile, 'UTF-8');
    fileReader.onload = () => {
     this.uploadedSheet = JSON.parse(fileReader.result.toString());
     this.flipFlags('crew');
     this.generateRandomCrewMember(false, false);
     this.reset();
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };
  }

  reset() {
    this.inputRef.nativeElement.value = '';
  }

  download() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.jsonToDownload));
    const dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `${this.pagePrintTitle}.json`);
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

  generateRandomCrewMember(bias: boolean, isRandom: boolean) {
    if (isRandom) {
      this.uploadedSheet = this.defaultCharSheet();
    }
    this.charSheet = this.defaultCharSheet();
    this.bias = bias;
    this.flags.print = true;
    this.flags.download = true;
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

  passJsonToDownload(json: any) {
    this.jsonToDownload = json;
  }

  passPagePrintTitle(name: string) {
    this.pagePrintTitle = name;
    document.title = `MOTHERSHIP_${this.pagePrintTitle}`;
  }

  print() {
    window.print();
  }

  private defaultCharSheet(): CharSheet {
    return  {
      name: '',
      class: '',
      statsArray: {
        stress: 2,
        resolve: 0,
        max_Health: 0,
        strength: 0,
        speed: 0,
        intellect: 0,
        combat: 0
      },
      currMods: {
        stress: 2,
        resolve: 0,
        max_Health: 0,
        strength: 0,
        speed: 0,
        intellect: 0,
        combat: 0,
        sanity: 0,
        fear: 0,
        body: 0,
        armor: 0,
      },
      savesArray: {
        sanity: 0,
        fear: 0,
        body: 0,
        armor: 0,
      },
      skillsArray: [],
      equipmentArray: [],
      loadoutName: '',
      credits: 0,
      trinket: {
        num: 100,
        descrip: ''
      },
      patch: {
        num: 100,
        descrip: ''
      },
      notes: '',
    };
  }
 }
