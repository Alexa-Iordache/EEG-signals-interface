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
  @Input() currentPage: any;
  @Output() loginButtonPressed = new EventEmitter<string>();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private rpcService: RpcService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    if (!this.currentPage) this.currentPage = 'login';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      data: { username: '', password: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'done') {
        this.loginButtonPressed.emit('done');
        this.router.navigate(['/main-page']);
      }
    });
  }
}
