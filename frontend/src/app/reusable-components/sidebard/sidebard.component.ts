import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebard',
  templateUrl: './sidebard.component.html',
  styleUrls: ['./sidebard.component.scss']
})
export class SidebardComponent {

  @Input() backgroundColorBlue = true;

  constructor(private router: Router) {}

  // Method to go back to main-page
  backHome(): void {
    console.log('back to home');
    this.router.navigate(['/main-page']);
  }

  // Method to go to user profile dashboard
  goToProfile(): void {
    console.log('go to profile');
  }

  // Method to change language
  changeLanguage(): void {
    console.log('change language');
  }
}
