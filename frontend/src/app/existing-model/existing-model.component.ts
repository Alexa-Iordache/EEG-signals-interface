import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface rowData {
  name: string;
  description: string;
}

const rows: rowData[] = [
  {
    name: 'Maia',
    description: 'description1',
  },
  {
    name: 'Asher',
    description: 'description1',
  },
  {
    name: 'Olivia',
    description: 'description1',
  },
  {
    name: 'Atticus',
    description: 'description1',
  },
  {
    name: 'Amelia',
    description: 'description1',
  },
  {
    name: 'Jack',
    description: 'description1',
  },
  {
    name: 'Charlotte',
    description: 'description1',
  },
  {
    name: 'Theodore',
    description: 'description1',
  },
  {
    name: 'Isla',
    description: 'description1',
  },
  {
    name: 'Oliver',
    description: 'description1',
  },
  {
    name: 'Oliver',
    description: 'description1',
  },
];

@Component({
  selector: 'app-existing-model',
  templateUrl: './existing-model.component.html',
  styleUrls: ['./existing-model.component.scss'],
})
export class ExistingModelComponent {
  displayedColumns: string[] = ['id', 'name', 'description'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(
      rows.map((row, index) => ({
        id: index + 1,
        name: row.name,
        description: row.description,
      }))
    );
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
