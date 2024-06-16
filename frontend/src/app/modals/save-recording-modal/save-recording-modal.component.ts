import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RpcService } from 'src/app/services/rpc.service';

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

  // Error message to display in the modal
  errorMessage: string | null = null;

  // Save button disabled state
  saveDisabled = false;

  constructor(
    public dialogRef: MatDialogRef<SaveRecordingModalComponent>,
    private rpcService: RpcService
  ) {}

  // Method for 'do not save' case
  onNoClick(): void {
    this.dataSent.saved = false;
    this.dialogRef.close(this.dataSent);
  }

  // Method for 'save' case
  onYesClick(): void {
    this.dataSent.saved = true;
    this.dataSent.description = this.descriptionText;
    this.dataSent.roomName = this.roomNameText;
    this.dialogRef.close(this.dataSent);
  }

  // Check for duplicate recordings
  checkForDuplicates(): void {
    let paramsCheckRecording = {
      room_name: this.roomNameText,
      description: this.descriptionText,
    };

    this.rpcService.callRPC(
      'recordings.checkDuplicateRecording',
      paramsCheckRecording,
      (error: any, response: any) => {
        if (error) {
          console.log(error);
          return;
        } else if (response.exists) {
          this.errorMessage =
            'Recording with the same room name and description already exists.';
          this.saveDisabled = true;
        } else {
          this.errorMessage = null;
          this.saveDisabled = false;
        }
      }
    );
  }
}
