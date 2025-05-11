import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {StorageService} from '../../service/storage.service';

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
    private readonly storageKey: string = 'table-tennis-counter-';

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        this.loadScores();
    }

    ngOnDestroy(): void {
        this.saveScores();
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
