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
  displayedColumns: string[] = ['name', 'description'];
  dataSource: MatTableDataSource<any>;
  obstaclesInfo: Obstacle[] = [];
  recordingsInfo: Recording[] = [];
  displayedInfo: rowData[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private rpcService: RpcService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    // this.getObstaclesFromDB();
    this.getRecordingsFromDB();
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
  getRecordingsFromDB(): void {
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
        this.recordingsInfo.forEach((recording) => {
          this.displayedInfo.push({
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
}
