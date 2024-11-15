// import logo from './logo.svg';
// import './App.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/nova-alt/theme.css';
import 'primereact/resources/primereact.min.css';

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

const ReportPageComponent = () => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(data);  // The state for the filtered data
    const [fromDate, setFromDate] = useState(null);  // From date state
    const [toDate, setToDate] = useState(null);  // To date state

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
            body: data,
            startY: 20,
            theme: 'grid',
        });

        doc.save('UserProductivityReport.pdf');
    };


  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const workSheet = xlsx.utils.json_to_sheet(data);
      const workBook = { Sheets: { data: workSheet }, SheetNames: ["data"]}
      const excelBuffer = xlsx.write(workBook, {
       bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "data");
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


  useEffect(() => {
    ReportService.getUserReport()
      .then((response) => {
        const fetchedData = response.data
        const flattenedData = fetchedData.map(item => ({

          activityDate: format(new Date(item.userProductivityReportPK.activityDate), 'yyyy/MM/dd'),
          countNo: item.userProductivityReportPK.countNo,
          divisionName: item.userProductivityReportPK.divisionName,
          formName: item.userProductivityReportPK.formName,
          staffName: item.userProductivityReportPK.staffName,
          functionalRole: item.functionalRole
      }));
        console.log(response.data);
        setData(flattenedData);
        setFilteredData(flattenedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
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
     <div className="p-mb-3">
                <span className="p-mr-3">From Date:</span>
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
                />
       
      <DataTable value={filteredData} sortMode="multiple" filters={filters}
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
      >
         <Column field="activityDate" header="Activity Date" sortable></Column>
                <Column field="countNo" header="Count No" sortable></Column>
                <Column field="divisionName" header="Division Name" sortable></Column>
                <Column field="formName" header="Form Name" sortable></Column>
                <Column field="staffName" header="Staff Name" sortable></Column>
                <Column field="functionalRole" header="Functional Role" sortable></Column>
      </DataTable>

    </div>
    </div>
  );
}

export default ReportPageComponent;
