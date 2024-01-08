import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef,
  ColGroupDef,
  GridReadyEvent,
  CellValueChangedEvent,
  SortDirection,
  GridApi,
} from 'ag-grid-community';
import 'ag-grid-enterprise';

import { ApiService } from '../apiService';
import { Item } from './../types';
import { AgeEditor } from './ageEditor';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AgGridModule],
  providers: [ ApiService ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})

export class GridComponent {
  components = {
    'ageEditor': AgeEditor
  };
  dataUrl = 'https://api-public-test.vercel.app/api/';
  gridApi!: GridApi;
  sortingOrder: SortDirection[] = ['desc', 'asc'];
  rowData: any[] = [];
  count = 0;
  defaultColDef = {
    filter: true,
  }

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      field: "saleDate",
    },
    {
      field: "storeLocation",
      editable: true
    },
    {
      headerName: 'Customer Email',
      field: 'customer.email',
      editable: true
    },
    {
      headerName: 'Gender',
      field: 'customer.gender',
      editable: true,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: ['M', 'F'],
      },
    },
    // {
    //   headerName: 'Customer Age',
    //   field: 'customer.age',
    //   editable: true,
    //   cellDataType: 'number',
    //   cellEditor: 'agNumberCellEditor',
    //   cellEditorParams: {
    //     min: 0,
    //     max: 100
    //   }
    // },
    {
      headerName: 'Age',
      field: 'customer.age',
      editable: true,
      cellDataType: 'number',
      cellEditor: 'ageEditor',
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

  // Load data into grid when ready
  onGridReady(params: GridReadyEvent) {
    console.log('grid is ready');
    this.gridApi = params.api;
  }

  // Handle cell editing event
  onCellValueChanged = (event: CellValueChangedEvent) => {
    const dataString = JSON.stringify({"doc": event.data});

    if (event.value) {
      fetch(this.dataUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: dataString
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
    } else {
      alert(`Invalid value: ${event.value}`);
    }
  }

  groupByLocation() {
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
