// import logo from './logo.svg';
// import './App.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-alt/theme.css';
import 'primereact/resources/primereact.min.css';
import { MDBInput } from 'mdb-react-ui-kit';
import { useState } from 'react';
// import { FilterService } from 'primereact/api';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
// import { Calendar } from 'primereact/calendar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { Button } from 'primereact/button';

const ReportComponent = () => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

  };

  // const formatDateForInput = (date) => {
  //   if (!date) return ''; // Return empty string if no date is provided
  //   const d = new Date(date);

  //   // Check if the date is invalid (e.g., NaN or an incorrect date format)
  //   if (isNaN(d.getTime())) {
  //     console.error('Invalid date:', date);
  //     return '';
  //   }

  //   const year = d.getFullYear();
  //   const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading 0 for single-digit months
  //   const day = String(d.getDate()).padStart(2, '0'); // Add leading 0 for single-digit days
  //   return `${year}-${month}-${day}`; // Format as yyyy-MM-dd
  // };

  // const formatDateForInput = (date) => {
  //   if (!date) return '';
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = String(d.getMonth() + 1).padStart(2, '0');
  //   const day = String(d.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const posts = [
    { id: 1, fname: "TERESA WHITE", age: '35', city: "Atlanta", },
    { id: 2, fname: "LEDA WALKER", age: '30', city: "Phili", },
    { id: 3, fname: "DANNY ANGLIN", age: '30', city: "Georgia", },
    { id: 4, fname: "ANGELA MOODY", age: '35', city: "NewJersey", },
    { id: 5, fname: "DESMOND AUGUSTE", age: '40', city: "Iowa", },
    { id: 6, fname: "DESMOND AUGUSTE", age: '41', city: "Iowa", },
    { id: 7, fname: "DESMOND AUGUSTE", age: '42', city: "Iowa", },
    { id: 8, fname: "DESMOND AUGUSTE", age: '43', city: "Iowa", },
    { id: 9, fname: "DESMOND AUGUSTE", age: '44', city: "Iowa", },
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
      const workBook = { Sheets: { data: workSheet }, SheetNames: ["data"] }
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
    });

  };



  const header = (
    // style={{ border:'1px' }}
    <div className='data-table1' >
      {/* <button type="reset" className="btn btn-info mx-2 mb-10 custom-label">Reset</button> */}

      <Button
        type="button"
        icon="pi pi-file-excel"
        onClick={exportExcel}
        // style={{ background:'blue' }}
        className="p-button-success"
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
      <h1 className="custom-h1" style={{ marginTop: '15px', align: 'center' }}>User Productivity Report </h1>
      <div className="card">
        {/* <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Claimant Information</h1> */}
        <div className="form-section flex-fill mb-0">
          <div className="form-group row mb-0 mt-3">
            <div className="col-md-2">
              <MDBInput
                type="date"
                label="From Date"
                className="custom-input"
                name="fromDate"
                onChange={handleChange}
                value={formData.fromDate || ''}
                floating
              />
            </div>
            <div className="col-md-2">
              <MDBInput
                type="date"
                label="To Date"
                onChange={handleChange}
                className="custom-input"
                name="toDate"
                value={formData.toDate || ''}
                floating
              />
            </div>
            <div className="col-md-1">
              <Button label="Reset" icon="pi pi-refresh" size="small" />
            </div>
            <div className="col-md-2">
              <Button label="Generete Report" icon="pi pi-check" size="small" />
            </div>
          </div>
        </div>
        <h1></h1>
        <h1></h1>
      </div>
      <div style={{ backgroundColor: "skyblue", display: 'flex', justifyContent: 'flex-start', padding: '4px' }}>
        <InputText
          onInput={(e) =>
            setFilters({
              global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
            })
          }
        />
      </div>

      <div style={{ border: '0px solid #00796b', borderRadius: '1px', padding: '1px' }}>

        <DataTable value={posts} sortMode="multiple" filters={filters}
          paginator
          footer={header}
          rows={5}
          // rowsPerPageOptions={[1, 2, 3, 4, 5]}
          totalRecords={5}
          stripedRows

        >
          <Column field="id" header="ID" headerStyle={{ backgroundColor: '#4babf55e' }} sortable style={{ border: '1px solid #00796b', borderRadius: '1px', padding: '1px' }} />
          <Column field="fname" header="Name" sortable headerStyle={{ backgroundColor: '#4babf55e' }} style={{ border: '1px solid #00796b', borderRadius: '8px', padding: '10px' }} />
          <Column field="age" header="Age" sortable headerStyle={{ backgroundColor: '#4babf55e' }} style={{ border: '1px solid #00796b', borderRadius: '8px', padding: '10px' }} />
          <Column field="city" header="City" sortable headerStyle={{ backgroundColor: '#4babf55e' }} style={{ border: '1px solid #00796b', borderRadius: '8px', padding: '10px' }} />
        </DataTable>

      </div>

    </div>

  );

}

export default ReportComponent;
