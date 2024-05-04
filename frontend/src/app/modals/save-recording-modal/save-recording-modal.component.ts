import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export interface SaveRecordingDialogData {
  saved: boolean;
  roomName: string;
  description: string;
}

@Component({
  selector: 'app-save-recording-modal',
  templateUrl: './save-recording-modal.component.html',
  styleUrls: ['./save-recording-modal.component.scss'],
})
export class SaveRecordingModalComponent {
  // Variable to keep track of which button was clicked on
  noBtnClicked = false;
  yesBtnClicked = false;

  // The text from input field
  descriptionText = '';
  roomNameText = '';

  // The object that is sent to train-model dashboard
  dataSent: SaveRecordingDialogData = {
    saved: false,
    roomName: '',
    description: '',
  };

  constructor(public dialogRef: MatDialogRef<SaveRecordingModalComponent>) {}

  // Method for 'do not save' case
  onNoClick(): void {
    this.dataSent.saved = false;
    this.dialogRef.close(this.dataSent);
    console.log(this.roomNameText);
  }

  // Method for 'save' case
  onYesClick(): void {
    this.dataSent.saved = true;
    this.dataSent.description = this.descriptionText;
    this.dataSent.roomName = this.roomNameText;
    this.dialogRef.close(this.dataSent);
  }
}
