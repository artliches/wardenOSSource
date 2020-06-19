import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-trinket-patch-display',
    templateUrl: './trinketPatchDisplay.component.html',
    styleUrls: ['./trinketPatchDisplay.component.scss']
})

export class TrinketPatchDisplayComponent {
    @Input() trinketPatch: any;

    objectKeys = Object.keys;
}
