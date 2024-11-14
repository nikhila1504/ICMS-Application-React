// import logo from './logo.svg';
// import './App.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-alt/theme.css';
import 'primereact/resources/primereact.min.css';

import { useState } from 'react';
// import { FilterService } from 'primereact/api';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { Button } from 'primereact/button';


const ReportComponent = () => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const posts = [
    {  id: 1, fname: "TERESA WHITE",  age: '35', city: "Atlanta",    },
    {  id: 2,  fname: "LEDA WALKER", age: '30', city: "Phili",   },
    {  id: 3,  fname: "DANNY ANGLIN",   age: '30',   city: "Georgia", },
    {  id: 4,  fname: "ANGELA MOODY",   age: '35',    city: "NewJersey", }, 
    {  id: 5,  fname: "DESMOND AUGUSTE",   age: '40',   city: "Iowa",  },   
  ];

const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Product List', 20, 10);

        // Convert DataTable columns to a format `autoTable` can use
        const columns = [
            { header: 'ID', dataKey: 'id' },
            { header: 'Name', dataKey: 'fname' },
            { header: 'Age', dataKey: 'age' },
            { header: 'City', dataKey: 'city' }
        ];

        // Convert rows of data to `autoTable` format
        doc.autoTable({
            columns: columns,
            body: posts,
            startY: 20,
            theme: 'grid',
        });

        doc.save('UserProductivityReport.pdf');
    };


  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const workSheet = xlsx.utils.json_to_sheet(posts);
      const workBook = { Sheets: { data: workSheet }, SheetNames: ["data"]}
      const excelBuffer = xlsx.write(workBook, {
       bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "posts");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((FileSaver) => {
      let EXCEL_TYPE = 
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      // FileSaver.saveAs(
      saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    }) ;
  
  };

  

  const header = (
    <div className="flex align-items-center export-button">
      <Button
      type="button" 
      icon="pi pi-file-excel"
      onClick={exportExcel}
      className="p-button-success mr-2"
      label="Export to Xcel"
      data-pr-tooltip="XLS"
      />
      
      {/* <Button label="Export to Xcel" icon="pi pi-file-excel" onClick={exportExcel} className="p-mb-3" /> */}
      <Button label="Export to PDF" icon="pi pi-file-pdf" onClick={exportToPDF} className="p-mb-3" />
     </div>
  );
  return (
    <div>
      <h1></h1>
      <h1 className="custom-h1" style={{ marginTop: '5px', align:'right' }}>User Productivity Report </h1>
      <div style={{backgroundColor:"#4169e1",display: 'flex', justifyContent: 'flex-start' ,padding :'4px' }}>
      <InputText 
          onInput={(e) =>
          setFilters({
            global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
          })
        }
      />
</div>

      <DataTable value={posts} sortMode="multiple" filters={filters}
      paginator
      footer={header}
      rows={5}
      rowsPerPageOptions={[1,2,3,4,5]}
      totalRecords={5}
      stripedRows
      >
        <Column field="id" header="ID" sortable />
        <Column field="fname" header="Name" sortable/>
        <Column field="age" header="Age" sortable/>
        <Column field="city" header="City" sortable/>
      </DataTable>

    </div>
  );
}

export default ReportComponent;
