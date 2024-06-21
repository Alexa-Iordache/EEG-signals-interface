import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
})
export class ProfileModalComponent {
  isEditing = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfileModalComponent>
  ) {}

  ngOnInit() {
    console.log('Profile data:', this.data);
    // Ensure data object is initialized
    if (!this.data) {
      this.data = {
        last_name: '',
        first_name: '',
        age: null,
        sex: '',
        medical_problems: '',
        causes: ''
      };
    }
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  saveChanges(): void {
    // Add your save logic here, e.g., call a service to save the changes
    console.log('Saving changes:', this.data);
    this.isEditing = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
