import { Component, HostListener } from '@angular/core';
import { RpcService } from '../services/rpc.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteObstacleModalComponent } from '../delete-obstacle-modal/delete-obstacle-modal.component';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
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

// ACTION object
export interface Action {
  newPosition: Position;
}

// POSITION object
export interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  obstacles: Obstacle[] = [];
  obstacleInfo: any;
  recording: Recording = {
    board_width: 800,
    board_height: 600,
    robot_step: 50,
    robot_start: {
      x: 0,
      y: 0,
    },
    robot_finish: {
      x: 0,
      y: 0,
    },
  };
  currentPosition: Position = {
    x: 0,
    y: 0,
  };

  // Variables from form-fields inputs
  obstacleWidth = '20';
  obstacleHeight = '30';
  confTime = '3'; // 3 seconds between recording 2 sequences
  performance = '80'; // 80% performance

  // Variables from delete-obstacle modal
  yesBtn = '';
  noBtn = '';

  // Variables for delete confirmation popup
  showDeleteConfirmation = false;
  obstacleToDelete: Obstacle | null = null;

  // Variables for recording process
  isRecording = false;
  recordedEvents: Position[] = [];
  recreatedSimulationDone = false;

  // Variable for the last key that was pressed
  lastKeyPressed: string = '';

  // Step number for configuration
  step = 0;

  // Variables to illustrate which buttons have been clicked on
  chooseStartingPointActive = false;
  chooseFinishPointActive = false;
  recreateSimulationButton = false;
  clickedRecreateSimulationButton = false;
  startSimulationButton = false;
  stopSimulationButton = false;
  handleFinishPointClickButton = false;

  constructor(
    private http: HttpClient,
    private rpcService: RpcService,
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private router: Router
  ) {
    // this.obstacleWidth = '10';
    // this.obstacleHeight = '10';
  }

  ngOnInit(): void {
    this.recreateSimulationButton = false;
    this.startSimulationButton = false;
    this.stopSimulationButton = false;
    this.clickedRecreateSimulationButton = false;

    // Data will not be lost while switching pages
    this.recording = this.configurationService.getRecording() || this.recording;
    this.obstacles = this.configurationService.getObstacles();
  }

  // the point can be moved on the board using the 4 arrow keys
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.lastKeyPressed = event.key;
    const step = this.recording.robot_step;

    // Calculate the potential new position of the point
    let newX = this.currentPosition.x;
    let newY = this.currentPosition.y;
    switch (event.key) {
      case 'ArrowUp':
        newY -= step;
        break;
      case 'ArrowDown':
        newY += step;
        break;
      case 'ArrowLeft':
        newX -= step;
        break;
      case 'ArrowRight':
        newX += step;
        break;
    }

    // Check if the new position intersects with any obstacle
    const intersects = this.obstacles.some((obstacle) => {
      return (
        newX < obstacle.pos.x + obstacle.width &&
        newX + step > obstacle.pos.x &&
        newY < obstacle.pos.y + obstacle.height &&
        newY + step > obstacle.pos.y
      );
    });

    // If the new position does not intersect with any obstacle, update the position
    if (!intersects) {
      this.currentPosition.x = newX;
      this.currentPosition.y = newY;

      if (this.isRecording) {
        this.recordedEvents.push({
          x: this.currentPosition.x,
          y: this.currentPosition.y,
        });
      }
    }
  }

  // Method to add a new obstacle (on the board and in database)
  customizeBoard(event: MouseEvent) {
    if (this.step === 3) {
      const obstacle: Obstacle = {
        width: parseFloat(this.obstacleWidth),
        height: parseFloat(this.obstacleHeight),
        pos: {
          x: event.offsetX,
          y: event.offsetY,
        },
      };

      this.obstacles.push(obstacle);
    }

    if (this.step === 2 && this.chooseStartingPointActive) {
      this.currentPosition.x = event.offsetX;
      this.currentPosition.y = event.offsetY;
      this.recording.robot_start.x = this.currentPosition.x;
      this.recording.robot_start.y = this.currentPosition.y;
    }

    if (this.step === 2 && this.chooseFinishPointActive) {
      this.recording.robot_finish.x = event.offsetX;
      this.recording.robot_finish.y = event.offsetY;
    }
  }

  // Method to customize the board, an obstacle or the step of the robot
  applyChanges(
    boardWidth: number,
    boardHeight: number,
    obstacleWidth: string,
    obstacleHeight: string,
    step: number
  ) {
    // Update values from input fields
    this.recording.board_width = boardWidth;
    this.recording.board_height = boardHeight;
    this.obstacleWidth = obstacleWidth;
    this.obstacleHeight = obstacleHeight;
    this.recording.robot_step = step;

    // Update state for 'step' buttons
    this.step = 0;
  }

  // Method to handle obstacle click event
  handleObstacleClick(event: MouseEvent, obstacle: Obstacle) {
    event.stopPropagation();
    this.obstacleToDelete = obstacle;

    const dialogRef = this.dialog.open(DeleteObstacleModalComponent, {
      data: {
        noBtn: this.noBtn,
        yesBtn: this.yesBtn,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {
        console.log('nothing');
        return;
      }

      if (result === 'no') {
        this.cancelDelete();
      } else {
        this.confirmDelete();
      }
    });
  }

  handleFinishPointClick(event: MouseEvent) {
    event.stopPropagation();
    this.handleFinishPointClickButton = true;

    let obstacleToDelete = {
      width: 60,
      height: 30,
      pos: this.recording.robot_finish,
    };

    this.handleObstacleClick(event, obstacleToDelete);
  }

  // Method to cancel obstacle deletion
  cancelDelete() {
    this.obstacleToDelete = null;
    this.showDeleteConfirmation = false;
  }

  // Method to confirm obstacle deletion
  confirmDelete() {
    if (this.obstacleToDelete) {
      // Remove the finish point, without deleting other object
      if (this.handleFinishPointClickButton) {
        this.recording.robot_finish = {
          x: 0,
          y: 0,
        };
        this.handleFinishPointClickButton = false;
        return;
      }
      // Remove obstacle from obstacles array
      const index = this.obstacles.indexOf(this.obstacleToDelete);
      if (index !== -1) {
        this.obstacles.splice(index, 1);
      }

      // Reset variables
      this.obstacleToDelete = null;
      this.showDeleteConfirmation = false;
    }
  }

  // Method to start a new record
  startSimulation(): void {
    this.isRecording = true;
    this.recordedEvents = [];
    this.startSimulationButton = true;
    this.stopSimulationButton = true;
    this.recreatedSimulationDone = false;
  }

  // Method to stop the record
  stopSimulation(): void {
    this.isRecording = false;
    // this.dialog.open(SaveRecrdingModalComponent);
    this.recreateSimulationButton = true;
    this.stopSimulationButton = false;

    // ADD NEW RECORDING INTO DATABASE (OBSTACLES + ACTIONS)

    // let paramsAddRecording = {
    //   width: this.recording.board_width,
    //   height: this.recording.board_height,
    //   step: this.recording.robot_step,
    //   start_x: this.recording.robot_start.x,
    //   start_y: this.recording.robot_start.y,
    //   finish_x: this.recording.robot_finish.x,
    //   finish_y: this.recording.robot_finish.y,
    // };

    // this.rpcService.callRPC(
    //   'recordings.addRecording',
    //   paramsAddRecording,
    //   (error: any, recordingId: any) => {
    //     if (error) {
    //       console.log(error);
    //       return;
    //     } else {
    //       this.addAllObstaclesToDatabase(this.obstacles, recordingId);

    //       for (let i = 0; i < this.recordedEvents.length; i++) {
    //         setTimeout(() => {
    //           this.addAllActionsToDatabase(this.recordedEvents[i], recordingId);
    //           console.log(
    //             `Actions added in db: (${this.recordedEvents[i].x}, ${this.recordedEvents[i].y})`
    //           );
    //         }, 1000 * i); // Delay each action to visually distinguish them
    //       }
    //     }
    //   }
    // );
  }

  // Method to recreate actions from the last record
  recreateSimulation(): void {
    this.clickedRecreateSimulationButton = true;
    // Reset to initial conditions or a specific start point
    this.currentPosition.x = this.recording.robot_start.x;
    this.currentPosition.y = this.recording.robot_start.y;

    this.recordedEvents.forEach((event, index) => {
      setTimeout(() => {
        if (event.hasOwnProperty('x') && event.hasOwnProperty('y')) {
          const xPos = event.x;
          const yPos = event.y;
          console.log(`Moved to (${xPos}, ${yPos})`);

          this.currentPosition.x = xPos;
          this.currentPosition.y = yPos;

          if (index === this.recordedEvents.length - 1) {
            this.recreatedSimulationDone = true;
          }
        } else {
          console.log(event);
        }
      }, 1000 * index); // Delay each action to visually distinguish them
    });
  }

  // Method to add all obstacles with the given recording ID to the database
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

  // Method to add all obstacles with the given recording ID to the database
  addAllActionsToDatabase(action: Position, recordingId: string): void {
    let paramsAddObstacle = {
      recordingId: recordingId,
      xPos: action.x,
      yPos: action.y,
    };

    this.rpcService.callRPC(
      'actions.addActions',
      paramsAddObstacle,
      (error: any, res: any) => {
        if (error) {
          console.log(error);
          return;
        }
      }
    );
  }

  // Method to choose the starting position of the robot
  chooseStartingPoint(): void {
    this.chooseStartingPointActive = true;
    this.chooseFinishPointActive = false;
  }

  // Method to choose the finish position of the robot
  chooseFinishPoint(): void {
    this.chooseFinishPointActive = true;
    this.chooseStartingPointActive = false;
  }

  // Method that reveal neccessary form-fields to customize board dimension
  boardSettings(): void {
    this.step = 1;
  }

  // Method that reveal neccessary form-fields and buttons to customize robot dimension
  robotSettings(): void {
    this.step = 2;
  }

  // Method that reveal neccessary form-fields to customize obstacle dimension
  obstaclesSettings(): void {
    this.step = 3;
  }

  // Method that reveal neccessary buttons to train a new model
  simulation(): void {
    this.step = 4;
  }

  // The board and robot are reinitialised
  tryAgain(): void {
    this.configurationService.resetData();
    this.currentPosition.x = this.recording.robot_start.x;
    this.currentPosition.y = this.recording.robot_start.y;
    this.obstacles = [];
    this.stopSimulationButton = false;
    this.recreateSimulationButton = false;
  }

  // Method that reveal neccessary form-fields to customize recording performance
  configurationSettings(): void {
    this.step = 5;
  }

  // Method that switches page to train-model mode
  goTrainModel(): void {
    this.configurationService.setRecording(this.recording);
    this.configurationService.setObstacles(this.obstacles);
    this.configurationService.setFinishPointActive(
      this.chooseFinishPointActive
    );
    this.router.navigate(['/train-model']);
  }
}
