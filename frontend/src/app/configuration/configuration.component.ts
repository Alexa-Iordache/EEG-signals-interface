import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteObstacleModalComponent } from '../modals/delete-obstacle-modal/delete-obstacle-modal.component';
import { ConfigurationService } from './configuration.service';
import { Router } from '@angular/router';
import {
  Obstacle,
  Position,
  Recording,
} from '../reusable-components/interfaces';

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
    configuration_time: 0.5,
    performance: 90,
    room_name: '',
    description: '',
  };
  currentPosition: Position = {
    x: 0,
    y: 0,
  };

  // Variables from form-fields inputs
  obstacleWidth = '70';
  obstacleHeight = '30';

  // Variables for delete confirmation popup
  showDeleteConfirmation = false;
  obstacleToDelete: Obstacle | null = null;

  // Variables for recording process
  isRecording = false;
  recordedEvents: Position[] = [];

  // Variable for the last key that was pressed
  lastKeyPressed: string = '';

  // Step number for configuration
  step = 0;

  // Variable to control the state of the "Try again" button
  recreatingSimulation: boolean = false;

  // Array to store robot's trace
  robotTrace: { x: number; y: number }[] = [];

  // Variables to illustrate which buttons have been clicked on
  chooseStartingPointActive = false;
  chooseFinishPointActive = false;
  recreateSimulationButton = false;
  startSimulationButton = false;
  stopSimulationButton = false;
  tryAgainButton = false;
  handleFinishPointClickButton = false;

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

      // Call updateRobotTrace here to update the trace whenever the position changes
      this.updateRobotTrace(this.currentPosition.x, this.currentPosition.y);
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
    step: number,
    confTime: number,
    performance: number
  ) {
    // Update values from input fields
    if (typeof boardWidth === 'string')
      this.recording.board_width = parseInt(boardWidth);
    if (typeof boardHeight === 'string')
      this.recording.board_height = parseInt(boardHeight);
    this.obstacleWidth = obstacleWidth;
    this.obstacleHeight = obstacleHeight;
    if (typeof step === 'string') this.recording.robot_step = parseInt(step);
    if (typeof confTime === 'string')
      this.recording.configuration_time = parseFloat(confTime);
    if (typeof performance === 'string')
      this.recording.performance = parseInt(performance);

    // Update state for 'step' buttons
    this.step = 0;
    this.resetButtonStates();
  }

  // Method to handle obstacle click event
  handleObstacleClick(event: MouseEvent, obstacle: Obstacle) {
    event.stopPropagation();
    this.obstacleToDelete = obstacle;

    const dialogRef = this.dialog.open(DeleteObstacleModalComponent);

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
  }

  // Method to stop the record
  stopSimulation(): void {
    this.isRecording = false;
    this.recreateSimulationButton = true;
    this.stopSimulationButton = false;
    this.tryAgainButton = true;
  }

  // Method to recreate actions from the last record
  recreateSimulation(): void {
    this.recreateSimulationButton = true;
    this.recreatingSimulation = true;
    // Reset to initial conditions or a specific start point
    this.currentPosition.x = this.recording.robot_start.x;
    this.currentPosition.y = this.recording.robot_start.y;

    // Add a delay before the first action
    setTimeout(() => {
      this.recordedEvents.forEach((event, index) => {
        setTimeout(() => {
          if (event.hasOwnProperty('x') && event.hasOwnProperty('y')) {
            const xPos = event.x;
            const yPos = event.y;
            console.log(`Moved to (${xPos}, ${yPos})`);

            this.currentPosition.x = xPos;
            this.currentPosition.y = yPos;

            if (index === this.recordedEvents.length - 1)
              this.recreatingSimulation = false;
          } else {
            console.log(event);
          }
        }, 500 * index); // Delay each action to visually distinguish them
      });
    }, 500); // Delay before the first action
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
    this.robotTrace = [];
    this.lastKeyPressed = '';

    // Reset buttons state
    this.stopSimulationButton = false;
    this.recreateSimulationButton = false;
    this.tryAgainButton = false;
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

  // Method to reset the state for all buttons
  resetButtonStates(): void {
    this.startSimulationButton = false;
    this.stopSimulationButton = false;
    this.recreateSimulationButton = false;
    this.tryAgainButton = false;
  }

  // Method to update robot's trace
  updateRobotTrace(x: number, y: number): void {
    this.robotTrace.push({ x, y });
  }
}
