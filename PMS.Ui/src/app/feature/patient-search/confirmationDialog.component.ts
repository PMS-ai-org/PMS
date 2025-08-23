import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { MaterialModule } from "../../core/shared/material.module";

@Component({
    selector: 'app-confirm-dialog',
    styles: [`
      .center {
        justify-content: center;
      }
    `],
    template: `
    <h2 mat-dialog-title>Confirm</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions class="center">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Delete</button>
    </mat-dialog-actions>
  `,
    imports: [MatDialogActions, MaterialModule]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { message: string }
    ) { }

    onConfirm(): void {
        this.dialogRef.close(true); // return true when user clicks delete
    }

    onCancel(): void {
        this.dialogRef.close(false); // return false when cancel
    }
}
