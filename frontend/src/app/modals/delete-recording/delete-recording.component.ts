import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-recording',
  templateUrl: './delete-recording.component.html',
  styleUrls: ['./delete-recording.component.scss'],
})
export class DeleteRecordingComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteRecordingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }
}
