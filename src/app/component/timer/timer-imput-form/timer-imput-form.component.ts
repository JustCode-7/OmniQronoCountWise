import {Component} from '@angular/core';
import {TimerService} from "../../../service/timer.service";
import {timer} from "rxjs";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatInputModule} from "@angular/material/input";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'app-timer-imput-form',
    templateUrl: './timer-imput-form.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgIf,
        NgForOf,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatInputModule,
        NgStyle,
        MatBadgeModule,
        MatButtonModule
    ]
})
export class TimerImputFormComponent {


    protected readonly timer = timer;

    constructor(public timerserivce: TimerService) {
    }
}
