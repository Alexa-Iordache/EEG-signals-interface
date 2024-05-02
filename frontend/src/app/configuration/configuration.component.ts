import { Component, HostListener } from '@angular/core';
import { RpcService } from '../services/rpc.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteObstacleModalComponent } from '../delete-obstacle-modal/delete-obstacle-modal.component';
import { HttpClient } from '@angular/common/http';
import { SaveRecrdingModalComponent } from '../stop-recording-modal/stop-recording-modal.component';

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
  x: number;
  y: number;
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

  // Variables from delete-obstacle modal
  yesBtn = '';
  noBtn = '';

  // Variables for delete confirmation popup
  showDeleteConfirmation = false;
  obstacleToDelete: Obstacle | null = null;

  // Variables for recording process
  isRecording = false;
  recordedEvents: string[] = [];

  // Variable for the last key that was pressed
  lastKeyPressed: string = '';

  // Step number for configuration
  step = 0;

  // Variables to illustrate which buttons have been clicked on
  chooseStartingPointActive = false;
  chooseFinishPointActive = false;
  recreateActionsButton = false;
  startRecordButton = false;
  stopRecordButton = false;

  constructor(
    private http: HttpClient,
    private rpcService: RpcService,
    public dialog: MatDialog
  ) {
    // this.obstacleWidth = '10';
    // this.obstacleHeight = '10';
  }

  ngOnInit(): void {
    this.recreateActionsButton = false;
    this.startRecordButton = false;
    this.stopRecordButton = false;
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
        newX < obstacle.x + obstacle.width &&
        newX + step > obstacle.x &&
        newY < obstacle.y + obstacle.height &&
        newY + step > obstacle.y
      );
    });

    // If the new position does not intersect with any obstacle, update the position
    if (!intersects) {
      this.currentPosition.x = newX;
      this.currentPosition.y = newY;

      if (this.isRecording) {
        this.recordedEvents.push(`Moved to (${newX}, ${newY})`);
      }
    }
  }

  // Method to add a new obstacle (on the board and in database)
  customizeBoard(event: MouseEvent) {
    if (this.step === 3) {
      const obstacle: Obstacle = {
        x: event.offsetX,
        y: event.offsetY,
        width: parseFloat(this.obstacleWidth),
        height: parseFloat(this.obstacleHeight),
      };

      this.obstacles.push(obstacle);

      // let paramsAddObstacle = {
      //   width: obstacle.width,
      //   height: obstacle.height,
      //   xPos: obstacle.x,
      //   yPos: obstacle.y,
      // };

      // this.rpcService.callRPC(
      //   'obstacles.addObstacle',
      //   paramsAddObstacle,
      //   (error: any, res: any) => {
      //     if (error) {
      //       console.log(error);
      //       return;
      //     }
      //     // this.getObstacles();
      //   }
      // );
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

  // Method to customize an obstacle before adding it to the board
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

    // Add event
    if (this.isRecording) {
      this.recordedEvents.push(
        `Settings changed: width=${obstacleWidth}, height=${obstacleHeight}, step=${step}`
      );
    }
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

  // Method to cancel obstacle deletion
  cancelDelete() {
    this.obstacleToDelete = null;
    this.showDeleteConfirmation = false;
  }

  // Method to confirm obstacle deletion
  confirmDelete() {
    if (this.obstacleToDelete) {
      // Remove obstacle from obstacles array
      const index = this.obstacles.indexOf(this.obstacleToDelete);
      if (index !== -1) {
        this.obstacles.splice(index, 1);
      }

      // Delete obstacle from database
      // let paramsDeleteObstacle = {
      //   width: this.obstacleToDelete.width,
      //   height: this.obstacleToDelete.height,
      //   xPos: this.obstacleToDelete.x,
      //   yPos: this.obstacleToDelete.y,
      // };

      // this.rpcService.callRPC(
      //   'obstacles.deleteObstacle',
      //   paramsDeleteObstacle,
      //   (error: any, res: any) => {
      //     if (error) {
      //       console.log(error);
      //       return;
      //     }
      //     // this.getObstacles();
      //   }
      // );

      // Reset variables
      this.obstacleToDelete = null;
      this.showDeleteConfirmation = false;
    }
  }

  // Method to start a new record
  startRecord(): void {
    this.isRecording = true;
    this.recordedEvents = [];
    this.startRecordButton = true;
    this.stopRecordButton = true;
  }

  // Method to stop the record
  stopRecord(): void {
    this.isRecording = false;
    // console.log('Recorded Events:', this.recordedEvents);
    this.dialog.open(SaveRecrdingModalComponent);
    this.recreateActionsButton = true;
    this.stopRecordButton = false;

    console.log(this.recording);
    let paramsAddRecording = {
      width: this.recording.board_width,
      height: this.recording.board_height,
      step: this.recording.robot_step,
      start_x: this.recording.robot_start.x,
      start_y: this.recording.robot_start.y,
      finish_x: this.recording.robot_finish.x,
      finish_y: this.recording.robot_finish.y,
    };
    console.log(paramsAddRecording);

    this.rpcService.callRPC(
      'recordings.addRecording',
      paramsAddRecording,
      (error: any, res: any) => {
        if (error) {
          console.log(error);
          return;
        }
        // this.getObstacles();
      }
    );
  }

  // Method to recreate actions from the last record
  recreateActions(): void {
    this.recreateActionsButton = true;
    // Reset to initial conditions or a specific start point
    this.currentPosition.x = this.recording.robot_start.x;
    this.currentPosition.y = this.recording.robot_start.y;

    this.recordedEvents.forEach((event, index) => {
      setTimeout(() => {
        if (event.startsWith('Moved to')) {
          // Extract coordinates from the log string
          const match = /Moved to \((\d+), (\d+)\)/.exec(event);
          if (match) {
            this.currentPosition.x = parseInt(match[1], 10);
            this.currentPosition.y = parseInt(match[2], 10);
          }
        }
        console.log(`Recreating: ${event}`);
      }, 1000 * index); // Delay each action to visually distinguish them
    });
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
  trainModel(): void {
    this.step = 4;
  }

  // The board and robot are reinitialised
  tryAgain(): void {
    this.currentPosition.x = this.recording.robot_start.x;
    this.currentPosition.y = this.recording.robot_start.y;
    this.obstacles = [];
    this.stopRecordButton = false;
    this.recreateActionsButton = false;
  }
}
