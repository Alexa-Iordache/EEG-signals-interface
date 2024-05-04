import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-obstacle-modal',
  templateUrl: './delete-obstacle-modal.component.html',
  styleUrls: ['./delete-obstacle-modal.component.scss'],
})
export class DeleteObstacleModalComponent {
  constructor(public dialogRef: MatDialogRef<DeleteObstacleModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }
}
