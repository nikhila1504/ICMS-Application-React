// import logo from './logo.svg';
// import './App.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/nova-alt/theme.css';
import 'primereact/resources/primereact.min.css';
import { MDBInput } from 'mdb-react-ui-kit';

import { useState,useEffect } from 'react';
// import { FilterService } from 'primereact/api';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
// import { Calendar } from 'primereact/calendar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { Button } from 'primereact/button';
import ReportService from "../services/report.service";
import { format } from 'date-fns';
import { ProgressSpinner } from 'primereact/progressspinner'; // Import ProgressSpinner from PrimeReact

const ReportPageComponent = () => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
   // Function to apply global filter on filtered data
   const applyGlobalFilter = (inputValue) => {
    const globalFilteredData = data.filter(item => {
      const lowerCaseInput = inputValue?.toLowerCase();
      const matchValue = lowerCaseInput ? item.activityDate?.toLowerCase().includes(lowerCaseInput) ||
                                      item.staffName?.toLowerCase().includes(lowerCaseInput) ||
                                      item.functionalRole?.toLowerCase().includes(lowerCaseInput) ||
                                      item.formName?.toLowerCase().includes(lowerCaseInput) ||
                                      item.countNo?.toString().toLowerCase().includes(lowerCaseInput) : true;
      return matchValue && dateFilter(item.activityDate);
    });

    setFilteredData(globalFilteredData);
  };
// const [data, setData] = useState({
//     fromDate: '',
//     toDate: ''
//   });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(data);  // The state for the filtered data
  const [fromDate, setFromDate] = useState(null);  // From date state
  const [toDate, setToDate] = useState(null);  // To date state
  const [searchTerm, setSearchTerm] = useState(""); // State for search input


    // Function to filter data based on the date range
    const dateFilter = (value) => {
        const itemDate = new Date(value);
        if (fromDate && toDate) {
            return itemDate >= new Date(fromDate) && itemDate <= new Date(toDate);
        }
        if (fromDate) {
            return itemDate >= new Date(fromDate);
        }
        if (toDate) {
            return itemDate <= new Date(toDate);
        }
        return true;
    };

    // Function to handle filter changes
    const handleFilterChange = () => {
        setFilteredData(data.filter(item => dateFilter(item.date)));
    };


const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('User Productivity Report', 20, 10);

        // Convert DataTable columns to a format `autoTable` can use
        const columns = [
            { header: 'Date', dataKey: 'activityDate' },
            { header: 'Staff Name', dataKey: 'staffName' },
            { header: 'Functional Role', dataKey: 'functionalRole' },
            { header: 'Form Name', dataKey: 'formName' },
            { header: 'Count', dataKey: 'countNo' }
        ];

        // Convert rows of data to `autoTable` format
        doc.autoTable({
            columns: columns,
            body: filteredData,
            startY: 20,
            theme: 'grid',        });

        doc.save('UserProductivityReport.pdf');
    };


  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const workSheet = xlsx.utils.json_to_sheet(filteredData);
      const workBook = { Sheets: { data: workSheet }, SheetNames: ["data"]}
      const excelBuffer = xlsx.write(workBook, {
       bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "UserProductivityReport");
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
        fileName + EXCEL_EXTENSION
        // fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    }) ;

  };


  useEffect(() => {
    ReportService.getUserReport()
      .then((response) => {
        const fetchedData = response.data
        const flattenedData = fetchedData.map(item => ({

          activityDate: format(new Date(item.userProductivityReportPK.activityDate), 'MM/dd/yyyy'),
          staffName: item.userProductivityReportPK.staffName,
          functionalRole: item.functionalRole,
          // divisionName: item.userProductivityReportPK.divisionName,
          formName: item.userProductivityReportPK.formName,
          countNo: item.userProductivityReportPK.countNo,
      }));

        setData(flattenedData);
        setFilteredData(flattenedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // In case of an error, stop the loading spinner
      });
}, []);

   // Filter data based on From and To dates
   const filterData = () => {
    let filtered = data;

    if (fromDate) {
        filtered = filtered.filter(item => new Date(item.activityDate) >= new Date(fromDate));
    }

    if (toDate) {
        filtered = filtered.filter(item => new Date(item.activityDate) <= new Date(toDate));
    }
console.log(filtered);
    setFilteredData(filtered);
};

const resetFilters = () => {
  console.log('resetFilters invoked');
  setFromDate(null); // Reset from date
  setToDate(null); // Reset to date
  setSearchTerm("");
  setFilteredData(data); // Reset filtered data to original data
};
// Handle search input change
const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  applyGlobalFilter(value);
};

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'fromDate') {
    setFromDate(value);
  } else if (name === 'toDate') {
    setToDate(value);
  }
};

  // Spinner Component
  const spinner = loading ? (
    <div className="spinner-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <ProgressSpinner />
    </div>
  ) : null;

  const header = (

    <div className='data-table1' style={{ border:'1px' }}>
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
     {/* Date Range Inputs */}
     <div>
        {/* <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Claimant Information</h1> */}
        <div className="form-section flex-fill mb-0">
          <div className="form-group row mb-0 mt-3">
            <div className="col-md-2">
              <MDBInput
                type="date"
                label="From Date"
                className="custom-input mb-2"
                name="fromDate"
                onChange={handleChange}
                value={fromDate || ''}
                floating
              />
            </div>
            <div className="col-md-2">
              <MDBInput
                type="date"
                label="To Date"
                onChange={handleChange}
                className="custom-input mb-2"
                name="toDate"
                value={toDate || ''}
                floating
              />
            </div>
            {/* <Button
                    label="Clear Filters"
                    icon="pi pi-times"
                    onClick={() => {
                        setFromDate(null);
                        setToDate(null);
                        setFilteredData(data); // Reset to all data when filters are cleared
                    }}
                    className="p-button-secondary p-ml-3"
                /> */}
            <div className="col-md-1 mb-2">
              <Button label="Reset" icon="pi pi-refresh" size="small" onClick={resetFilters} />
            </div>
            <div className="col-md-2">
              <Button label="Generete Report" icon="pi pi-check" size="small" onClick={filterData}/>
            </div>
            {/* <div className="col-md-2">
            <Button
                    label="Clear Filters"
                    icon="pi pi-times"
                    onClick={() => {
                        setFromDate(null);
                        setToDate(null);
                        setFilteredData(data); // Reset to all data when filters are cleared
                    }}
                    className="p-button-secondary p-ml-3"
                />
            </div> */}

          </div>
        </div>
        <h1></h1>
        <h1></h1>
      </div>
     <div className="p-mb-3">
                {/* <span className="p-mr-3">From Date:</span>
                <Calendar
                    value={fromDate}
                    onChange={(e) => {
                        setFromDate(e.value);
                        filterData(); // Apply filter when from date changes
                    }}
                    showIcon
                    dateFormat="yy-mm-dd"
                />
                <span className="p-mx-3">To Date:</span>
                <Calendar
                    value={toDate}
                    onChange={(e) => {
                        setToDate(e.value);
                        filterData(); // Apply filter when to date changes
                    }}
                    showIcon
                    dateFormat="yy-mm-dd"
                />
                <Button
                    label="Clear Filters"
                    icon="pi pi-times"
                    onClick={() => {
                        setFromDate(null);
                        setToDate(null);
                        setFilteredData(data); // Reset to all data when filters are cleared
                    }}
                    className="p-button-secondary p-ml-3"
                /> */}

      {/* <DataTable value={filteredData} sortMode="multiple" filters={filters}
      loading={loading}
     paginator 
      footer={header}
      rows={5}
      rowsPerPageOptions={[1,2,3,4,5,10,20,50,100]}
      totalRecords={500}
      stripedRows
      scrollable
      scrollHeight="400px"  // Defines vertical scroll height
      responsiveLayout="scroll"
      > */}
 <div style={{ backgroundColor: "skyblue", display: 'flex', justifyContent: 'flex-start', padding: '4px' }}>
        <InputText
          value={searchTerm}  // Bind the input value to the searchTerm state
          onInput={handleSearchChange}
          placeholder="Search"
        />
  </div>
      {spinner}
      {!loading && (
<DataTable value={filteredData} sortMode="multiple" filters={filters}
          paginator
          footer={header}
          rows={10}
          rowsPerPageOptions={[1,2,3,4,5,10,20,50,100]}
          // totalRecords={500}
          stripedRows
          scrollable
          scrollHeight="400px"  // Defines vertical scroll height
          responsiveLayout="scroll"
        >
         <Column field="activityDate" header="Date" sortable headerStyle={{ backgroundColor: '#4babf55e',padding: '16px',paddingLeft:'52px' }} style={{ border: '1px solid #00796b', borderRadius: '1px', padding: '5px',paddingLeft:'52px',width:'10%' }} ></Column>
                {/* <Column field="divisionName" header="Division Name" sortable headerStyle={{ backgroundColor: '#4babf55e' }} style={{ border: '1px solid #00796b', borderRadius: '1px', padding: '5px',paddingLeft:'52px'  }} ></Column> */}
                <Column field="staffName" header="Staff Name" sortable  headerStyle={{ backgroundColor: '#4babf55e',padding: '16px',paddingLeft:'52px' }} style={{ border: '1px solid #00796b', borderRadius: '1px', padding: '1px',paddingLeft:'52px' ,width:'20%' }} ></Column>
                <Column field="functionalRole" header="Functional Role" sortable  headerStyle={{ backgroundColor: '#4babf55e',padding: '16px',paddingLeft:'52px' }} style={{ border: '1px solid #00796b', borderRadius: '1px', padding: '1px',paddingLeft:'52px',width:'30%'  }} ></Column>
                <Column field="formName" header="Form Name" sortable headerStyle={{ backgroundColor: '#4babf55e' ,padding: '16px',paddingLeft:'52px'}} style={{ border: '1px solid #00796b', borderRadius: '1px', padding: '1px',paddingLeft:'52px' ,width:'30%' }} ></Column>
                <Column field="countNo" header="Count" sortable headerStyle={{ backgroundColor: '#4babf55e',padding: '16px',paddingLeft:'52px' }} style={{ border: '1px solid #00796b', borderRadius: '1px', padding: '5px',paddingLeft:'52px',width:'10%'  }} ></Column>
      </DataTable>
      )}
    </div>
    </div>
  );
}

export default ReportPageComponent;
