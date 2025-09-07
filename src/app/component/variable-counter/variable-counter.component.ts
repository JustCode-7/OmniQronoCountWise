import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {StorageService} from '../../service/storage.service';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
    CounterCountersDialogComponent
} from "../behavior-counter/counter-counters-dialog/counter-counters-dialog.component";
import {MatLabel} from "@angular/material/input";

interface WakeLockSentinel {
    released: boolean;

    release(): Promise<void>;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}

@Component({
    selector: 'app-variable-counter',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatLabel],
    templateUrl: './variable-counter.component.html',
    styleUrls: ['./variable-counter.component.scss']
})
export class VariableCounterComponent implements OnInit, OnDestroy {

    counters: number[] = [];
    private wakeLock: WakeLockSentinel | null = null;
    private audioElement: HTMLAudioElement | null = null;
    private storageService: StorageService = inject(StorageService)
    private dialog: MatDialog = inject(MatDialog)


    ngOnInit(): void {
        this.askForCounterCount();
        this.requestWakeLock();
        this.setupMediaSession();
    }

    private askForCounterCount(): void {
        const dialogRef = this.dialog.open(CounterCountersDialogComponent);

        // Prefer value emitted by the component's Output
        const comp = dialogRef.componentInstance as CounterCountersDialogComponent | null;
        if (comp && (comp as any).counterValue) {
            (comp as any).counterValue.subscribe((val: string) => {
                const count = this.normalizeCount(val);
                dialogRef.close(count);
                this.loadCounters(count);
            });
        }

        // Fallback when dialog closes without emission (e.g., via ESC)
        dialogRef.afterClosed().subscribe((value: any) => {
            if (value != null) {
                const count = this.normalizeCount(value);
                this.loadCounters(count);
            } else {
                const fallback = this.getSavedOrDefaultCount();
                this.loadCounters(fallback);
            }
        });
    }

    private loadCounters(count: number): void {
        // Try load from storage by date
        const dateKey = this.getCurrentDateString();
        const saved = this.storageService.getVariableCounters(dateKey);
        if (saved && Array.isArray(saved)) {
            this.counters = [...saved].slice(0, count);
            if (this.counters.length < count) {
                this.counters = this.counters.concat(Array.from({length: count - this.counters.length}, () => 0));
            }
        } else {
            this.counters = Array.from({length: count}, () => 0);
        }
    }

    private setupMediaSession(): void {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'Variable Counter',
                artist: 'OmniQronoCountWise',
                album: 'Counters'
            });
            navigator.mediaSession.setActionHandler('play', () => this.increment(0));
            navigator.mediaSession.setActionHandler('pause', () => this.increment(1));
            this.audioElement = document.createElement('audio');
            this.audioElement.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            this.audioElement.loop = true;
            this.audioElement.volume = 0.001;
            this.audioElement.play().catch(() => {
            });
        }
    }

    ngOnDestroy(): void {
        this.saveCounters();
        this.releaseWakeLock();
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
            this.audioElement = null;
        }
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
        }
    }

    private async requestWakeLock(): Promise<void> {
        try {
            if ('wakeLock' in navigator) {
                this.wakeLock = await (navigator as any).wakeLock.request('screen') as WakeLockSentinel;
                this.wakeLock.addEventListener('release', () => {
                    this.wakeLock = null;
                    this.requestWakeLock();
                });
            }
        } catch {
        }
    }

    private async releaseWakeLock(): Promise<void> {
        if (this.wakeLock && !this.wakeLock.released) {
            try {
                await this.wakeLock.release();
                this.wakeLock = null;
            } catch {
            }
        }
    }

    increment(index: number): void {
        if (index >= 0 && index < this.counters.length) {
            this.counters[index]++;
            this.saveCounters();
        }
    }

    reset(): void {
        this.counters = this.counters.map(() => 0);
        this.saveCounters();
    }

    renew(): void {
        this.ngOnInit()
    }

    private getCurrentDateString(): string {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    }

    private saveCounters(): void {
        const dateKey = this.getCurrentDateString();
        this.storageService.setVariableCounters(dateKey, this.counters);
    }

    private normalizeCount(value: any): number {
        let count = typeof value === 'string' ? parseInt(value, 10) : Number(value);
        if (!Number.isFinite(count)) count = this.getSavedOrDefaultCount();
        if (count < 1) count = 1;
        if (count > 8) count = 8; // dialog currently restricts >=9
        return count;
    }

    private getSavedOrDefaultCount(): number {
        const saved = this.storageService.getVariableCounters(this.getCurrentDateString());
        return saved && Array.isArray(saved) && saved.length > 0 ? saved.length : 2;
    }
}
