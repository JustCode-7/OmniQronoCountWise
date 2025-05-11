import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {StorageService} from '../../service/storage.service';

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

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        this.loadCounterValue();
    }

    ngOnDestroy(): void {
        this.saveCounterValue();
    }

    incrementCounter(): void {
        this.counter = (this.counter + 1) % 100; // Keep it two digits
        this.saveCounterValue();
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
        this.storageService.setBehaviorCounter(dateKey, this.counter);
    }

    private loadCounterValue(): void {
        const dateKey = this.getCurrentDateString();
        this.counter = this.storageService.getBehaviorCounter(dateKey);
    }
}
