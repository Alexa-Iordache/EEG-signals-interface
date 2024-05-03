import { Component, ElementRef, ViewChild } from '@angular/core';
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
  actions: string = '';
  currentPosition: Position = {
    x: 0,
    y: 0,
  };
  recordedEvents: Position[] = [];
  initialPostion: Position = {
    x: 0,
    y: 0,
  };

  // Variable illustrating whether a certain button was clicked on or not.
  trainModelButton = false;
  recreateActionsButton = false;
  stopRecordingButton = false;

  // Array with the possible directions
  directions: string[] = ['right', 'down', 'left', 'up'];

  // Variable for the current direction. Initial direction: right
  currentDirectionIndex: number = 0;

  constructor(
    private configurationService: ConfigurationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve recording and obstacles data
    this.recording = this.configurationService.getRecording();
    this.obstacles = this.configurationService.getObstacles();
    if (this.recording?.robot_start.x)
      this.initialPostion.x = this.recording?.robot_start.x;
    if (this.recording?.robot_start.y)
      this.initialPostion.y = this.recording?.robot_start.y;

    // Initialise state of buttons
    this.recreateActionsButton = false;
    this.stopRecordingButton = false;
  }

  // Method that reveal neccessary buttons to train a new model
  trainModel(): void {
    this.trainModelButton = true;
  }

  backButton(): void {
    this.trainModelButton = false;
  }

  startRecord(): void {
    console.log('start record');
    // Call the function with your input string
    this.actions =
      '[100, 100, 100, 110, 110, 110, 100, 100, 100, 100, 100, 100, 100, 110, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 000]';
    this.processInstructions(this.actions);

    this.stopRecordingButton = true;
  }

  stopRecord(): void {
    // TO DO: save into database
    console.log('stop record');
    console.log(this.recording);
    console.log(this.obstacles);
    console.log(this.actions);

    this.recreateActionsButton = true;
    this.stopRecordingButton = false;
  }

  recreateActions(): void {
    console.log('recreate actions');
    // Reset to initial conditions or a specific start point
    if (this.initialPostion.x) this.currentPosition.x = this.initialPostion.x;
    if (this.initialPostion.y) this.currentPosition.y = this.initialPostion.y;

    this.processInstructions(this.actions);
  }

  tryAgain(): void {
    console.log('try again');
    if (this.initialPostion.x) this.currentPosition.x = this.initialPostion.x;
    if (this.initialPostion.y) this.currentPosition.y = this.initialPostion.y;

    this.recreateActionsButton = false;
    this.stopRecordingButton = false;
  }

  backToConfiguration(): void {
    this.router.navigate(['/configuration']);
  }

  // Method to move forward when '100' appears in the sequence
  moveForward() {
    const robotElement = document.querySelector('.robot') as HTMLElement;
    if (!robotElement) return;

    const currentDirection = this.directions[this.currentDirectionIndex];
    switch (currentDirection) {
      case 'right':
        const currentLeft = parseInt(robotElement.style.left || '0');
        robotElement.style.left = `${currentLeft + 50}px`;
        break;
      case 'down':
        const currentTop = parseInt(robotElement.style.top || '0');
        robotElement.style.top = `${currentTop + 50}px`;
        break;
      case 'left':
        const currentLeft2 = parseInt(robotElement.style.left || '0');
        robotElement.style.left = `${currentLeft2 - 50}px`;
        break;
      case 'up':
        const currentTop2 = parseInt(robotElement.style.top || '0');
        robotElement.style.top = `${currentTop2 - 50}px`;
        break;
    }
  }

  // Method to rotate with 90 degrees when '110' appears in the sequence
  rotateLeft() {
    this.currentDirectionIndex--;
    console.log(this.currentDirectionIndex);
    if (this.currentDirectionIndex < 0) {
      this.currentDirectionIndex = this.directions.length - 1;
    }
  }

  // Method to process the instructions from the array
  processInstructions(instructions: string) {
    // Separeta each pair of 3 digitals
    const pairs = instructions.match(/\d{3}/g);
    if (!pairs) return;

    // Delay time (in milliseconds) between each move
    const delay = 1000;

    let currentIndex = 0;
    const executeNextMove = () => {
      const pair = pairs[currentIndex];
      switch (pair) {
        case '100':
          this.moveForward();
          break;
        case '110':
          this.rotateLeft();
          break;
        case '000':
          console.log('Array is done');
          break;
        default:
          console.log('Invalid instruction');
          break;
      }

      currentIndex++;
      if (currentIndex < pairs.length) {
        setTimeout(executeNextMove, delay);
      }
    };
    // Add a delay before the first move
    setTimeout(executeNextMove, delay);
  }
}
