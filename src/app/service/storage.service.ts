import {Injectable} from '@angular/core';

// Theme interfaces
export interface Theme {
    name: string;
    cssFile: string;
}

// Timer interfaces
export interface TimerData {
    startTime: string;
    workTime: string;
    pause: string;
    pauseList: string[];
    lastUpdated?: string; // Date when the pauseList was last updated
}

// QR Code interfaces
export interface QrCodeData {
    latestScans: string[];
}

// Table Tennis Counter interfaces
export interface TableTennisScores {
    player1: number;
    player2: number;
}

// Behavior Counter interfaces
export interface BehaviorCounterReset {
    value: number;
    timestamp: string;
}

export interface BehaviorCounterData {
    counter: number;
    resetHistory?: BehaviorCounterReset[];
    lastIncrementTime?: string;
    lastIncrementTimeHistory?: string[]
}

// App Data interface
export interface AppData {
    theme: Theme;
    timer: TimerData;
    qrCode: QrCodeData;
    tableTennisScores: Record<string, TableTennisScores>;
    behaviorCounter: Record<string, BehaviorCounterData>;
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly STORAGE_KEY = 'app_data';
    private appData: AppData;
    LAST_INCREMENT_TIME_DEFAULT = "--:--:--";

    constructor() {
        this.appData = this.loadData();
    }

    // Load all data from localStorage
    private loadData(): AppData {
        const storedData = localStorage.getItem(this.STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }

        // Initialize with default empty structure
        return {
            theme: {name: 'Purple-Green', cssFile: 'purple-green.css'},
            timer: {
                startTime: '09:30',
                workTime: '07:48',
                pause: '00:30',
                pauseList: [],
                lastUpdated: new Date().toISOString().split('T')[0] // Initialize with today's date
            },
            qrCode: {
                latestScans: []
            },
            tableTennisScores: {},
            behaviorCounter: {}
        };
    }

    // Save all data to localStorage
    private saveData(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.appData));
    }

    // Theme methods
    getTheme(): Theme {
        return this.appData.theme;
    }

    setTheme(theme: Theme): void {
        this.appData.theme = theme;
        this.saveData();
    }

    // Timer methods
    getTimerData(): TimerData {
        return this.appData.timer;
    }

    setTimerStartTime(startTime: string): void {
        this.appData.timer.startTime = startTime;
        this.saveData();
    }

    setTimerWorkTime(workTime: string): void {
        this.appData.timer.workTime = workTime;
        this.saveData();
    }

    setTimerPause(pause: string): void {
        this.appData.timer.pause = pause;
        this.saveData();
    }

    setTimerPauseList(pauseList: string[]): void {
        this.appData.timer.pauseList = pauseList;
        this.appData.timer.lastUpdated = new Date().toISOString().split('T')[0]; // Store just the date part (YYYY-MM-DD)
        this.saveData();
    }

    // Check if the pauseList is from a different day (but no longer automatically clears it)
    checkAndClearTimerPauseListIfNeeded(): boolean {
        const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
        const lastUpdated = this.appData.timer.lastUpdated;

        // Update lastUpdated to today's date if it's different
        if (!lastUpdated || lastUpdated !== today) {
            console.log('Data model from a different day detected, but not clearing it as per requirements');
            this.appData.timer.lastUpdated = today;
            this.saveData();
            return false; // Indicate that the list was not cleared
        }

        return false; // Indicate that the list was not cleared
    }

    // QR Code methods
    getQrCodeLatestScans(): string[] {
        return this.appData.qrCode.latestScans;
    }

    setQrCodeLatestScans(latestScans: string[]): void {
        this.appData.qrCode.latestScans = latestScans;
        this.saveData();
    }

    clearQrCodeScans(): void {
        this.appData.qrCode.latestScans = [];
        this.saveData();
    }

    // Table Tennis Counter methods
    getTableTennisScores(date: string): TableTennisScores {
        return this.appData.tableTennisScores[date] || {player1: 0, player2: 0};
    }

    setTableTennisScores(date: string, scores: TableTennisScores): void {
        this.appData.tableTennisScores[date] = scores;
        this.saveData();
    }

    // Behavior Counter methods
    getBehaviorCounter(date: string, yesterday: string): BehaviorCounterData {
        return this.appData.behaviorCounter[date] ? this.appData.behaviorCounter[date] : (this.appData.behaviorCounter[yesterday] || {
            counter: 0,
            resetHistory: [],
            lastIncrementTime: this.LAST_INCREMENT_TIME_DEFAULT,
            lastIncrementTimeHistory: []
        })
    }

    setBehaviorCounter(date: string, counter: number): void {
        if (!this.appData.behaviorCounter[date]) {
            this.appData.behaviorCounter[date] = {counter, resetHistory: [], lastIncrementTimeHistory: []};
        } else {
            this.appData.behaviorCounter[date].counter = counter;
            if (!this.appData.behaviorCounter[date].resetHistory) {
                this.appData.behaviorCounter[date].resetHistory = [];
            }
            if (!this.appData.behaviorCounter[date].lastIncrementTimeHistory) {
                this.appData.behaviorCounter[date].lastIncrementTimeHistory = [];
            }
        }
        this.saveData();
    }

    setBehaviorCounterLastIncrementTime(date: string, time: string): void {
        if (!this.appData.behaviorCounter[date]) {
            this.appData.behaviorCounter[date] = {
                counter: 0,
                resetHistory: [],
                lastIncrementTime: time,
                lastIncrementTimeHistory: []
            };
        } else {
            this.appData.behaviorCounter[date].lastIncrementTime = time;
            if (this.LAST_INCREMENT_TIME_DEFAULT !== time) {
                this.appData.behaviorCounter[date].lastIncrementTimeHistory?.push(time)
            }
        }
        this.saveData();
    }

    addBehaviorCounterReset(date: string, valueBeforeReset: number): void {
        if (!this.appData.behaviorCounter[date]) {
            this.appData.behaviorCounter[date] = {counter: 0, resetHistory: []};
        }

        if (!this.appData.behaviorCounter[date].resetHistory) {
            this.appData.behaviorCounter[date].resetHistory = [];
        }

        const timestamp = new Date().toISOString();
        this.appData.behaviorCounter[date].resetHistory!.push({
            value: valueBeforeReset,
            timestamp
        });

        this.saveData();
    }

    getBehaviorCounterResetHistory(date: string): BehaviorCounterReset[] {
        return this.appData.behaviorCounter[date]?.resetHistory || [];
    }

    getLastThreeDaysResetHistory(): BehaviorCounterReset[] {
        const result: BehaviorCounterReset[] = [];
        const today = new Date();

        // Get data for today and the last 2 days
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            const dayResets = this.getBehaviorCounterResetHistory(dateKey);
            result.push(...dayResets);
        }

        // Sort by timestamp, most recent first
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Return only the last 3 entries
        return result.slice(0, 3);
    }

    // Clear all data from localStorage and reset to defaults
    clearCache(): void {
        localStorage.clear();
        this.appData = this.loadData();
        this.saveData();
    }

    // Migration method to move data from individual localStorage items to the centralized storage
    migrateData(): void {
        // Migrate theme data
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            this.appData.theme = JSON.parse(savedTheme);
        }

        // Migrate timer data
        const startTime = localStorage.getItem('startTime');
        if (startTime) {
            this.appData.timer.startTime = JSON.parse(startTime);
        }

        const workTime = localStorage.getItem('workTime');
        if (workTime) {
            this.appData.timer.workTime = JSON.parse(workTime);
        }

        const pause = localStorage.getItem('Pause');
        if (pause) {
            this.appData.timer.pause = JSON.parse(pause);
        }

        // Find and migrate pause lists
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('pause-list')) {
                const pauseList = localStorage.getItem(key);
                if (pauseList) {
                    this.appData.timer.pauseList = JSON.parse(pauseList);
                    // Set lastUpdated to today's date
                    this.appData.timer.lastUpdated = new Date().toISOString().split('T')[0];
                }
            }
        }

        // Migrate QR code data
        const qrList = localStorage.getItem('list');
        if (qrList) {
            this.appData.qrCode.latestScans = JSON.parse(qrList);
        }

        // Migrate table tennis scores and behavior counter
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                if (key.startsWith('table-tennis-counter-')) {
                    const date = key.replace('table-tennis-counter-', '');
                    const scores = localStorage.getItem(key);
                    if (scores) {
                        this.appData.tableTennisScores[date] = JSON.parse(scores);
                    }
                } else if (key.startsWith('behavior-counter-')) {
                    const date = key.replace('behavior-counter-', '');
                    const counter = localStorage.getItem(key);
                    if (counter) {
                        this.appData.behaviorCounter[date] = {counter: parseInt(counter, 10)};
                    }
                }
            }
        }

        // Ensure lastUpdated is set for timer data
        if (!this.appData.timer.lastUpdated) {
            this.appData.timer.lastUpdated = new Date().toISOString().split('T')[0];
        }

        // Save the migrated data
        this.saveData();
    }
}
