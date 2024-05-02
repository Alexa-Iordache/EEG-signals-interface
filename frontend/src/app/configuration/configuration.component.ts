import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { RpcService } from '../services/rpc.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteObstacleModalComponent } from '../delete-obstacle-modal/delete-obstacle-modal.component';
import { HttpClient } from '@angular/common/http';
import { SaveRecrdingModalComponent } from '../stop-recording-modal/stop-recording-modal.component';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Recording {
  width: number;
  height: number;
  step: number;
  start: Position;
  finish: Position;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  initialPosX = 0;
  initialPosY = 0;
  obstacles: Obstacle[] = [];
  obstacleInfo: any;
  recording: Recording = {
    width: 800,
    height: 600,
    step: 50,
    start: {
      x: 0,
      y: 0
    },
    finish: {
      x: 0,
      y: 0
    },
  };
  // startPoint: Position = {
  //   x: 0,
  //   y: 0,
  // };
  // finishPoint: Position = {
  //   x: 0,
  //   y: 0,
  // };

  // Variables from form-fields
  obstacleWidth = '20';
  obstacleHeight = '30';
  // stepValue = '50';
  // boardWidth = '800';
  // boardHeight = '600';

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

  // Variables to illustrate which buttons have been clicked on
  recreateActionsButton = false;
  startRecordButton = false;
  stopRecordButton = false;

  // Step number for configuration
  step = 0;

  // Variable for 'board settings' button
  chooseStartingPointActive = false;
  chooseFinishPointActive = false;

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
    const step = this.recording.step;

    // Calculate the potential new position of the point
    let newX = this.recording.start.x;
    let newY = this.recording.start.y;
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
      this.recording.start.x = newX;
      this.recording.start.y = newY;

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
      this.recording.start.x = event.offsetX;
      this.recording.start.y = event.offsetY;
      this.initialPosX = this.recording.start.x;
      this.initialPosY = this.recording.start.y;
      console.log(this.recording.start.x, this.recording.start.y);
    }

    if (this.step === 2 && this.chooseFinishPointActive) {
      this.recording.finish.x = event.offsetX;
      this.recording.finish.y = event.offsetY;
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
    this.recording.width = boardWidth;
    this.recording.height = boardHeight;
    this.obstacleWidth = obstacleWidth;
    this.obstacleHeight = obstacleHeight;
    this.recording.step = step;

    // Update state for 'step' buttons
    this.step = 0;

    // let paramsAddRecording = {
    //   width: board.width,
    //   height: obstacle.height,
    //   xPos: obstacle.x,
    //   yPos: obstacle.y,
    // };

    // Add event
    if (this.isRecording) {
      this.recordedEvents.push(
        `Settings changed: width=${obstacleWidth}, height=${obstacleHeight}, step=${step}`
      );
    }
  }

  // Method to handle obstacle click event
  handleObstacleClick(event: MouseEvent, obstacle: Obstacle) {
    event.stopPropagation(); // This stops the event from propagating further

    this.obstacleToDelete = obstacle;

    // Open the dialog modal
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
    console.log('Recorded Events:', this.recordedEvents);
    this.dialog.open(SaveRecrdingModalComponent);
    this.recreateActionsButton = true;
    this.stopRecordButton = false;
  }

  // Method to recreate actions from the last record
  recreateActions(): void {
    this.recreateActionsButton = true;
    // Reset to initial conditions or a specific start point
    this.recording.start.x = this.initialPosX;
    this.recording.start.y = this.initialPosY;

    this.recordedEvents.forEach((event, index) => {
      setTimeout(() => {
        if (event.startsWith('Moved to')) {
          // Extract coordinates from the log string
          const match = /Moved to \((\d+), (\d+)\)/.exec(event);
          if (match) {
            this.recording.start.x = parseInt(match[1], 10);
            this.recording.start.y = parseInt(match[2], 10);
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
    this.recording.start.x = this.initialPosX;
    this.recording.start.y = this.initialPosY;
    this.obstacles = [];
    this.stopRecordButton = false;
    this.recreateActionsButton = false;
  }
}
