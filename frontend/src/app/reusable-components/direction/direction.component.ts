import { Component, Input } from '@angular/core';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss'],
})
export class DirectionComponent {
  // Input representing whether the recreataing action state is active or not.
  @Input() recreateActionsButton = false;

  // Input representing the last key pressed by the user.
  @Input() lastKeyPressed = '';

  translations: any = {};

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.getTranslations().subscribe((translations) => {
      this.translations = translations;
    });
  }
}
