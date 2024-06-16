import { Component, Input } from '@angular/core';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-step-messages',
  templateUrl: './step-messages.component.html',
  styleUrls: ['./step-messages.component.scss'],
})
export class StepMessagesComponent {
  // Input representing step number
  @Input() step = 0;

  translations: any = {};

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.getTranslations().subscribe((translations) => {
      this.translations = translations;
    });
  }
}
