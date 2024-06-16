import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RpcService } from '../services/rpc.service';
import {
  Obstacle,
  Position,
  Recording,
  rowData,
} from '../reusable-components/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRecordingComponent } from '../modals/delete-recording/delete-recording.component';

@Component({
  selector: 'app-existing-model',
  templateUrl: './existing-model.component.html',
  styleUrls: ['./existing-model.component.scss'],
})
export class ExistingModelComponent {
  // Columns to be displayed
  displayedColumns: string[] = ['name', 'description', 'button'];

  // Data for table
  dataSource: MatTableDataSource<any>;
  displayedInfo: rowData[] = [];

  // Recordings and obstacles info from database
  obstaclesInfo: Obstacle[] = [];
  recordingsInfo: Recording[] = [];

  // Info about a recording displayed after clickin on button
  displayedRecording: any;
  displayedObstacles: any;

  // Variable illustrating if one select button from table was clicked on
  selectButtonClicked = false;
  pauseButtonClicked = false;
  restartButtonClicked = false;

  // Array with the possible directions
  directions: string[] = ['right', 'down', 'left', 'up'];

  // Variable for the current direction. Initial direction: right
  currentDirectionIndex: number = 0;

  // Variable for the last direction to be displayed.
  lastDirection: string = '';

  // Current position for robot
  currentPosition: Position = {
    x: 0,
    y: 0,
  };

  // Variable to control the state of the "Try again" button
  recreatingActions: boolean = false;

  // Variable to track if the model is paused
  isModelPaused: boolean = false;

  // Variable used to monitor the position and index of actions when the pause button is activated
  pausePosition: Position = {
    x: 0,
    y: 0,
  };
  pauseActionIndex = 0;

  // Copy of the pause index
  copyPauseActionIndex = 0;

  // Array to store the robot trace path
  robotTrace: Position[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    public dialog: MatDialog,
    private rpcService: RpcService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    // this.getObstaclesFromDB();
    this.getAllRecordingsFromDB();
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  // Method to apply filter
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Method to clear filters
  clearFilters(): void {
    this.dataSource.filter = ''; // Reset the filter input value
  }

  // Method to get all the obstacles from database
  getObstaclesFromDB(): void {
    let params = {
      username: 'admin',
    };

    this.rpcService.callRPC(
      'obstacles.getObstacles',
      params,
      (err: any, res: any) => {
        if (err || res.error) {
          console.log('nu s au putut afisa obstacolele');
          return;
        }
        this.obstaclesInfo = res.result;
      }
    );
  }

  // Method to get all the recordings from database
  getAllRecordingsFromDB(): void {
    let params = {
      username: 'admin',
    };

    this.rpcService.callRPC(
      'recordings.getRecordings',
      params,
      (err: any, res: any) => {
        if (err || res.error) {
          console.log('nu s au putut afisa inregistrarile');
        }
        this.recordingsInfo = res.result;
        res.result.forEach((recording: any) => {
          this.displayedInfo.push({
            recordingID: recording.id,
            name: recording.room_name,
            description: recording.description,
          });
        });
        this.dataSource = new MatTableDataSource(this.displayedInfo);

        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
      }
    );
  }

  // One select button is clicked on
  buttonClicked(recording: any): void {
    this.selectButtonClicked = true;

    let params = {
      recordingID: recording.recordingID,
    };
    this.rpcService.callRPC(
      'recordings.getOneRecording',
      params,
      (error: any, res: any) => {
        if (error) {
          console.log('nu s a putut afisa inregistrarea');
          return;
        }
        this.displayedRecording = res.result[0];
        this.currentPosition.x = this.displayedRecording.robot_start_x;
        this.currentPosition.y = this.displayedRecording.robot_start_y;
      }
    );

    this.rpcService.callRPC(
      'obstacles.getObstaclesForOneRecording',
      params,
      (error: any, res: any) => {
        if (error) {
          console.log('nu s au putut afisa obstacolele');
          return;
        }
        this.displayedObstacles = res.result;
      }
    );
  }

  // Method to recreat the actions for the selected recording
  startModel(): void {
    this.robotTrace = [];
    this.currentPosition.x = this.displayedRecording.robot_start_x;
    this.currentPosition.y = this.displayedRecording.robot_start_y;
    this.currentDirectionIndex = 0;
    this.processInstructions(this.displayedRecording.actions);
    this.isModelPaused = false;
    this.recreatingActions = true;
    this.pauseButtonClicked = true;
    this.restartButtonClicked = false;
    this.copyPauseActionIndex = 0;
  }

  // Method to move forward when '100' appears in the sequence
  moveForward() {
    const step = this.displayedRecording.robot_step || 50;
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

     // Add current position to robotTrace
     this.robotTrace.push({ x: this.currentPosition.x, y: this.currentPosition.y });
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
      if (this.isModelPaused) return; // Stop execution if the model is paused

      const pair = pairs[currentIndex];
      switch (pair) {
        case '100':
          this.moveForward();
          break;
        case '110':
          this.rotateLeft();
          break;
        case '0':
          console.log('Array is done');
          this.recreatingActions = false;
          this.pauseButtonClicked = false;
          this.restartButtonClicked = false;
          break;
        default:
          console.log('Invalid instruction');
          break;
      }

      currentIndex++;
      this.pauseActionIndex = currentIndex;
      // this.pauseActionIndex++;
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

  // Method to go back to table
  backToTable(): void {
    this.selectButtonClicked = false;
    this.clearFilters();
  }

  // Method to pause the model
  pauseModel(): void {
    this.isModelPaused = true;
    this.pauseButtonClicked = false;
    this.restartButtonClicked = true;
    this.pausePosition.x = this.currentPosition.x;
    this.pausePosition.y = this.currentPosition.y;
    this.copyPauseActionIndex += this.pauseActionIndex;
  }

  // Method to restart the model
  restartModel(): void {
    this.isModelPaused = false;
    this.pauseButtonClicked = true;
    this.restartButtonClicked = true;
    this.currentPosition.x = this.pausePosition.x;
    this.currentPosition.y = this.pausePosition.y;
    this.recreatingActions = true;

    const actionsArray = this.displayedRecording.actions.split(', ');
    let remainingActions = actionsArray
      .slice(this.copyPauseActionIndex)
      .join(', ');
    this.pauseActionIndex = 0;
    this.processInstructions(remainingActions);
  }

  // Method to delete a recording from the database
  deleteRecording(recording: any): void {
    const dialogRef = this.dialog.open(DeleteRecordingComponent, {
      data: { name: recording.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result === 'yes') {
        let params = {
          recordingID: recording.recordingID,
        };
        this.rpcService.callRPC(
          'recordings.deleteRecording',
          params,
          (error: any, res: any) => {
            if (error) {
              console.log('nu s a putut sterge inregistrarea');
              return;
            }
          }
        );
      }
    });
  }
}
