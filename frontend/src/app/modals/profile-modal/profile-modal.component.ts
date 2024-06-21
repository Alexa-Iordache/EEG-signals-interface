import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RpcService } from 'src/app/services/rpc.service';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
})
export class ProfileModalComponent {
  isEditing = false;
  errorMessage: string | null = null;
  translations: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfileModalComponent>,
    private rpcService: RpcService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.translationService.getTranslations().subscribe((translations) => {
      this.translations = translations;
    });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.errorMessage = null;
  }

  // Method to save changes
  saveChanges(): void {
    if (
      !this.data[0].last_name ||
      !this.data[0].first_name ||
      !this.data[0].age ||
      !this.data[0].sex ||
      !this.data[0].medical_problems ||
      !this.data[0].causes
    ) {
      this.errorMessage = this.translations?.profileModal?.error_message;
      return;
    }

    this.isEditing = false;

    let params = {
      username: this.data[0].username,
      first_name: this.data[0].first_name,
      last_name: this.data[0].last_name,
      age: this.data[0].age,
      sex: this.data[0].sex,
      medical_problems: this.data[0].medical_problems,
      causes: this.data[0].causes,
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
