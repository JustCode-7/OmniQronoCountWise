import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {StorageService} from '../../service/storage.service';

// Interface for the Screen Wake Lock API
interface WakeLockSentinel {
    released: boolean;

    release(): Promise<void>;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}

// Interface for the MediaSession API
interface MediaMetadataInit {
    title?: string;
    artist?: string;
    album?: string;
    artwork?: Array<{
        src: string;
        sizes?: string;
        type?: string;
    }>;
}

declare class MediaMetadata {
    constructor(init?: MediaMetadataInit);
    title: string;
    artist: string;
    album: string;
    artwork: Array<{
        src: string;
        sizes: string;
        type: string;
    }>;
}

@Component({
    selector: 'app-tabel-tennis-counter',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './tabel-tennis-counter.component.html',
    styleUrls: ['./tabel-tennis-counter.component.scss']
})
export class TabelTennisCounterComponent implements OnInit, OnDestroy {
    player1Score: number = 0;
    player2Score: number = 0;
    private wakeLock: WakeLockSentinel | null = null;
    private audioElement: HTMLAudioElement | null = null;

    constructor(private storageService: StorageService) {
    }

    ngOnInit(): void {
        this.loadScores();
        this.requestWakeLock();
        this.setupMediaSession();
    }

    private setupMediaSession(): void {
        if ('mediaSession' in navigator) {
            // Set metadata for the media session
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'Table Tennis Counter',
                artist: 'OmniQronoCountWise',
                album: 'Sports Counter'
            });

            // Set action handlers for play and pause
            navigator.mediaSession.setActionHandler('play', () => {
                console.log('Media play button pressed');
                this.incrementPlayer1Score();
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                console.log('Media pause button pressed');
                this.incrementPlayer2Score();
            });

            // Create a silent audio element to enable media session controls
            this.audioElement = document.createElement('audio');
            this.audioElement.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            this.audioElement.loop = true;
            this.audioElement.volume = 0.001; // Nearly silent
            this.audioElement.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        } else {
            console.log('MediaSession API not supported');
        }
    }

    ngOnDestroy(): void {
        this.saveScores();
        this.releaseWakeLock();

        // Clean up audio element
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
            this.audioElement = null;
        }

        // Clear media session handlers if supported
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
        }
    }

    private async requestWakeLock(): Promise<void> {
        try {
            // Check if the Screen Wake Lock API is supported
            if ('wakeLock' in navigator) {
                // Request a screen wake lock
                this.wakeLock = await (navigator as any).wakeLock.request('screen') as WakeLockSentinel;
                console.log('Wake Lock is active');

                // Add event listener for when the wake lock is released by the system
                this.wakeLock.addEventListener('release', () => {
                    console.log('Wake Lock released by system');
                    this.wakeLock = null;
                    // Try to re-acquire the wake lock
                    this.requestWakeLock();
                });
            } else {
                console.log('Wake Lock API not supported');
            }
        } catch (err) {
            console.error(`Error requesting wake lock: ${err}`);
        }
    }

    private async releaseWakeLock(): Promise<void> {
        if (this.wakeLock && !this.wakeLock.released) {
            try {
                await this.wakeLock.release();
                this.wakeLock = null;
                console.log('Wake Lock released');
            } catch (err) {
                console.error(`Error releasing wake lock: ${err}`);
            }
        }
    }

    incrementPlayer1Score(): void {
        this.player1Score++;
        this.saveScores();
    }

    incrementPlayer2Score(): void {
        this.player2Score++;
        this.saveScores();
    }

    resetScores(): void {
        this.player1Score = 0;
        this.player2Score = 0;
        this.saveScores();
    }

    private getCurrentDateString(): string {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    }

    private saveScores(): void {
        const dateKey = this.getCurrentDateString();
        this.storageService.setTableTennisScores(dateKey, {
            player1: this.player1Score,
            player2: this.player2Score
        });
    }

    private loadScores(): void {
        const dateKey = this.getCurrentDateString();
        const scores = this.storageService.getTableTennisScores(dateKey);

        if (scores) {
            this.player1Score = scores.player1;
            this.player2Score = scores.player2;
        }
    }
}
