import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProfileModalComponent } from 'src/app/modals/profile-modal/profile-modal.component';
import { ProfileService } from 'src/app/modals/profile-modal/profile-modal.service';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-sidebard',
  templateUrl: './sidebard.component.html',
  styleUrls: ['./sidebard.component.scss'],
})
export class SidebardComponent {
  translations: any = {};

  // Input representing whether the buttons are used for the Main Page or any other dashboard.
  @Input() mainPage = false;

  constructor(
    public translationService: TranslationService,
    public dialog: MatDialog,
    public profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.translationService.getTranslations().subscribe((translations) => {
      this.translations = translations;
    });
  }

  // Method to go back to main-page
  backHome(): void {
    this.router.navigate(['/main-page']);
  }

  // Method to change language
  changeLanguage(lang: string): void {
    this.translationService.switchLang(lang);
  }

  // exit function - returns to login page
  exitButton(): void {
    let copyInstance = this; // a copy of this class (atributes + methods)
    copyInstance.router.navigate(['/login']);
  }

   // Method to go to user profile dashboard
   goToProfile(): void {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    this.dialog.open(ProfileModalComponent, {
      data: userInfo,
    });
  }
}
