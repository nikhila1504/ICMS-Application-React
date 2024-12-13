import DataTableComponent from "./DataTableComponent.js";
import { MDBInput } from 'mdb-react-ui-kit';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Link, useNavigate } from "react-router-dom";
import ClaimService from "../services/claim.service";
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // or your chosen theme
import 'primereact/resources/primereact.min.css'; // Core styles
import 'primeicons/primeicons.css';

const ManageMatchingClaims = () => {
    const initialFormValues = {
        dateOfInjury: '',
        firstName: '',
        lastName: '',
        dateOfBirth: ''
    };

    const [formData, setFormData] = useState(initialFormValues);
    const [posts, setPosts] = useState([]);
    const [selectedClaims, setSelectedClaims] = useState([]);
    const [isFileButtonDisabled, setFileButtonDisabled] = useState(true);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectionChange = (e) => {
        const selectedRows = e.value;
        setSelectedClaims(selectedRows);
        // Enable button if there are selected rows and records in the table
        setFileButtonDisabled(selectedRows.length === 0);
    };

    const handleReset = () => {
        setFormData(initialFormValues);
        setPosts([]);                    
        setSelectedClaims([]);           
        setFileButtonDisabled(true); 
    };

    const formatDate = (date) => {
        const d = new Date(date);
        if (isNaN(d)) {
            return 'Invalid Date';
        }
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!formData || !formData.firstName || !formData.lastName) {
            console.error('Form data is incomplete!');
            return;
        }

        try {
            const response = await ClaimService.searchClaim(formData);
            console.log("handleSearch", response.data);
            setPosts(response.data);
            // Enable button if there are records after search
            setFileButtonDisabled(selectedClaims.length === 0);
        } catch (error) {
            console.error('Error fetching claims:', error);
        }
    };

    return (
        <div>
            <DataTableComponent />
            <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>WC-1, Employers First Report of Injury</h1>
            <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Search</h1>
            <div className="form-section flex-fill">
                <div className="form-group row mb-3 mt-3">
                    <div className="col-md-3">
                        <MDBInput
                            label="Date Of Injury:"
                            autoComplete="off"
                            type="date"
                            id="dateOfInjury"
                            name="dateOfInjury"
                            value={formData.dateOfInjury}
                            onChange={handleChange}
                            floating
                            className="custom-border"
                            style={{ borderColor: 'blue', width: '100%' }}
                        />
                    </div>
                    <div className="col-md-3">
                        <MDBInput
                            label="Employee First Name:"
                            autoComplete="off"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            floating
                            className="custom-border"
                            style={{ borderColor: 'blue', width: '100%' }}
                        />
                    </div>
                    <div className="col-md-3">
                        <MDBInput
                            label="Employee Last Name:"
                            autoComplete="off"
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            floating
                            className="custom-border"
                            style={{ borderColor: 'blue', width: '100%' }}
                        />
                    </div>
                    <div className="col-md-3">
                        <MDBInput
                            label="Date Of Birth:"
                            autoComplete="off"
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            floating
                            className="custom-border"
                            style={{ borderColor: 'blue', width: '100%' }}
                        />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12 d-flex flex-wrap flex-md-nowrap">
                        <div className="mx-1">
                            <button className="btn btn-lg custom-btn" onClick={handleReset}>
                                <i className="pi pi-refresh"></i> Reset
                            </button>
                        </div>
                        <div className="mx-1">
                            <button className="btn btn-lg custom-btn" onClick={handleSearch}>
                                <i className="pi pi-search"></i> Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-4">
                <div className="container mt-4">
                    <DataTable
                        value={posts}
                        paginator
                        rows={5}
                        totalRecords={posts.length}
                        stripedRows
                        selection={selectedClaims}
                        onSelectionChange={handleSelectionChange}
                        selectionMode="checkbox"
                        dataKey="id"
                        responsiveLayout="scroll"
                    >
                        <Column field="id" header="ID" sortable headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} />
                        <Column field="dateOfInjury" header="Date Of Injury" sortable headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} />
                        <Column field="claimant.fullName" header="Employee Name" sortable headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} />
                        <Column field="claimant.dateOfBirth" header="Date Of Birth" sortable body={(rowData) => formatDate(rowData.claimant.dateOfBirth)} headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} />
                        <Column
                            selectionMode="multiple" headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }}
                            // style={{ width: '4rem' }} 
                            style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }}
                        />
                    </DataTable>
                </div>

                {/* <DataTable
                    value={posts}
                    paginator
                    rows={5}
                    totalRecords={posts.length}
                    stripedRows
                    selection={selectedClaims}  
                    onSelectionChange={handleSelectionChange}  
                    selectionMode="checkbox"
                    dataKey="id"
                >
                    <Column field="id" header="ID" sortable headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} />
                    <Column field="dateOfInjury" header="Date Of Injury" sortable headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} />
                    <Column field="claimant.fullName" header="Employee Name" sortable headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} />
                    <Column field="claimant.dateOfBirth" header="Date Of Birth" sortable body={(rowData) => formatDate(rowData.claimant.dateOfBirth)} headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} />
                    <Column field="Select" header="Select"   onSelectionChange={handleSelectionChange}
                    selectionMode="checkbox" body={(rowData) => (
                        <input type="checkbox" value={rowData.id} />
                    )} headerStyle={{ backgroundColor: '#0A3161', color: 'white', border: '1px solid black' }} style={{ border: '1px solid #0A3161', borderRadius: '1px', padding: '10px' }} /> 
                </DataTable> */}
            </div>

            <div className="row mt-4">
                <div className="col-12 d-flex justify-content-center flex-wrap flex-md-nowrap">
                    <div className="mx-1">
                        <button className="btn btn-lg custom-btn">
                            <i className="pi pi-arrow-circle-left"></i> Back
                        </button>
                    </div>
                    <div className="mx-1">
                        <button className="btn btn-lg custom-btn" disabled={isFileButtonDisabled}>
                            <i className="pi pi-folder-open"></i> File In Existing Claim
                        </button>
                    </div>
                    <div className="mx-1">
                        <Link to="/wc1">
                            <button className="btn btn-lg custom-btn">
                                <i className="pi pi-folder-open" style={{ fontSize: '1rem' }}></i> New Claim
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMatchingClaims;