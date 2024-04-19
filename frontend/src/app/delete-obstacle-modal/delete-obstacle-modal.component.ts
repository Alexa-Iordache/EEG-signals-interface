import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  yesBtn: boolean;
  noBtn: boolean;
}

@Component({
  selector: 'app-delete-obstacle-modal',
  templateUrl: './delete-obstacle-modal.component.html',
  styleUrls: ['./delete-obstacle-modal.component.scss'],
})
export class DeleteObstacleModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteObstacleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close('no');
    this.data.noBtn = true;
    this.data.yesBtn = false;
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
    this.data.noBtn = false;
    this.data.yesBtn = true;
  }
}
