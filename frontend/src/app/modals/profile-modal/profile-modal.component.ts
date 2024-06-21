import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RpcService } from 'src/app/services/rpc.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
})
export class ProfileModalComponent {
  isEditing = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfileModalComponent>,
    private rpcService: RpcService
  ) {}

  ngOnInit() {
    console.log('Profile data:', this.data);
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

  // Method to save changes
  saveChanges(): void {
    this.isEditing = false;

    let params = {
      username: this.data[0].username,
      first_name: this.data[0].first_name,
      last_name: this.data[0].last_name,
      age: this.data[0].age,
      sex: this.data[0].sex,
      medical_problems: this.data[0].medical_problems,
      causes: this.data[0].causes
    };

    this.rpcService.callRPC('auth.updateUser', params, (err: any, res: any) => {
      if (err || res.error) {
        console.log('nu s a putut afisa utilizatorul');
      }
      sessionStorage.setItem('userInfo', JSON.stringify(this.data));
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
