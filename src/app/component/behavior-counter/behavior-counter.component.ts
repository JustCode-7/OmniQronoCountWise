import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {BehaviorCounterReset, StorageService} from '../../service/storage.service';
import {ResetHistoryDialogComponent} from './reset-history-dialog/reset-history-dialog.component';

@Component({
    selector: 'app-behavior-counter',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatDialogModule
    ],
    templateUrl: './behavior-counter.component.html',
    styleUrls: ['./behavior-counter.component.scss']
})
export class BehaviorCounterComponent implements OnInit, OnDestroy {
    counter: number = 0;
    resetHistory: BehaviorCounterReset[] = [];
    showResetHistory: boolean = false;
    lastIncrementTime: string | undefined = undefined;

    constructor(
        private storageService: StorageService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.loadCounterValue();
        this.loadResetHistory();
    }

    ngOnDestroy(): void {
        this.saveCounterValue();
    }

    incrementCounter(): void {
        this.counter = (this.counter + 1) % 100; // Keep it two digits
        this.lastIncrementTime = new Date().toLocaleTimeString();
        this.saveCounterValue();
        this.saveLastIncrementTime();
    }

    private saveLastIncrementTime(): void {
        const dateKey = this.getCurrentDateString();
        this.storageService.setBehaviorCounterLastIncrementTime(dateKey, this.lastIncrementTime);
    }

    resetCounter(currentHistory: BehaviorCounterReset[]): void {
        if (new Date().getDate() === new Date(currentHistory[0].timestamp).getDate()) {
            // Do not reset the counter if the current date is the same as the reset date
            return;
        }
        // Get the current reset history before showing the dialog
        const resetHistory = this.storageService.getLastThreeDaysResetHistory();

        // Show the dialog with the reset history
        const dialogRef = this.dialog.open(ResetHistoryDialogComponent, {
            data: {resetHistory}
        });

        // Handle the dialog result
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // User confirmed the reset
                const valueBeforeReset = this.counter;
                this.counter = 0;
                this.lastIncrementTime = undefined;

                const dateKey = this.getCurrentDateString();
                this.storageService.addBehaviorCounterReset(dateKey, valueBeforeReset);
                this.storageService.setBehaviorCounterLastIncrementTime(dateKey, undefined);
                this.saveCounterValue();

                // Reload reset history after adding a new reset
                this.loadResetHistory();
            }
        });
    }

    toggleResetHistory(): void {
        this.showResetHistory = !this.showResetHistory;
    }

    formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    private loadResetHistory(): void {
        this.resetHistory = this.storageService.getLastThreeDaysResetHistory();
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
        this.lastIncrementTime = this.storageService.getBehaviorCounterLastIncrementTime(dateKey);
    }
}
