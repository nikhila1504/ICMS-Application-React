import DataTableComponent from "./DataTableComponent.js";
import { MDBInput } from 'mdb-react-ui-kit';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
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
    const [formDetails, setFormDetails] = useState({});
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [selectedClaims, setSelectedClaims] = useState([]);
    const [isFileButtonDisabled, setFileButtonDisabled] = useState(true);
    const [errorBannerVisible, setErrorBannerVisible] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    // const [formErrors, setFormErrors] = useState({
    //     dateOfInjury: '',
    //     firstName: '',
    //     lastName: '',
    //     dateOfBirth: ''
    // });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setTouched({ ...touched, [name]: true, });
        setFormErrors({ ...formErrors, [name]: '' });
        setErrorBannerVisible(false);
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
        setErrorBannerVisible(false);
        const errors = {};
        let isValid = true;
        if (!formData.dateOfInjury) { errors.dateOfInjury = 'Required'; isValid = false; }
        if (!formData.firstName) { errors.firstName = 'Required'; isValid = false; }
        if (!formData.lastName) { errors.lastName = 'Required'; isValid = false; }
        if (!formData.dateOfBirth) { errors.dateOfBirth = 'Required'; isValid = false; }

        setFormErrors(errors);
        if (!isValid) return;
        try {
            const response = await ClaimService.searchClaim(formData);
            console.log("handleSearch", response.data);
            setPosts(response.data);
            setFileButtonDisabled(selectedClaims.length === 0);
        } catch (error) {
            console.error('Error fetching claims:', error);
        }
    };
    const normalizeDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const handleNewClaim = () => {
        setErrorBannerVisible(false);
        if (!formData.dateOfInjury || !formData.firstName || !formData.lastName || !formData.dateOfBirth) {
            setErrorBannerVisible(true);
            return;
        }
        const normalizedFormDOB = normalizeDate(formData.dateOfBirth);
        const dobExists = posts.some(post => {
            const normalizedPostDOB = normalizeDate(post.claimant.dateOfBirth);
            return normalizedPostDOB === normalizedFormDOB;
        });
        if (dobExists) {
            setFormDetails(formData);
            setConfirmationVisible(true);
        } else {
            setErrorBannerVisible(true);
        }
    };
    const handleConfirm = () => {
        navigate('/wc1');
    };
    const handleCancel = () => {
        setConfirmationVisible(false);
    };
    const getInputClassName = (field) => {
        const errorClass = formErrors[field] ? 'custom-border custom-error' : 'custom-border';
        console.log(`Field: ${field}, Class: ${errorClass}`);
        return errorClass;
    };

    return (
        <div>
            <DataTableComponent />
            <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>WC-1, Employers First Report of Injury</h1>
            {errorBannerVisible && (
                <div style={{
                    backgroundColor: '#B31942',
                    color: 'white',
                    padding: '10px',
                    fontWeight: 'bold',
                    marginBottom: '20px'
                }}>
                    <i className="pi pi-times-circle" style={{ color: 'white', fontSize: '1rem' }}></i>  Claim exists with the given Search Criteria. Please file in Existing Claim.
                </div>
            )}
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
                            className={getInputClassName('dateOfInjury')}
                            style={{ borderColor: 'blue', width: '100%' }}
                        />
                        {formErrors.dateOfInjury && <small className="custom-error-message">{formErrors.dateOfInjury}</small>}
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
                            className={getInputClassName('firstName')}
                            style={{ borderColor: 'blue', width: '100%' }}
                        />
                        {formErrors.firstName && <small className="custom-error-message">{formErrors.firstName}</small>}
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
                            className={getInputClassName('lastName')}
                            style={{ borderColor: 'blue', width: '100%' }}
                        />
                        {formErrors.lastName && <small className="custom-error-message">{formErrors.lastName}</small>}
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
                            className={getInputClassName('dateOfBirth')}
                            style={{ borderColor: 'blue', width: '100%' }}
                        />
                        {formErrors.dateOfBirth && <small className="custom-error-message">{formErrors.dateOfBirth}</small>}
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
                        {/* <Link to="/wc1"> */}
                        <button className="btn btn-lg custom-btn" onClick={handleNewClaim}>
                            <i className="pi pi-folder-open" style={{ fontSize: '1rem' }}></i> New Claim
                        </button>
                        {/* </Link> */}
                    </div>
                    {confirmationVisible && (
                        <div
                            className="custom-modal-overlay"
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 9999,
                            }}
                            onClick={handleCancel}
                        >
                            <div
                                className="custom-modal-content"
                                style={{
                                    backgroundColor: "white",
                                    padding: "3px",
                                    width: "50vw",
                                    borderRadius: "0px",
                                    position: "relative",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: "#0A3161",
                                        color: "white",
                                        padding: "10px 20px",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <span>
                                        <i className="pi pi-exclamation-triangle" style={{ marginRight: "10px" }}></i>
                                        Are you sure you want to create a new claim? The information below cannot be edited once you start filling the form.
                                    </span>
                                    <button
                                        onClick={handleCancel}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "white",
                                            fontSize: "1.0rem",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <i className="pi pi-times"></i>
                                    </button>
                                </div>

                                <div className="d-flex mb-3">
                                    <div style={{ marginRight: "20%" }}><strong>Employee First Name:</strong> {formDetails.firstName}</div>
                                    <div><strong>Employee Last Name:</strong> {formDetails.lastName}</div>
                                </div>

                                <div className="d-flex mb-3">
                                    <div style={{ marginRight: "23%" }}><strong>Date of Birth:</strong> {formDetails.dateOfBirth}</div>
                                    <div><strong>Date of Injury:</strong> {formDetails.dateOfInjury}</div>
                                </div>

                                <div className="d-flex justify-content-end mt-3">
                                    <Button label="Cancel" icon="pi pi-times" onClick={handleCancel} className="btn btn-md custom-btn" style={{ marginRight: '5px' }} />
                                    <Button label="OK" icon="pi pi-check" onClick={handleConfirm} className="btn btn-md custom-btn" autoFocus />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageMatchingClaims;