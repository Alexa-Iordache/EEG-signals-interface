import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {

  constructor(private router: Router) {}

  trainModel(): void {
    console.log('Train new model');
  }

  useModel(): void {
    console.log('Use existing model');
  }

  // exit function - returns to login page
  exitButton(): void {
    let copyInstance = this; // a copy of this class (atributes + methods)
    copyInstance.router.navigate(['/login']);
  }
}
