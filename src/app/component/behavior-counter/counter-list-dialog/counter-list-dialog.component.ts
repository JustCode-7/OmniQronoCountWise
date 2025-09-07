import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-counter-list-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatListModule
    ],
    template: `
        <h2 mat-dialog-title>Today's history</h2>
        <mat-dialog-content>
            <mat-list>
                <mat-list-item *ngFor="let reset of data?.conuterDataLastIncrementTimeHistory">
                    <mat-icon>history</mat-icon>
                    <span>{{ reset }}</span>
                </mat-list-item>
            </mat-list>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Ok</button>
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
export class CounterListDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { conuterDataLastIncrementTimeHistory: string[] } | undefined) {
    }

}
