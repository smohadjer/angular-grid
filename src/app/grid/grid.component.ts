import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef, ColGroupDef, GridReadyEvent, CellValueChangedEvent} from 'ag-grid-community'; // Column Definitions Interface
import { DataService } from './../data.service';
import { Item } from './../types';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AgGridModule],
  providers: [ DataService ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
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
  colDefs: (ColDef | ColGroupDef)[] = [
    {
      field: "_id", filter: false,
      headerName: "ID"
    },
    {
      field: "saleDate",
    },
    { field: "storeLocation" },
    {
      headerName: 'Customer Email',
      field: 'customer.email'
    },
    {
      headerName: 'Customer Gender',
      field: 'customer.gender'
    },
    {
      headerName: 'Customer Age',
      field: 'customer.age'
    },
    { field: "items",
      width: 300,
      valueFormatter: params => {
        let names: string[] = [];
        params.value.forEach((element: Item) => {
          names.push(element.name || '');
        });
        return names.join(', ');
      }
    },
    // {
    //   field: "price",
    //   valueFormatter: params => { return '$' + params.value.toLocaleString(); } // Format with inline function
    // },
    { field: "purchaseMethod"},
    { field: "couponUsed"}
  ];

  // Load data into grid when ready
  onGridReady(params: GridReadyEvent) {
    this.dataService.getData('https://api-public-test.vercel.app/api/')
    .subscribe(data => {
      console.log(data);
      this.rowData = data;
      this.count = data.length;
    });
  }

  // Handle cell editing event
  onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log(`New Cell Value: ${event.value}`)
  }

  constructor(private dataService: DataService) {}
}
