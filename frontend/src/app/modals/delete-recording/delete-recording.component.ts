import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-delete-recording',
  templateUrl: './delete-recording.component.html',
  styleUrls: ['./delete-recording.component.scss'],
})
export class DeleteRecordingComponent {
  translations: any = {};

  constructor(
    public dialogRef: MatDialogRef<DeleteRecordingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
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
