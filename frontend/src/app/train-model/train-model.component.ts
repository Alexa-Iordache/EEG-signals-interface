import { Component } from '@angular/core';
import { ConfigurationService } from '../configuration/configuration.service';
import { Router } from '@angular/router';
import { RpcService } from '../services/rpc.service';

// RECORDING object
export interface Recording {
  board_width: number;
  board_height: number;
  robot_step: number;
  robot_start: Position;
  robot_finish: Position;
  configuration_time: number;
  performance: number;
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
  initialPostion: Position = {
    x: 0,
    y: 0,
  };
  recordedEvents: Position[] = [];

  // Variable illustrating whether a certain button was clicked on or not.
  trainModelButton = false;
  chooseFinishPointActive = false;
  startRecordEnabled = false;
  stopRecordEnabled = false;
  recreateActionsEnabled = false;
  tryAgainEnabled = false;

  // Variable to control the state of the "Try again" button
  recreatingActions: boolean = false;

  // Array with the possible directions
  directions: string[] = ['right', 'down', 'left', 'up'];

  // Variable for the current direction. Initial direction: right
  currentDirectionIndex: number = 0;

  // Variable for the last direction to be displayed.
  lastDirection: string = '';

  constructor(
    private configurationService: ConfigurationService,
    private router: Router,
    private rpcService: RpcService
  ) {}

  ngOnInit(): void {
    // Retrieve recording and obstacles data
    this.recording = this.configurationService.getRecording();
    this.obstacles = this.configurationService.getObstacles();
    this.chooseFinishPointActive =
      this.configurationService.getFinishPointActive();
    if (this.recording?.robot_start.x)
      this.initialPostion.x = this.recording?.robot_start.x;
    if (this.recording?.robot_start.y)
      this.initialPostion.y = this.recording?.robot_start.y;
  }

  // Method that reveal neccessary buttons to train a new model
  trainModel(): void {
    this.trainModelButton = true;
    this.startRecordEnabled = true;
  }

  // Method to go back to main options buttons
  backButton(): void {
    this.trainModelButton = false;
    this.resetButtonStates();
  }

  // Method to start recording the actions
  startRecord(): void {
    // TO DO: take the string from python scrip
    this.actions = '[100, 110, 110, 110, 100, 100, 000]';
    this.processInstructions(this.actions);

    this.startRecordEnabled = false;
    this.stopRecordEnabled = true;
  }

  // Method to stop the recording and add the neccessary information into database
  stopRecord(): void {
    // TO DO: save into database
    console.log('RECORDING: ', this.recording);
    console.log('OBSTACLES: ', this.obstacles);
    console.log('ACTIONS: ', this.actions);

    this.stopRecordEnabled = false;
    this.recreateActionsEnabled = true;
    this.tryAgainEnabled = true;

    // ADD NEW RECORDING INTO DATABASE (OBSTACLES + ACTIONS)

    let paramsAddRecording = {
      width: this.recording?.board_width,
      height: this.recording?.board_height,
      step: this.recording?.robot_step,
      start_x: this.recording?.robot_start.x,
      start_y: this.recording?.robot_start.y,
      finish_x: this.recording?.robot_finish.x,
      finish_y: this.recording?.robot_finish.y,
      configuration_time: this.recording?.configuration_time,
      performance: this.recording?.performance,
      actions: this.actions,
    };

    this.rpcService.callRPC(
      'recordings.addRecording',
      paramsAddRecording,
      (error: any, recordingId: any) => {
        if (error) {
          console.log(error);
          return;
        } else {
          this.addAllObstaclesToDatabase(this.obstacles, recordingId);
        }
      }
    );
  }

  // Method to recreate the actions
  recreateActions(): void {
    this.currentPosition.x = this.initialPostion.x;
    this.currentPosition.y = this.initialPostion.y;
    this.currentDirectionIndex = 0;
    this.processInstructions(this.actions);

    this.recreateActionsEnabled = false;
    this.recreatingActions = true;
  }

  // Method to re-initialise the board
  tryAgain(): void {
    this.currentPosition.x = this.initialPostion.x;
    this.currentPosition.y = this.initialPostion.y;
    this.currentDirectionIndex = 0;
    this.startRecordEnabled = true;
  }

  // Method to reset the state for all buttons
  resetButtonStates(): void {
    this.startRecordEnabled = false;
    this.stopRecordEnabled = false;
    this.recreateActionsEnabled = false;
    this.tryAgainEnabled = false;
  }

  // MEthod to go back to configuration mode
  backToConfiguration(): void {
    this.router.navigate(['/configuration']);
  }

  // Method to move forward when '100' appears in the sequence
  moveForward() {
    const step = this.recording?.robot_step || 50;
    const currentDirection = this.directions[this.currentDirectionIndex];

    switch (currentDirection) {
      case 'right':
        this.currentPosition.x += step;
        this.lastDirection = 'ArrowRight';
        break;
      case 'down':
        this.currentPosition.y += step;
        this.lastDirection = 'ArrowDown';
        break;
      case 'left':
        this.currentPosition.x -= step;
        this.lastDirection = 'ArrowLeft';
        break;
      case 'up':
        this.currentPosition.y -= step;
        this.lastDirection = 'ArrowUp';
        break;
    }
  }

  // Method to rotate with 90 degrees when '110' appears in the sequence
  rotateLeft() {
    this.currentDirectionIndex--;
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
          this.recreatingActions = false;
          break;
        default:
          console.log('Invalid instruction');
          break;
      }

      currentIndex++;
      if (currentIndex < pairs.length) {
        // Not using delay when the action is to rotate the robot
        if (pairs[currentIndex] === '110') {
          executeNextMove();
        } else {
          setTimeout(executeNextMove, delay);
        }
      }
    };
    // Add a delay before the first move
    setTimeout(executeNextMove, delay);
  }

  addAllObstaclesToDatabase(obstacles: Obstacle[], recordingId: string): void {
    obstacles.forEach((obstacle) => {
      let paramsAddObstacle = {
        recordingId: recordingId,
        width: obstacle.width,
        height: obstacle.height,
        xPos: obstacle.pos.x,
        yPos: obstacle.pos.y,
      };

      this.rpcService.callRPC(
        'obstacles.addObstacle',
        paramsAddObstacle,
        (error: any, res: any) => {
          if (error) {
            console.log(error);
            return;
          }
        }
      );
    });
  }
}
