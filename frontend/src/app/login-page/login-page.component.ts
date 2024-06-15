import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RpcService } from '../services/rpc.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../modals/login-modal/login-modal.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  authFailed = false;
  // loginButtonClicked = false;
  username = '';
  password = '';

  @Input() currentPage: any;
  @Output() loginButtonPressed = new EventEmitter<string>();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private rpcService: RpcService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // this.loginButtonClicked = false;
    if (!this.currentPage) this.currentPage = 'login';
  }

  login(username: string, password: string): void {
    console.log('s-a apasat butonul de login');

    // if there is no username or password
    if (!username || !password) {
      console.log('username or password was not introduced');
      return;
    }

    let parameters = {
      username: username,
      password: password,
      query: `SELECT * FROM Users WHERE username = '${username}' LIMIT 1;`,
    };

    let copyInstance = this; // a copy of this class (atributes + methods)

    this.rpcService.callRPC(
      'auth.login',
      parameters,
      (error: any, res: any) => {
        if (error) {
          console.log('login failed');
          this.authFailed = true;
          return;
        }

        // daca nu avem eroare
        copyInstance.cookieService.set('eeg-login', res.result.encoded);
        copyInstance.loginButtonPressed.emit('done');
        copyInstance.router.navigate(['/main-page']);
        console.log('a mers logarea');
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      data: { username: this.username, password: this.password },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.username && result.password) {
        this.login(result.username, result.password);
      }
    });
  }
}
