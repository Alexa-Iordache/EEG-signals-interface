import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  constructor(private router: Router) {}

  configuration(): void {
    console.log('Configuration mode');
    this.router.navigate(['/configuration']);
  }

  trainModel(): void {
    console.log('Train new model');
    this.router.navigate(['/train-model']);
  }

  useModel(): void {
    console.log('Use existing model');
    this.router.navigate(['/use-existing-model']);
  }

  showProfile(): void {
    console.log('Show user profile');
    this.router.navigate(['/profile-page']);
  }

  changeLanguage(): void {
    console.log('change language');
  }

  // exit function - returns to login page
  exitButton(): void {
    let copyInstance = this; // a copy of this class (atributes + methods)
    copyInstance.router.navigate(['/login']);
  }
}
