import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BehaviorCounterReset } from '../../../service/storage.service';

@Component({
  selector: 'app-reset-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <h2 mat-dialog-title>Reset Confirmation</h2>
    <mat-dialog-content>
      <p>Are you sure you want to reset the counter?</p>
      <p>The last 3 entries will be cleared:</p>
      
      <mat-list>
        <mat-list-item *ngFor="let reset of data.resetHistory">
          <mat-icon>history</mat-icon>
          <span><b>{{ reset.value < 10 ? '0' + reset.value : reset.value }}</b> - {{ formatTimestamp(reset.timestamp) }}</span>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Reset</button>
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
export class ResetHistoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResetHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resetHistory: BehaviorCounterReset[] }
  ) {}

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}