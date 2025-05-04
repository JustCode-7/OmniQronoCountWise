import {Component, Input, OnInit} from '@angular/core';
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
export class TimerProgressViewComponent implements OnInit {

    @Input() progressSpinnerValue!: number;
    @Input() feierabendDateString!: string;
    @Input() progressSpinnerColor: "primary" | "accent" | "warn" | undefined;
    @Input() progressSpinnerMode!: "determinate" | "indeterminate";
    @Input() remaining!: string;
    protected readonly Number = Number;
    private windowWidth: number = 0;

    ngOnInit(): void {
        this.updateWindowWidth();
        window.addEventListener('resize', () => this.updateWindowWidth());
    }

    private updateWindowWidth(): void {
        this.windowWidth = window.innerWidth;
    }

    getSpinnerDiameter(): number {
        if (this.windowWidth < 480) {
            return 100; // Small screens
        } else if (this.windowWidth < 768) {
            return 120; // Medium screens
        } else if (this.windowWidth < 992) {
            return 150; // Large screens
        } else {
            return 180; // Extra large screens
        }
    }
}
