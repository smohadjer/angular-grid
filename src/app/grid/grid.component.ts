import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef, GridReadyEvent, CellValueChangedEvent} from 'ag-grid-community'; // Column Definitions Interface
import { HttpClient } from '@angular/common/http';
import { CompanyLogoRenderer } from './../logo/'

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {
  // Default Column Definitions: Apply configuration across all columns
  defaultColDef: ColDef = {
    filter: true,
    editable: true
  };

  rowData: any[] = [];
  count = 0;

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: "mission", filter: false  },
    {
      field: "company",
      cellRenderer: CompanyLogoRenderer // Render a custom component
    },
    { field: "location" },
    { field: "date" },
    {
      field: "price",
      valueFormatter: params => { return '$' + params.value.toLocaleString(); } // Format with inline function
    },
    { field: "successful" },
    { field: "rocket" }
  ];

  // // Load data into grid when ready
  // onGridReady(params: GridReadyEvent) {
  //   this.http
  //     .get<any[]>('https://www.ag-grid.com/example-assets/space-mission-data.json')
  //     .subscribe(data => this.rowData = data);
  // }

  onGridReady(params: GridReadyEvent) {
    console.log('grid is ready', params);

    this.http
    .get<any[]>('https://www.ag-grid.com/example-assets/space-mission-data.json')
    .subscribe(data => {
      this.rowData = data;
      this.count = data.length;
    });
  }

  // Handle cell editing event
  onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log(`New Cell Value: ${event.value}`)
  }

  constructor(private http: HttpClient) {

  }
}
