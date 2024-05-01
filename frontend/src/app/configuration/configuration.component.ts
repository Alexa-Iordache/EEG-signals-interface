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

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  posX = 0;
  posY = 0;
  obstacles: Obstacle[] = [];
  obstacleInfo: any;

  // Variables from form-fields
  widthValue = '20';
  heightValue = '30';
  stepValue = '10';
  selectedPosition = '';

  // Variables from delete-obstacle modal
  yesBtn = '';
  noBtn = '';

  // Variables for delete confirmation popup
  showDeleteConfirmation = false;
  obstacleToDelete: Obstacle | null = null;

  // Variables for recording process
  recording = false;
  recordedEvents: string[] = [];

  // Variable for the last key that was pressed
  lastKeyPressed: string = '';

  // Variables to illustrate which buttons have been clicked on
  recreateActionsButton = false;
  startRecordButton = false;
  stopRecordButton = false;


  constructor(
    private http: HttpClient,
    private rpcService: RpcService,
    public dialog: MatDialog
  ) {
    // this.widthValue = '10';
    // this.heightValue = '10';
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
    const step = parseInt(this.stepValue);

    // Calculate the potential new position of the point
    let newX = this.posX;
    let newY = this.posY;
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
      this.posX = newX;
      this.posY = newY;

      if (this.recording) {
        this.recordedEvents.push(`Moved to (${newX}, ${newY})`);
      }
    }
  }

  // Method to get all the existing obstacles from database
  getObstacles(): void {
    let params = {
      username: 'admin',
    };

    this.rpcService.callRPC(
      'obstacles.getObstacles',
      params,
      (err: any, res: any) => {
        if (err || res.error) {
          console.log('the obstacles could not be displayed');
          return;
        }
        this.obstacleInfo = res.result;

        // Display the existing obstacles from database
        this.obstacles = this.obstacleInfo.map((obstacle: any) => ({
          x: obstacle.xPos,
          y: obstacle.yPos,
          width: obstacle.width,
          height: obstacle.height,
        }));
      }
    );
  }

  // Method to add a new obstacle (on the board and in database)
  addObstacle(event: MouseEvent) {
    const obstacle: Obstacle = {
      x: event.offsetX,
      y: event.offsetY,
      width: parseFloat(this.widthValue),
      height: parseFloat(this.heightValue),
    };

    this.obstacles.push(obstacle);
    if (this.recording) {
      this.recordedEvents.push(
        `Obstacle added: x=${obstacle.x}, y=${obstacle.y}, width=${obstacle.width}, height=${obstacle.height}`
      );
    }

    let paramsAddObstacle = {
      xPos: obstacle.x,
      yPos: obstacle.y,
      width: obstacle.width,
      height: obstacle.height,
    };

    this.rpcService.callRPC(
      'obstacles.addObstacle',
      paramsAddObstacle,
      (error: any, res: any) => {
        if (error) {
          console.log(error);
          return;
        }
        this.getObstacles();
      }
    );
  }

  // Method to customize an obstacle before adding it to the board
  applyChanges(width: string, height: string, step: string, position: string) {
    this.widthValue = width;
    this.heightValue = height;
    this.stepValue = step;
    this.selectedPosition = position;

    if (this.recording) {
      this.recordedEvents.push(
        `Settings changed: width=${width}, height=${height}, step=${step}, position=${position}`
      );
    }

    if (this.selectedPosition === 'top-left') {
      (this.posX = 0), (this.posY = 0);
    }
    if (this.selectedPosition === 'middle-left') {
      (this.posX = 0), (this.posY = 300);
    }
    if (this.selectedPosition === 'bottom-left') {
      (this.posX = 0), (this.posY = 580);
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
      let paramsDeleteObstacle = {
        width: this.obstacleToDelete.width,
        height: this.obstacleToDelete.height,
        xPos: this.obstacleToDelete.x,
        yPos: this.obstacleToDelete.y,
      };

      this.rpcService.callRPC(
        'obstacles.deleteObstacle',
        paramsDeleteObstacle,
        (error: any, res: any) => {
          if (error) {
            console.log(error);
            return;
          }
          this.getObstacles();
        }
      );

      // Reset variables
      this.obstacleToDelete = null;
      this.showDeleteConfirmation = false;
    }
  }

  // Method to start a new record
  startRecord(): void {
    this.recording = true;
    this.recordedEvents = [];
    console.log('Recording started');
    this.startRecordButton = true;
  }

  // Method to stop the record
  stopRecord(): void {
    this.recording = false;
    console.log('Recording stopped');
    console.log('Recorded Events:', this.recordedEvents);
    this.dialog.open(SaveRecrdingModalComponent);
    this.stopRecordButton = true;
  }

  // Method to recreate actions from the last record
  recreateActions(): void {
    this.recreateActionsButton = true;
    // Reset to initial conditions or a specific start point
    this.posX = 0;
    this.posY = 0;
    this.obstacles = []; // Clear existing obstacles if they need to be reset

    this.recordedEvents.forEach((event, index) => {
      setTimeout(() => {
        if (event.startsWith('Moved to')) {
          // Extract coordinates from the log string
          const match = /Moved to \((\d+), (\d+)\)/.exec(event);
          if (match) {
            this.posX = parseInt(match[1], 10);
            this.posY = parseInt(match[2], 10);
          }
        } else if (event.startsWith('Settings changed')) {
          // Apply settings changes or ignore if only move events need to be recreated
        } else if (event.startsWith('Obstacle added')) {
          // Example log might be "Obstacle added: x=50, y=50, width=20, height=20"
          const match = /x=(\d+), y=(\d+), width=(\d+), height=(\d+)/.exec(
            event
          );
          if (match) {
            this.obstacles.push({
              x: parseInt(match[1], 10),
              y: parseInt(match[2], 10),
              width: parseInt(match[3], 10),
              height: parseInt(match[4], 10),
            });
          }
        }
        console.log(`Recreating: ${event}`);
      }, 1000 * index); // Delay each action to visually distinguish them
    });
  }
}
