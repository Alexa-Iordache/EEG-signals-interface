import { Component } from '@angular/core';
import { ConfigurationService } from '../configuration/configuration.service';
import { Router } from '@angular/router';
import { RpcService } from '../services/rpc.service';
import { MatDialog } from '@angular/material/dialog';
import { SaveRecordingModalComponent } from '../modals/save-recording-modal/save-recording-modal.component';
import {
  Recording,
  Obstacle,
  Position,
} from '../reusable-components/interfaces';
import { TranslationService } from '../services/translation.service';
import { TrainModelService } from './train-model.service';

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

  // Data sent to python script
  dataSent = '';

  // Array to store robot's trace
  robotTrace: { x: number; y: number }[] = [];

  translations: any = {};

  constructor(
    private configurationService: ConfigurationService,
    private router: Router,
    private rpcService: RpcService,
    public dialog: MatDialog,
    public translationService: TranslationService,
    public trainModelService: TrainModelService
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
    this.currentPosition = {
      x: this.initialPostion.x,
      y: this.initialPostion.y,
    };

    // translations
    this.translationService.getTranslations().subscribe((translations) => {
      this.translations = translations;
    });
  }

  // Method that reveal neccessary buttons to train a new model
  trainModel(): void {
    this.trainModelButton = true;
    this.startRecordEnabled = true;
    if (this.recording?.configuration_time)
      this.dataSent = this.recording?.configuration_time.toString();
    this.trainModelService.sendData(this.dataSent);
  }

  // Method to go back to main options buttons
  backButton(): void {
    this.trainModelButton = false;
    this.resetButtonStates();
  }

  // Method to start recording the actions
  async startRecord() {
    let receivedData = await this.trainModelService.getDataFromPython();
    this.actions = receivedData.data;
    // this.actions = '[100, 100, 0]';
    this.processInstructions(this.actions);

    this.startRecordEnabled = false;
  }

  // Method to stop the recording and add the neccessary information into database
  stopRecord(): void {
    this.stopRecordEnabled = false;
    this.recreateActionsEnabled = true;
    this.tryAgainEnabled = true;

    const dialogRef = this.dialog.open(SaveRecordingModalComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {
        console.log('nothing');
        return;
      }

      if (result.saved === true) {
        // ADD NEW RECORDING INTO DATABASE (OBSTACLES + ACTIONS)
        if (this.recording) {
          this.recording.room_name = result.roomName;
          this.recording.description = result.description;
        }
        this.addRecordingToDatabase();
        console.log('RECORDING: ', this.recording);
        console.log('OBSTACLES: ', this.obstacles);
        console.log('ACTIONS: ', this.actions);
      } else {
        console.log('record was not saved');
      }
    });
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
    this.robotTrace = [];

    // Reset buttons state
    this.startRecordEnabled = true;
    this.tryAgainEnabled = false;
    this.recreateActionsEnabled = false;
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
    const step = this.recording!.robot_step || 50;
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

    // Update robot's trace after movement
    this.updateRobotTrace();
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
    const pairs = instructions.match(/\d{3}|0/g);
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
        case '0':
          this.recreatingActions = false;
          this.stopRecordEnabled = true;
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

  // Method to add a new recording to database (+ obstacles + actions)
  addRecordingToDatabase(): void {
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
      description: this.recording?.description,
      room_name: this.recording?.room_name,
    };

    // Check if obstacles array is empty
    if (this.obstacles.length === 0) {
      // Create default obstacle with 0 values
      let defaultObstacle: Obstacle = {
        width: 0,
        height: 0,
        pos: { x: 0, y: 0 },
      };

      // Add default obstacle to the obstacles array
      this.obstacles.push(defaultObstacle);
    }

    this.rpcService.callRPC(
      'recordings.addRecording',
      paramsAddRecording,
      (error: any, response: any) => {
        if (error) {
          console.log(error);
          return;
        } else {
          this.addAllObstaclesToDatabase(this.obstacles, response);
        }
      }
    );
  }

  // Methos to add all obstacles to the database
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

  // Method to update robot's trace with current position
  updateRobotTrace(): void {
    this.robotTrace.push({
      x: this.currentPosition.x,
      y: this.currentPosition.y,
    });
  }
}
