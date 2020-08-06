import { Component, OnInit, ViewChild } from '@angular/core';
import { CharacterStats, CharSheet, StationAttributes } from './interfaces/mosh.interface';
import { RandomNumberService } from './services/randomNumber.service';
import { HttpClient } from '@angular/common/http';
import { GoogleSheetsService } from './services/googleSheets.service';

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
    station: false,
    debug: false,
  };
  genDerelict = false;
  genSpaceStation: StationAttributes;
  jsonToDownload: any;
  personButtonText = this.random.getRandomSaying(99, 1).text;
  previousSaying = [];
  randomSaying = [];
  trinketPatch = [];
  charSheet: CharSheet;
  wardenSubtext = this.random.getRandomSaying(99, 0).text;
  uploadedSheet: CharSheet;

  sheetsData = {};

  objectKeys = Object.keys;

  constructor(private random: RandomNumberService, private googleSheets: GoogleSheetsService) {}

  ngOnInit() {
    document.title = 'WARDEN OS ONLINE';

    this.googleSheets.getSheetsData().subscribe(response => {
      if (response) {
        const responseContent = response.feed.entry;
        responseContent.forEach((data, index, array) => {
          // const column = data.title.$t[0];
          this.sheetsData[data.title.$t] = data.content.$t;
        });
      }
    });
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
    this.genSpaceStation = {
      call_sign: '',
      celestial_body: '',
      common_problems: '',
      control_faction: '',
      core_leader: '',
      core_station: '',
      corespaceCrisis: false,
      crisis: '',
      goods: '',
      group: '',
      noteworthy_locations: '',
      resource: '',
      rim_landmarks: '',
      rim_station: '',
      rimspaceCrisis: false,
      rival_faction: '',
      rival_leader: '',
      station_name1: '',
      station_name2: '',
      structure: '',
    };

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
