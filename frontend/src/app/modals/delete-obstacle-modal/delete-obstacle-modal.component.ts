import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-delete-obstacle-modal',
  templateUrl: './delete-obstacle-modal.component.html',
  styleUrls: ['./delete-obstacle-modal.component.scss'],
})
export class DeleteObstacleModalComponent {
  translations: any = {};

  constructor(
    public dialogRef: MatDialogRef<DeleteObstacleModalComponent>,
    public translationService: TranslationService
  ) {}


  ngOnInit(): void {
    this.translationService.getTranslations().subscribe(translations => {
      this.translations = translations;
    });
  }

  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }
}
