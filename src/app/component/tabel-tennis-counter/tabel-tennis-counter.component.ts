import {AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class TabelTennisCounterComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('dummyAudio') dummyAudio!: ElementRef<HTMLAudioElement>;

    player1Score: number = 0;
    player2Score: number = 0;
    private wakeLock: WakeLockSentinel | null = null;
    private storageService: StorageService = inject(StorageService)

    ngOnInit(): void {
        this.loadScores();
        this.requestWakeLock();
    }

    ngAfterViewInit(): void {
        this.setupMediaSession();
    }

    ngOnDestroy(): void {
        this.saveScores();
        this.releaseWakeLock();
        this.cleanupMediaSession();
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

    incrementPlayer1Score() {
        this.player1Score++;
        this.saveScores();
    }

    incrementPlayer2Score() {
        this.player2Score++;
        this.saveScores();
    }

    incrementPlayer1ScoreWithPlay() {
        // Play the audio to trigger the MediaSession play event
        if (this.dummyAudio && this.dummyAudio.nativeElement) {
            const audioElement = this.dummyAudio.nativeElement;
            audioElement.play().then(() => {
                console.log('Audio played, MediaSession play event should be triggered');
            }).catch(error => {
                console.error('Error playing audio:', error);
                // Fallback if play fails (e.g., user interaction required)
                this.incrementPlayer1Score();
            });
        }
    }

    incrementPlayer2ScoreWithPause() {
        if (this.dummyAudio && this.dummyAudio.nativeElement) {
            const audioElement = this.dummyAudio.nativeElement;
            if (!audioElement.paused) {
                audioElement.pause();
                console.log('Audio paused, MediaSession pause event should be triggered');
            } else {
                // If already paused, try to play first and then pause
                audioElement.play().then(() => {
                    audioElement.pause();
                    console.log('Audio played and paused, MediaSession pause event should be triggered');
                }).catch(error => {
                    console.error('Error playing audio before pause:', error);
                    // Fallback if play fails
                    this.incrementPlayer2Score();
                });
            }
        }
    }

    private setupMediaSession(): void {
        if ('mediaSession' in navigator) {
            // Set a silent audio file for the dummy audio element
            this.dummyAudio.nativeElement.load();

            // Set metadata for the media session
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'Table Tennis Counter',
                artist: 'OmniQronoCountWise',
                album: 'Sports Counter'
            });

            // Set action handlers for play and pause
            navigator.mediaSession.setActionHandler('play', () => {
                this.incrementPlayer1ScoreWithPlay();
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                this.incrementPlayer2ScoreWithPause();
            });

            console.log('MediaSession handlers set up');
        } else {
            console.log('MediaSession API not supported');
        }
    }

    private cleanupMediaSession(): void {
        if ('mediaSession' in navigator) {
            // Remove action handlers
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            console.log('MediaSession handlers cleaned up');
        }
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
