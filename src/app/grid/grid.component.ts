import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef, ColGroupDef, GridReadyEvent, CellValueChangedEvent, GridApi } from 'ag-grid-community';
import 'ag-grid-enterprise';

import { ApiService } from '../apiService';
import { Item } from './../types';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AgGridModule],
  providers: [ ApiService ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})

export class GridComponent {
  dataUrl = 'https://api-public-test.vercel.app/api/';
  gridApi!: GridApi;

  // Default Column Definitions: Apply configuration across all columns
  defaultColDef: ColDef = {
    filter: true,
    editable: true
  };

  colDefs: (ColDef | ColGroupDef)[] = [
    {
      field: "_id",
      filter: false,
      headerName: "ID",
      editable: false
    },
    {
      field: "saleDate",
    },
    {
      field: "storeLocation",
    },
    {
      headerName: 'Customer Email',
      field: 'customer.email',
      editable: true
    },
    {
      headerName: 'Customer Gender',
      field: 'customer.gender',
      editable: true
    },
    {
      headerName: 'Customer Age',
      field: 'customer.age',
      editable: true
    },
    { field: "items",
      width: 300,
      valueFormatter: params => {
        let names: string[] = [];
        if (params.value) {
          params.value.forEach((element: Item) => {
            names.push(element.name || '');
          });
        } else {
          console.warn('field items valueFormatter has problem!')
        }

        return names.join(', ');
      }
    },
    { field: "purchaseMethod"},
    { field: "couponUsed"}
  ];

  rowData: any[] = [];
  count = 0;

  // Load data into grid when ready
  onGridReady(params: GridReadyEvent) {
    console.log('grid is ready');
    this.gridApi = params.api;
  }

  // Handle cell editing event
  onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log(JSON.stringify(event.data));
    fetch(this.dataUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"doc": event.data})
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
  }

  groupByLocation() {
    // field: "storeLocation",
    // rowGroup: true,
    // hide: true,
    console.log('groupping...');
    const columnDefs: (ColDef | ColGroupDef)[] = this.gridApi.getColumnDefs()!;
    columnDefs.forEach((colDef: ColDef, index) => {
      if (colDef.field === 'storeLocation') {
        colDef.rowGroup = true;
        colDef.hide = true;
      }
    });

    this.gridApi.setGridOption('columnDefs', columnDefs);
  }

  reset() {
    const columnDefs: (ColDef | ColGroupDef)[] = this.gridApi.getColumnDefs()!;
    console.log(columnDefs);
    columnDefs.forEach((colDef: ColDef, index) => {
      if (colDef.field === 'storeLocation') {
        colDef.rowGroup = false;
        colDef.hide = false;
      }
    });
    this.gridApi.setGridOption('columnDefs', columnDefs);
  }

  constructor(private apiService: ApiService) {
    this.apiService.get(this.dataUrl)
    .subscribe(data => {
      this.rowData = data;
      this.count = data.length;
    });
  }
}
