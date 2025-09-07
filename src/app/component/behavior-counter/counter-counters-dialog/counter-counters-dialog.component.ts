import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-counter-counters-dialog',
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatSuffix,
        FormsModule,
    ],
    template: `
        <h2 mat-dialog-title>How many counters?</h2>
        <mat-dialog-content>
            <mat-form-field class="example-form-field">
                <mat-label>Number of counters (1-8)</mat-label>
                <input matInput min="1" max="8" pattern="^[1-8]$" [(ngModel)]="value">
                @if (value) {
                    <button matSuffix mat-icon-button aria-label="Clear" (click)="value=''">
                        <mat-icon>close</mat-icon>
                    </button>
                }
            </mat-form-field>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button [disabled]="isInvalid(value)" mat-stroked-button mat-dialog-close
                    (click)="addNewItem(value)"
                    color="accent">Ok
            </button>
        </mat-dialog-actions>
    `,
    styles: [`
      mat-dialog-content {
        min-width: 300px;
      }

      mat-list-item {
        margin-bottom: 8px;
      }
    `]
})
export class CounterCountersDialogComponent {
    value = '2';

    @Output() counterValue = new EventEmitter<string>();

    isInvalid(val: string): boolean {
        if (val == null) return true;
        const trimmed = String(val).trim();
        if (trimmed === '') return true;
        // Accept only integers 1..8 strictly
        if (!/^([1-8])$/.test(trimmed)) return true;
        const num = Number(trimmed);
        return !(Number.isInteger(num) && num >= 1 && num <= 8);
    }

    addNewItem(value: string) {
        if (!this.isInvalid(value)) {
            this.counterValue.emit(value);
        }
    }
}
