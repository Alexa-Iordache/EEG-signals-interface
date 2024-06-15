import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LoginInputs {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  isLoginButtonDisabled = true;

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoginInputs
  ) {}

  checkIfLoginButtonShouldBeEnabled(): void {
    this.isLoginButtonDisabled = !(this.data.username && this.data.password);
    console.log(this.isLoginButtonDisabled)
  }

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
}
