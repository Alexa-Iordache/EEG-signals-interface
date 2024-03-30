import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RpcService } from '../services/rpc.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  @ViewChild('brightnessValue') brightnessValue: any;
  @ViewChild('contrastValue') contrastValue: any;

  // images' path
  originalImagePath = '';
  imageSegmentationPath = '';
  imgBrightnessEnhPath = '';
  imgSharpnessEnhPath = '';
  imgFinalPath = '';

  hasTumor = false; // tumor detected ot not

  resultAfterProcessing = 0; // contour procent resulted after image processing

  resultButtonClicked = false;
  finalImageButton = false;
  brightness =  0;
  contrast = 0;
  isDisabled = true; // processing buttons are disabled until an image is uploaded
  resultButtonsDisabled= true; // buttons for final result are disabled until sharpness button is clicked

  constructor(private router: Router, private rpcService: RpcService) {}

  // uploading an image
  fileUpload(event: any) {
    let variable = [];
    variable = event.value.filename.split('\\');
    this.originalImagePath = variable[2];
    this.isDisabled = false; // the buttons are no longer disabled
  }

  // // reseting images -> in order to process another image
  // resetButton() {
  //   window.location.reload();
  // }

  antrenareModel(): void {
    console.log('antrenare model');
  }

  utilizareModel(): void {
    console.log('utilizare model');
  }

  // exit function - returns to login page
  exitButton(): void {
    this.resultButtonClicked = false;
    let copyInstance = this; // a copy of this class (atributes + methods)
    copyInstance.router.navigate(['/login']);
  }
}
