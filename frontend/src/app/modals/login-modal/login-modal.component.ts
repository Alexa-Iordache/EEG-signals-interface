import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { RpcService } from 'src/app/services/rpc.service';
import { TranslationService } from 'src/app/services/translation.service';

export interface LoginInputs {
  username: string;
  password: string;
  authFailed?: boolean;
}

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  isLoginButtonDisabled = true;
  translations: any = {};

  constructor(
    public translationService: TranslationService,
    public dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoginInputs,
    private rpcService: RpcService,
    private cookieService: CookieService
  ) {
    this.checkIfLoginButtonShouldBeEnabled();
  }

  ngOnInit() {
    this.translationService.getTranslations().subscribe(translations => {
      this.translations = translations;
    });
  }

  login(): void {
    if (!this.data.username || !this.data.password) {
      console.log('username or password was not introduced');
      return;
    }

    const parameters = {
      username: this.data.username,
      password: this.data.password,
      query: `SELECT * FROM Users WHERE username = '${this.data.username}' LIMIT 1;`,
    };

    this.rpcService.callRPC(
      'auth.login',
      parameters,
      (error: any, res: any) => {
        if (error) {
          console.log('login failed');
          console.log(this.data);
          console.log(parameters)
          this.data.authFailed = true;
          return;
        }

        this.data.authFailed = false; // Resetare authFailed la succes
        this.cookieService.set('eeg-login', res.result.encoded);
        this.dialogRef.close('done');
        console.log('a mers logarea');
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

  checkIfLoginButtonShouldBeEnabled(): void {
    this.isLoginButtonDisabled = !(this.data.username && this.data.password);
    this.data.authFailed = false;
  }
}
