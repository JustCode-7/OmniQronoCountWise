import {Component, Input} from '@angular/core';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-timer-progress-view',
    templateUrl: './timer-progress-view.component.html',
    standalone: true,
    imports: [
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatCardModule,
        NgIf,
    ]
})
export class TimerProgressViewComponent {

    @Input() progressSpinnerValue!: number;
    @Input() feierabendDateString!: string;
    @Input() progressSpinnerColor: "primary" | "accent" | "warn" | undefined;
    @Input() progressSpinnerMode!: "determinate" | "indeterminate";
    @Input() remaining!: string;
    protected readonly Number = Number;
}
