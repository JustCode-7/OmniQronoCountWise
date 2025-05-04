import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-behavior-counter',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './behavior-counter.component.html',
    styleUrls: ['./behavior-counter.component.scss']
})
export class BehaviorCounterComponent implements OnInit, OnDestroy {
    counter: number = 0;
    private readonly storageKey: string = 'behavior-counter-';

    ngOnInit(): void {
        this.loadCounterValue();
    }

    ngOnDestroy(): void {
        this.saveCounterValue();
    }

    incrementCounter(): void {
        this.counter = (this.counter + 1) % 100; // Keep it two digits
    }

    resetCounter(): void {
        this.counter = 0;
        this.saveCounterValue();
    }

    private getCurrentDateString(): string {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    }

    private saveCounterValue(): void {
        const dateKey = this.getCurrentDateString();
        localStorage.setItem(this.storageKey + dateKey, this.counter.toString());
    }

    private loadCounterValue(): void {
        const dateKey = this.getCurrentDateString();
        const savedValue = localStorage.getItem(this.storageKey + dateKey);

        if (savedValue !== null) {
            this.counter = parseInt(savedValue, 10);
        }
    }
}
