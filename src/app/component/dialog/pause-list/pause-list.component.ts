import {Component} from '@angular/core';
import {TimerService} from "../../../service/timer.service";
import {MatDialogModule} from "@angular/material/dialog";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-pause-list',
    templateUrl: './pause-list.component.html',
    standalone: true,
    imports: [MatDialogModule, NgIf, NgForOf]
})
export class PauseListComponent {

    constructor(public timerservice: TimerService) {
    }

}
