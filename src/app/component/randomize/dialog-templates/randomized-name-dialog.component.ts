import {Component, inject} from '@angular/core';
import {MatDialogModule} from "@angular/material/dialog";
import {NgForOf} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import {RandomServiceService} from "../services/random-service.service";

@Component({
    selector: 'app-randomized-name-dialog',
    standalone: true,
    template: `
        <h3 mat-dialog-title>randomized:</h3>
        <div mat-dialog-content *ngFor="let item of namelist">
            <h1 style="color:yellow;"> {{ item }}</h1>
        </div>
    `,
    imports: [
        MatDialogModule,
        NgForOf
    ],
    styles: []
})
export class RandomizedNameDialogComponent {

    namelist = new BehaviorSubject(inject(RandomServiceService)._randomizedNames).value.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));


}
