import {Component, OnInit} from '@angular/core';
import {TimerService} from "../../service/timer.service";
import {TimerProgressViewComponent} from "./timer-progress-view/timer-progress-view.component";
import {TimerImputFormComponent} from "./timer-imput-form/timer-imput-form.component";
import {NgIf, NgStyle} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    standalone: true,
    imports: [
        TimerProgressViewComponent,
        MatButtonModule,
        TimerImputFormComponent,
        NgIf,
        MatInputModule,
        NgStyle
    ]
})
export class TimerComponent implements OnInit {


    constructor(public timerservice: TimerService) {
    }

    ngOnInit(): void {
        this.timerservice.initForm();
        this.timerservice.setInitialTimeValues();
        this.timerservice.pauseActive = false;
        Notification.requestPermission();
    }


}
