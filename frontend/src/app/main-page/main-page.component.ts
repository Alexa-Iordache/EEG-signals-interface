import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  translations: any = {};

  constructor(
    private router: Router,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.translationService.getTranslations().subscribe(translations => {
      this.translations = translations;
    });
  }

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
}
