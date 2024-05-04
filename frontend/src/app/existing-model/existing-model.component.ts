import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RpcService } from '../services/rpc.service';
import {
  Obstacle,
  Recording,
  rowData,
} from '../reusable-components/interfaces';

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

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private rpcService: RpcService) {
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
        console.log(this.obstaclesInfo);
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
          return;
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
        console.log(this.displayedRecording);
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
        console.log(this.displayedObstacles);
      }
    );
  }

  // Method to recreat the actions for the selected recording
  startModel(): void {
    console.log('start model button waas clicked');
  }
}
