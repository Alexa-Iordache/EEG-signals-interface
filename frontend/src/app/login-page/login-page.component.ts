import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../modals/login-modal/login-modal.component';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  @Input() currentPage: any;
  @Output() loginButtonPressed = new EventEmitter<string>();

  translations: any = {};

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.translationService.getTranslations().subscribe(translations => {
      this.translations = translations;
    });
    if (!this.currentPage) this.currentPage = 'login';
  }

  changeLanguage(lang: string): void {
    this.translationService.switchLang(lang);
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
