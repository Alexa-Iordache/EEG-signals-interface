import { Component } from '@angular/core';
import { ConfigurationService } from '../configuration/configuration.service';
import { Router } from '@angular/router';

// RECORDING object
export interface Recording {
  board_width: number;
  board_height: number;
  robot_step: number;
  robot_start: Position;
  robot_finish: Position;
}

// OBSTACLE object
export interface Obstacle {
  width: number;
  height: number;
  pos: Position;
}

// POSITION object
export interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.scss'],
})
export class TrainModelComponent {
  recording: Recording | null = null;
  obstacles: Obstacle[] = [];

  // Variable illustrating whether 'train model' button was clicked on or not.
  trainModelButton = false;

  constructor(
    private configurationService: ConfigurationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve recording and obstacles data
    this.recording = this.configurationService.getRecording();
    this.obstacles = this.configurationService.getObstacles();
    console.log(this.recording);
    console.log(this.obstacles);
  }

  // Method that reveal neccessary buttons to train a new model
  trainModel(): void {
    this.trainModelButton = true;
    console.log(this.trainModelButton);
  }

  backButton(): void {
    this.trainModelButton = false;
  }

  startRecord(): void {
    console.log('start record');
  }

  stopRecord(): void {
    console.log('stop record');
  }

  recreateActions(): void {
    console.log('recreate actions');
  }

  tryAgain(): void {
    console.log('try again');
  }

  backToConfiguration(): void {
    this.router.navigate(['/configuration']);
  }
}
